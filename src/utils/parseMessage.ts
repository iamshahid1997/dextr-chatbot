import { ChatOption } from '@/ts/chat';
import { CODE_FENCE, OPTIONS_MARKER } from '@/utils/constants';

interface ParsedMessage {
  visibleContent: string;
  options?: ChatOption[];
}

// The bot streams its whole reply as one markdown string, which may end with
// a fenced ```options block. This function turns that raw (possibly still
// streaming) string into what the user should see:
//
//   - the text WITHOUT the options block
//   - the parsed options, once the block has fully arrived
//
// Because it runs on every render, the block is hidden from the very first
// character — the raw JSON is never visible while the reply types out.
export function parseMessageContent(
  raw: string,
  isComplete: boolean,
): ParsedMessage {
  const markerIndex = raw.indexOf(OPTIONS_MARKER);

  if (markerIndex === -1) {
    // No options block. While still streaming, also hide a partially-typed
    // marker at the tail (e.g. the text currently ends with "```opt").
    return { visibleContent: isComplete ? raw : trimPartialMarker(raw) };
  }

  const visibleContent = raw.slice(0, markerIndex).trimEnd();
  const block = raw.slice(markerIndex + OPTIONS_MARKER.length);
  const closeIndex = block.indexOf(CODE_FENCE);

  if (closeIndex === -1) {
    // The block is still streaming in — keep it hidden until it's complete.
    return { visibleContent };
  }

  try {
    const parsed = JSON.parse(block.slice(0, closeIndex)) as ChatOption[];
    const options = parsed.filter(
      (o) => o && typeof o.id === 'string' && typeof o.label === 'string',
    );
    return {
      visibleContent,
      options: options.length > 0 ? options : undefined,
    };
  } catch (error) {
    // Malformed JSON — just show the reply without the block.
    console.warn('Could not parse options block:', error);
    return { visibleContent };
  }
}

// If the text ends mid-way through "```options", cut those characters off so
// the marker never flashes on screen between two stream chunks.
function trimPartialMarker(text: string): string {
  for (let len = OPTIONS_MARKER.length - 1; len > 0; len -= 1) {
    if (text.endsWith(OPTIONS_MARKER.slice(0, len))) {
      return text.slice(0, text.length - len);
    }
  }
  return text;
}

export default parseMessageContent;
