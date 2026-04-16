import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import axios from 'axios';
import { getAIResponse } from '@/lib/ai';
import { getEnvVar } from '@/lib/ai';

const FB_GRAPH_URL = 'https://graph.facebook.com/v20.0/me/messages';

// GET: Facebook webhook verification
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = getEnvVar('FB_VERIFY_TOKEN');

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[Facebook] Webhook verified');
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn('[Facebook] Webhook verification failed');
  return new NextResponse('Forbidden', { status: 403 });
}

// POST: Facebook webhook message handler
export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.text();
  const signature = req.headers.get('x-hub-signature-256') || '';

  // Validate signature
  const appSecret = getEnvVar('FB_APP_SECRET');
  if (appSecret) {
    const expected =
      'sha256=' +
      crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex');
    const sigBuffer = Buffer.from(signature);
    const expBuffer = Buffer.from(expected);
    if (
      sigBuffer.length !== expBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expBuffer)
    ) {
      console.warn('[Facebook] Invalid signature');
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new NextResponse('Bad Request', { status: 400 });
  }

  if (body.object !== 'page') {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Respond 200 immediately so Facebook does not retry
  const response = new NextResponse('EVENT_RECEIVED', { status: 200 });

  // Process messages asynchronously
  processEvents(body).catch((err) =>
    console.error('[Facebook] processEvents error:', err)
  );

  return response;
}

async function sendMessage(recipientId: string, text: string): Promise<void> {
  const pageAccessToken = getEnvVar('FB_PAGE_ACCESS_TOKEN');
  try {
    await axios.post(
      FB_GRAPH_URL,
      {
        recipient: { id: recipientId },
        message: { text },
        messaging_type: 'RESPONSE',
      },
      {
        params: { access_token: pageAccessToken },
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data: unknown }; message: string };
    console.error('[Facebook] Send error:', axiosErr.response?.data || axiosErr.message);
  }
}

async function sendTyping(recipientId: string): Promise<void> {
  const pageAccessToken = getEnvVar('FB_PAGE_ACCESS_TOKEN');
  try {
    await axios.post(
      FB_GRAPH_URL,
      {
        recipient: { id: recipientId },
        sender_action: 'typing_on',
      },
      { params: { access_token: pageAccessToken } }
    );
  } catch {
    // ignore typing indicator errors
  }
}

async function processEvents(body: Record<string, unknown>): Promise<void> {
  const entries = (body.entry as Array<Record<string, unknown>>) || [];

  for (const entry of entries) {
    const messaging = (entry.messaging as Array<Record<string, unknown>>) || [];

    for (const event of messaging) {
      const sender = event.sender as Record<string, string> | undefined;
      const senderId = sender?.id;
      if (!senderId) continue;

      const message = event.message as Record<string, unknown> | undefined;

      // Skip echo messages (sent by the page itself)
      if (message?.is_echo) continue;

      // Handle text messages
      if (message?.text) {
        const userText = message.text as string;
        console.log(`[Facebook] Message from ${senderId}: ${userText}`);

        await sendTyping(senderId);

        try {
          const reply = await getAIResponse(`fb_${senderId}`, userText);
          await sendMessage(senderId, reply);
        } catch (err: unknown) {
          const error = err as Error;
          console.error('[Facebook] AI error:', error.message);
          await sendMessage(
            senderId,
            'ขออภัยครับ เกิดข้อผิดพลาดชั่วคราว รบกวนลองใหม่อีกครั้งนะครับ 🙏'
          );
        }
      }

      // Handle postbacks (button clicks)
      const postback = event.postback as Record<string, string> | undefined;
      if (postback?.payload) {
        console.log(`[Facebook] Postback from ${senderId}: ${postback.payload}`);
        await sendTyping(senderId);
        try {
          const reply = await getAIResponse(
            `fb_${senderId}`,
            postback.title || postback.payload
          );
          await sendMessage(senderId, reply);
        } catch (err: unknown) {
          const error = err as Error;
          console.error('[Facebook] Postback AI error:', error.message);
          await sendMessage(
            senderId,
            'ขออภัยครับ เกิดข้อผิดพลาดชั่วคราว รบกวนลองใหม่อีกครั้งนะครับ 🙏'
          );
        }
      }
    }
  }
}
