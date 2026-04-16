import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import axios from 'axios';
import { getAIResponse } from '@/lib/ai';
import { getEnvVar } from '@/lib/ai';

const LINE_REPLY_URL = 'https://api.line.me/v2/bot/message/reply';

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
  processEvents(body).catch((err) =>
    console.error('[Line] processEvents error:', err)
  );

  return response;
}

async function replyMessage(replyToken: string, text: string): Promise<void> {
  const channelAccessToken = getEnvVar('LINE_CHANNEL_ACCESS_TOKEN');
  try {
    await axios.post(
      LINE_REPLY_URL,
      {
        replyToken,
        messages: [{ type: 'text', text }],
      },
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

async function processEvents(body: Record<string, unknown>): Promise<void> {
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

    try {
      const reply = await getAIResponse(`line_${userId}`, userText);
      await replyMessage(replyToken, reply);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('[Line] AI error:', error.message);
      await replyMessage(
        replyToken,
        'ขออภัยครับ เกิดข้อผิดพลาดชั่วคราว รบกวนลองใหม่อีกครั้งนะครับ 🙏'
      );
    }
  }
}
