import API_URLS from '@/services/apiURLs';
import { SendMessagePayload } from '@/ts/chat';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api';

export interface StreamHandlers {
  onDelta: (delta: string) => void;
  signal?: AbortSignal;
}

// Sends the user's message and consumes the streamed response chunk by
// chunk. Uses fetch + ReadableStream (same transport a real LLM gateway
// would use for SSE/chunked responses).
export async function streamChatResponse(
  payload: SendMessagePayload,
  { onDelta, signal }: StreamHandlers,
): Promise<string> {
  const response = await fetch(`${BASE_URL}${API_URLS.chat}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Chat request failed with status ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    fullText += chunk;
    onDelta(chunk);
  }

  return fullText;
}

export default streamChatResponse;
