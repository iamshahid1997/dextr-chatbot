export type MessageRole = 'user' | 'assistant';

export type MessageStatus = 'pending' | 'streaming' | 'done' | 'error';

export interface ChatOption {
  id: string;
  label: string;
  value: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  // The raw streamed text, exactly as the bot sent it. What the user sees
  // (text + option buttons) is derived from this at render time.
  content: string;
  status: MessageStatus;
  createdAt: string;
  // Set once the user has picked an option (locks the buttons).
  selectedOptionId?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export interface SendMessagePayload {
  message: string;
}

export type BrandKey = 'enterprise' | 'smb';

export interface BrandConfig {
  key: BrandKey;
  name: string;
  tagline: string;
  botName: string;
  emptyStateTitle: string;
  emptyStateSubtitle: string;
  inputPlaceholder: string;
  newChatLabel: string;
  historyLabel: string;
  suggestions: string[];
}
