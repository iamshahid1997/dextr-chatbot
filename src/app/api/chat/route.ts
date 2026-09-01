import { NextRequest } from 'next/server';
import { SendMessagePayload } from '@/ts/chat';
import {
  STREAM_CHUNK_DELAY_MS,
  STREAM_CHUNK_SIZE,
  STREAM_INITIAL_DELAY_MS,
} from '@/utils/constants';
import { FALLBACK_RESPONSES, MOCK_SCRIPTS } from '@/utils/data/chat';

// Mock LLM endpoint. The contract mirrors a real gateway: the client POSTs a
// string message and receives a chunked text stream back. Swapping this for a
// real provider only changes this file — the client is transport-agnostic.

export const runtime = 'nodejs';

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

function pickResponse(message: string): string {
  const script = MOCK_SCRIPTS.find((s) => s.match.test(message));
  if (script) return script.response;

  // Deterministic-ish fallback so the same question gets the same answer.
  const index = message.length % FALLBACK_RESPONSES.length;
  return FALLBACK_RESPONSES[index];
}

export async function POST(request: NextRequest) {
  const { message } = (await request.json()) as SendMessagePayload;

  if (!message || typeof message !== 'string') {
    return new Response(JSON.stringify({ error: 'message is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const fullResponse = pickResponse(message);
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // Simulate model "thinking" before the first token.
        await sleep(STREAM_INITIAL_DELAY_MS);

        // Chunk by code points (not string indexes) so emoji are never
        // split across chunks.
        const chars = Array.from(fullResponse);
        for (let i = 0; i < chars.length; i += STREAM_CHUNK_SIZE) {
          controller.enqueue(
            encoder.encode(chars.slice(i, i + STREAM_CHUNK_SIZE).join('')),
          );
          // eslint-disable-next-line no-await-in-loop
          await sleep(STREAM_CHUNK_DELAY_MS);
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}
