import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { getSystemPrompt } from './systemPrompt';

// Read .env/.env.local directly to avoid Claude Code env injection override
function readEnvFile(): Record<string, string> {
  const vars: Record<string, string> = {};
  const candidates = ['.env.local', '.env'];
  for (const filename of candidates) {
    try {
      const envPath = path.join(process.cwd(), filename);
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const match = line.match(/^([^=#][^=]*)=(.*)$/);
        if (match) vars[match[1].trim()] = match[2].trim();
      }
    } catch {
      // file not found — continue
    }
  }
  return vars;
}

const envVars = readEnvFile();

export function getEnvVar(key: string): string {
  return envVars[key] || process.env[key] || '';
}

const apiKey = getEnvVar('ANTHROPIC_API_KEY');
const client = new Anthropic({ apiKey });

// In-memory conversation history keyed by userId, max 20 messages
type MessageParam = { role: 'user' | 'assistant'; content: string };
const conversationHistory = new Map<string, MessageParam[]>();

function getHistory(userId: string): MessageParam[] {
  if (!conversationHistory.has(userId)) {
    conversationHistory.set(userId, []);
  }
  return conversationHistory.get(userId)!;
}

function trimHistory(history: MessageParam[]): void {
  if (history.length > 20) {
    history.splice(0, history.length - 20);
  }
}

export async function getAIResponse(userId: string, userMessage: string): Promise<string> {
  const history = getHistory(userId);

  history.push({ role: 'user', content: userMessage });
  trimHistory(history);

  const systemPrompt = await getSystemPrompt();
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: [
      {
        type: 'text',
        text: systemPrompt,
        cache_control: { type: 'ephemeral' }, // Cache system prompt → ลดค่าใช้จ่าย ~90%
      },
    ],
    messages: history,
  });

  const assistantMessage = (response.content[0] as { type: string; text: string }).text;
  history.push({ role: 'assistant', content: assistantMessage });

  return assistantMessage;
}

// วิเคราะห์รูปภาพที่ลูกค้าส่งมา ใช้ Claude Vision
export async function getAIResponseWithImage(
  userId: string,
  imageBase64: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
): Promise<string> {
  const history = getHistory(userId);
  const systemPrompt = await getSystemPrompt();

  // สร้าง messages array รวม history เดิม + รูปภาพใหม่
  const messages: Anthropic.MessageParam[] = [
    ...history.map(h => ({ role: h.role, content: h.content as string })),
    {
      role: 'user' as const,
      content: [
        {
          type: 'image' as const,
          source: {
            type: 'base64' as const,
            media_type: mediaType,
            data: imageBase64,
          },
        },
        {
          type: 'text' as const,
          text: `ลูกค้าส่งรูปมาค่ะ กรุณาวิเคราะห์รูปนี้ว่าเป็นประเภทไหน ใน 2 กรณี:

**กรณีที่ 1: รูปเป็นสลิปโอนเงิน** (มีโลโก้ธนาคาร, ตัวเลขจำนวนเงิน, เลขบัญชีปลายทาง)
ให้ตรวจสอบ 3 จุดนี้ เทียบกับข้อมูลร้าน:
- **ธนาคารปลายทาง** ต้องเป็น TTB / ทหารไทยธนชาต
- **เลขบัญชีปลายทาง** ต้องเป็น 0752155721 (หรือ 075-2-15572-1)
- **ชื่อบัญชีปลายทาง** ต้องเป็น อมรรัตน์ อุปถัมชาติ (หรือ อมรรัตน์ อุปถัมภ์ชาติ)
- **จำนวนเงิน** ต้องตรงกับยอดที่ลูกค้าสั่งซื้อ (ดูจากบทสนทนาก่อนหน้า)

ตอบรูปแบบนี้:
- ถ้าถูกต้องครบทุกจุด: "รับทราบค่ะ ตรวจสอบสลิปแล้ว ✅ เลขบัญชี ชื่อ และยอดโอน [XXXX] บาท ถูกต้องนะคะ ทีมงานจะจัดส่งและแจ้งเลขพัสดุในแชทนี้ค่ะ 📦"
- ถ้ามีจุดใดไม่ตรง: ระบุจุดที่ผิดชัดเจน เช่น "ขออภัยค่ะ ตรวจสอบสลิปแล้วพบว่า ยอดโอน 1,390 บาท แต่ยอดสั่งซื้อจริง 1,450 บาท รบกวนโอนเพิ่ม 60 บาท และส่งสลิปมาใหม่ด้วยนะคะ 🙏"
- ถ้าอ่านรูปไม่ชัด: "ขออภัยค่ะ รูปสลิปไม่ชัดเจน รบกวนส่งรูปที่ชัดกว่านี้อีกครั้งด้วยนะคะ 🙏"

**กรณีที่ 2: รูปเป็นสินค้า** (เสื้อผ้า รองเท้า อุปกรณ์ ฯลฯ)
- ถ้าเป็นสินค้าของ BOGIE.1 ให้บอกชื่อรุ่นและราคา
- ถ้าไม่ใช่ ให้แนะนำสินค้าที่ใกล้เคียงจากรายการของร้าน

**กรณีอื่นๆ** (เช่น รูปที่อยู่ บัตรประชาชน ฯลฯ)
- ตอบตามบริบทที่เหมาะสม

ตอบภาษาไทยสุภาพ ใช้ "ค่ะ" "นะคะ" และเรียก "ลูกค้า"`,
        },
      ],
    },
  ];

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const assistantMessage = (response.content[0] as { type: string; text: string }).text;

  // บันทึก history เป็น text (รูปภาพไม่เก็บ)
  history.push({ role: 'user', content: '[ลูกค้าส่งรูปสินค้า]' });
  history.push({ role: 'assistant', content: assistantMessage });
  trimHistory(history);

  return assistantMessage;
}

export function clearHistory(userId: string): void {
  conversationHistory.delete(userId);
}

// ดึง text จาก history ล่าสุด N ข้อความ (ใช้เป็น context สำหรับค้นหารุ่นสินค้า)
export function getRecentMessages(userId: string, n = 6): string[] {
  const history = conversationHistory.get(userId) ?? [];
  return history.slice(-n).map(m => m.content);
}
