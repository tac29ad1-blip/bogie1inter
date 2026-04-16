import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { BOGIE1_SYSTEM_PROMPT } from './systemPrompt';

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

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: BOGIE1_SYSTEM_PROMPT,
    messages: history,
  });

  const assistantMessage = (response.content[0] as { type: string; text: string }).text;
  history.push({ role: 'assistant', content: assistantMessage });

  return assistantMessage;
}

export function clearHistory(userId: string): void {
  conversationHistory.delete(userId);
}
