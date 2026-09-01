'use client';

import { useChatContext } from '@/context/ChatContext';

// Thin alias so components keep a familiar hook-style API. The actual state
// lives in ChatContext, provided once from the root layout.
export default function useChat() {
  return useChatContext();
}
