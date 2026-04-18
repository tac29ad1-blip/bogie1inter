import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import axios from 'axios';
import { getAIResponse, getAIResponseWithImage, clearHistory, getRecentMessages } from '@/lib/ai';
import { getEnvVar } from '@/lib/ai';
import { hasSizeColorQuery, findProductSizeChart } from '@/lib/products';

const LINE_REPLY_URL = 'https://api.line.me/v2/bot/message/reply';

// คำที่เกี่ยวกับการเปลี่ยนสินค้า
const EXCHANGE_KEYWORDS = ['เปลี่ยนสินค้า', 'เปลี่ยนของ', 'เปลี่ยนไซส์', 'เปลี่ยนสี', 'เปลี่ยน', 'return', 'exchange', 'คืนสินค้า', 'คืนของ'];

function isExchangeRequest(text: string): boolean {
  const lower = text.toLowerCase();
  return EXCHANGE_KEYWORDS.some(kw => lower.includes(kw));
}

// ลิงก์หมวดหมู่สินค้า — เก็บไว้ใน code เพื่อป้องกัน AI เปลี่ยน URL
const CATEGORY_LINKS: { keywords: string[]; url: string }[] = [
  { keywords: ['กางเกง'], url: 'https://www.bogie1inter.com/category/Pants' },
  { keywords: ['รองเท้า', 'บู้ท', 'คอมแบท บู้ท'], url: 'https://www.bogie1inter.com/category/Shoes' },
  { keywords: ['เสื้อเกราะ', 'เกราะ'], url: 'https://www.bogie1inter.com/category/ARMOR' },
  { keywords: ['เข็มขัด', 'battle belt'], url: 'https://www.bogie1inter.com/category/B\u0E3Aogie1-Belt' },
  { keywords: ['ซองปืน', 'ซองแม็ก', 'เพลทเหน็บ', 'holster'], url: 'https://www.bogie1inter.com/category/%E0%B9%87Holster' },
  { keywords: ['กระเป๋าซ่อนปืน', 'กระเป๋าเก็บปืน', 'pistol bag'], url: 'https://www.bogie1inter.com/category/Pistol-Bag' },
  { keywords: ['กระเป๋าเป้', 'เป้สะพาย', 'backpack', 'กระเป๋าสะพาย'], url: 'https://www.bogie1inter.com/category/Backpack-CrossBag' },
  { keywords: ['กระเป๋าเอนกประสงค์', 'กระเป๋าโน้ตบุค', 'กระเป๋าใส่เข็มขัด'], url: 'https://www.bogie1inter.com/category/Bag' },
  { keywords: ['เสื้อยืด', 'เสื้อเชิ้ต', 'โปโล', 'คอมแบทเชิ้ต', 't-shirt'], url: 'https://www.bogie1inter.com/category/T-Shirt' },
  { keywords: ['เสื้อกั๊ก'], url: 'https://www.bogie1inter.com/category/Bogie1-%E0%B9%80%E0%B8%AA%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%81%E0%B8%B1%E0%B9%8A%E0%B8%81' },
  { keywords: ['ชุดเวส', 'ชุดฝึก', 'ชุด คฝ', 'ชุด ปจ', 'คฝ', 'ปจ'], url: 'https://www.bogie1inter.com/category/Bogie1-%E0%B9%80%E0%B8%AA%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%81%E0%B8%B1%E0%B9%8A%E0%B8%81' },
  { keywords: ['อุปกรณ์ติดเกราะ', 'อุปกรณ์เกราะ', 'armor acc'], url: 'https://www.bogie1inter.com/category/Armor-Acc' },
  { keywords: ['แจ็กเก็ต', 'flight jacket', 'jacket'], url: 'https://www.bogie1inter.com/category/Jacket' },
  { keywords: ['ดิ้ว', 'ไฟฉาย', 'ซองไฟฉาย', 'ซองวิทยุ', 'กุญแจมือ', 'ซองกุญแจมือ'], url: 'https://www.bogie1inter.com/category/Others' },
];

// ตรวจว่าลูกค้าถามหมวดหมู่ไหน แล้วคืน URL ที่ถูกต้อง
function getCategoryLink(text: string): string | null {
  const lower = text.toLowerCase();
  for (const cat of CATEGORY_LINKS) {
    if (cat.keywords.some(kw => lower.includes(kw))) {
      return cat.url;
    }
  }
  return null;
}

// POST: Line OA webhook handler
export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.text();
  const signature = req.headers.get('x-line-signature') || '';

  // Validate Line signature
  const channelSecret = getEnvVar('LINE_CHANNEL_SECRET');
  if (channelSecret) {
    const hash = crypto
      .createHmac('sha256', channelSecret)
      .update(rawBody)
      .digest('base64');
    if (hash !== signature) {
      console.warn('[Line] Invalid signature');
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new NextResponse('Bad Request', { status: 400 });
  }

  // Respond 200 immediately so Line does not retry
  const response = new NextResponse('OK', { status: 200 });

  // Process events asynchronously
  processEvents(body, req).catch((err) =>
    console.error('[Line] processEvents error:', err)
  );

  return response;
}

async function replyMessage(
  replyToken: string,
  text: string,
  includeExchangeImages = false,
  baseUrl = '',
  sizeChartImageUrl: string | null = null,
  categoryLink: string | null = null
): Promise<void> {
  const channelAccessToken = getEnvVar('LINE_CHANNEL_ACCESS_TOKEN');

  // สร้างรายการ messages (LINE รับได้สูงสุด 5 messages ต่อ reply)
  const messages: object[] = [{ type: 'text', text }];

  // ส่งลิงก์หมวดหมู่สินค้า (URL มาจาก code ไม่ใช่จาก AI เพื่อให้ถูกต้อง 100%)
  if (categoryLink) {
    messages.push({ type: 'text', text: categoryLink });
  }

  // ส่งรูปตารางไซส์สินค้า (ถ้ามี)
  if (sizeChartImageUrl) {
    messages.push(
      { type: 'image', originalContentUrl: sizeChartImageUrl, previewImageUrl: sizeChartImageUrl }
    );
  }

  // ส่งรูปขั้นตอนการเปลี่ยนสินค้า
  if (includeExchangeImages && baseUrl) {
    const img1 = `${baseUrl}/exchange-step1.jpg`;
    const img2 = `${baseUrl}/exchange-step2.jpg`;
    messages.push(
      { type: 'image', originalContentUrl: img1, previewImageUrl: img1 },
      { type: 'image', originalContentUrl: img2, previewImageUrl: img2 }
    );
  }

  try {
    await axios.post(
      LINE_REPLY_URL,
      { replyToken, messages },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${channelAccessToken}`,
        },
      }
    );
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data: unknown }; message: string };
    console.error('[Line] Reply error:', axiosErr.response?.data || axiosErr.message);
  }
}

async function processEvents(body: Record<string, unknown>, req: NextRequest): Promise<void> {
  const events = (body.events as Array<Record<string, unknown>>) || [];

  for (const event of events) {
    // Only handle text message events
    if (event.type !== 'message') continue;

    const message = event.message as Record<string, unknown> | undefined;
    if (message?.type !== 'text' && message?.type !== 'image') continue;

    const source = event.source as Record<string, string> | undefined;
    const userId = source?.userId;
    const userText = (message.text as string) || '';
    const replyToken = event.replyToken as string;

    if (!userId || !replyToken) continue;

    // จัดการรูปภาพที่ลูกค้าส่งมา
    if (message?.type === 'image') {
      const messageId = message.id as string;
      try {
        // ดาวน์โหลดรูปจาก LINE Data API
        const channelAccessToken = getEnvVar('LINE_CHANNEL_ACCESS_TOKEN');
        const imgRes = await axios.get(
          `https://api-data.line.me/v2/bot/message/${messageId}/content`,
          { headers: { Authorization: `Bearer ${channelAccessToken}` }, responseType: 'arraybuffer' }
        );
        const imageBase64 = Buffer.from(imgRes.data).toString('base64');
        const contentType = (imgRes.headers['content-type'] as string) || 'image/jpeg';
        const mediaType = (['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(contentType)
          ? contentType
          : 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

        const reply = await getAIResponseWithImage(`line_${userId}`, imageBase64, mediaType);
        await replyMessage(replyToken, reply);
      } catch (err: unknown) {
        const error = err as Error;
        console.error('[Line] Image processing error:', error.message);
        await replyMessage(replyToken, 'ขอโทษค่ะ ไม่สามารถวิเคราะห์รูปภาพได้ในขณะนี้ รบกวนอธิบายสินค้าที่ต้องการเป็นข้อความได้เลยนะคะ 🙏');
      }
      continue;
    }

    if (!userText) continue;

    console.log(`[Line] Message from ${userId}: ${userText}`);

    // คำสั่งล้าง history
    if (userText.trim() === 'รีเซ็ต' || userText.trim().toLowerCase() === 'reset') {
      clearHistory(`line_${userId}`);
      await replyMessage(replyToken, 'ล้างประวัติการสนทนาแล้วค่ะ เริ่มใหม่ได้เลยนะคะ 😊');
      continue;
    }

    // ดึง base URL จาก request headers เพื่อใช้ใน image URL
    const host = req.headers.get('host') || '';
    const proto = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${proto}://${host}`;

    // ตรวจว่าลูกค้าถามเรื่องเปลี่ยนสินค้าหรือเปล่า
    const sendExchangeImages = isExchangeRequest(userText);

    // ตรวจว่าลูกค้าถามเรื่องไซส์/สี/ขนาด และหารูปตารางไซส์ถ้ามี
    let sizeChartImageUrl: string | null = null;
    if (hasSizeColorQuery(userText)) {
      try {
        // ใช้ context จาก history ล่าสุด 6 ข้อความ เพื่อหารุ่นสินค้าที่พูดถึงก่อนหน้า
        const recentContext = getRecentMessages(`line_${userId}`, 6);
        const chartPath = await findProductSizeChart(userText, recentContext);
        if (chartPath) {
          sizeChartImageUrl = `${baseUrl}${chartPath}`;
        }
      } catch (err) {
        console.error('[Line] findProductSizeChart error:', err);
      }
    }

    // ตรวจว่าลูกค้าถามหมวดสินค้ากว้างๆ → แนบลิงก์จาก code (ไม่ให้ AI generate URL เอง)
    const categoryLink = getCategoryLink(userText);

    try {
      const reply = await getAIResponse(`line_${userId}`, userText);
      await replyMessage(replyToken, reply, sendExchangeImages, baseUrl, sizeChartImageUrl, categoryLink);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('[Line] AI error:', error.message);
      await replyMessage(
        replyToken,
        'ขออภัยค่ะ เกิดข้อผิดพลาดชั่วคราว รบกวนลองใหม่อีกครั้งนะคะ 🙏'
      );
    }
  }
}
