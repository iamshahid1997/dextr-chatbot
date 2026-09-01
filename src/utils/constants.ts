// App-wide constants — keep magic values here, not inside components.

// The fence the mock LLM uses when it wants the user to pick from a list:
// ```options [ ...json... ] ```
export const OPTIONS_MARKER = '```options';
export const CODE_FENCE = '```';

// Streaming pacing for the mock LLM (route handler).
export const STREAM_CHUNK_SIZE = 6; // characters per chunk
export const STREAM_CHUNK_DELAY_MS = 18; // delay between chunks
export const STREAM_INITIAL_DELAY_MS = 500; // "thinking" time before first token

// UI
export const MAX_INPUT_LENGTH = 4000;
export const SCROLL_LOCK_THRESHOLD_PX = 80; // distance from bottom that counts as "at bottom"
export const CONVERSATION_TITLE_MAX_LENGTH = 42;

// Branding
export const BRAND_STORAGE_KEY = 'dextr_brand';
