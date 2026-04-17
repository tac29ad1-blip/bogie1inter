import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import axios from 'axios';
import { getAIResponse } from '@/lib/ai';
import { getEnvVar } from '@/lib/ai';
import { hasSizeColorQuery, findProductSizeChart } from '@/lib/products';

const LINE_REPLY_URL = 'https://api.line.me/v2/bot/message/reply';

// คำที่เกี่ยวกับการเปลี่ยนสินค้า
const EXCHANGE_KEYWORDS = ['เปลี่ยนสินค้า', 'เปลี่ยนของ', 'เปลี่ยนไซส์', 'เปลี่ยนสี', 'return', 'exchange', 'คืนสินค้า'];

function isExchangeRequest(text: string): boolean {
  const lower = text.toLowerCase();
  return EXCHANGE_KEYWORDS.some(kw => lower.includes(kw));
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
  sizeChartImageUrl: string | null = null
): Promise<void> {
  const channelAccessToken = getEnvVar('LINE_CHANNEL_ACCESS_TOKEN');

  // สร้างรายการ messages (LINE รับได้สูงสุด 5 messages ต่อ reply)
  const messages: object[] = [{ type: 'text', text }];

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
    if (message?.type !== 'text') continue;

    const source = event.source as Record<string, string> | undefined;
    const userId = source?.userId;
    const userText = message.text as string;
    const replyToken = event.replyToken as string;

    if (!userId || !userText || !replyToken) continue;

    console.log(`[Line] Message from ${userId}: ${userText}`);

    // ดึง base URL จาก request headers เพื่อใช้ใน image URL
    const host = req.headers.get('host') || '';
    const proto = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${proto}://${host}`;

    // ตรวจว่าลูกค้าถามเรื่องเปลี่ยนสินค้าหรือเปล่า
    const sendExchangeImages = isExchangeRequest(userText);

    // ตรวจว่าลูกค้าถามเรื่องไซส์/สี/ขนาด และหารูปตารางไซส์ถ้ามี
    let sizeChartImageUrl: string | null = null;
    if (hasSizeColorQuery(userText)) {
      const chartPath = await findProductSizeChart(userText);
      if (chartPath) {
        sizeChartImageUrl = `${baseUrl}${chartPath}`;
      }
    }

    try {
      const reply = await getAIResponse(`line_${userId}`, userText);
      await replyMessage(replyToken, reply, sendExchangeImages, baseUrl, sizeChartImageUrl);
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
