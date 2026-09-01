'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import streamChatResponse from '@/services/apis/chat/api';
import { ChatMessage, Conversation } from '@/ts/chat';
import { CONVERSATION_TITLE_MAX_LENGTH } from '@/utils/constants';
import { generateId } from '@/utils/helpers';

// All chat state and logic lives here, provided once from the root layout so
// both the app shell (sidebar/header) and any page can use it.
//
// The flow for sending a message is:
//   1. add the user's message
//   2. add an empty assistant message (shows the typing indicator)
//   3. stream the reply into it, chunk by chunk
//   4. mark it finished (components derive text/options from the raw content)

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isStreaming: boolean;
  sendMessage: (text: string) => Promise<void>;
  stopStreaming: () => void;
  chooseOption: (messageId: string, optionId: string, value: string) => void;
  newChat: () => void;
  openConversation: (conversationId: string) => void;
  removeConversation: (conversationId: string) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined,
);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const activeConversation =
    conversations.find((c) => c.id === activeId) ?? null;

  // --- small helpers to update nested state immutably ---

  const addMessage = useCallback(
    (conversationId: string, message: ChatMessage) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, messages: [...c.messages, message] }
            : c,
        ),
      );
    },
    [],
  );

  const updateMessage = useCallback(
    (
      conversationId: string,
      messageId: string,
      patch: Partial<ChatMessage>,
    ) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId ? { ...m, ...patch } : m,
                ),
              }
            : c,
        ),
      );
    },
    [],
  );

  // --- public API ---

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || abortRef.current) return;

      // First message? Create the conversation, titled after the message.
      let conversationId = activeId;
      if (!conversationId) {
        conversationId = generateId('chat');
        const newConversation: Conversation = {
          id: conversationId,
          title: trimmed.slice(0, CONVERSATION_TITLE_MAX_LENGTH),
          createdAt: new Date().toISOString(),
          messages: [],
        };
        setConversations((prev) => [newConversation, ...prev]);
        setActiveId(conversationId);
      }

      addMessage(conversationId, {
        id: generateId('user'),
        role: 'user',
        content: trimmed,
        status: 'done',
        createdAt: new Date().toISOString(),
      });

      const assistantId = generateId('bot');
      addMessage(conversationId, {
        id: assistantId,
        role: 'assistant',
        content: '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      setIsStreaming(true);
      const controller = new AbortController();
      abortRef.current = controller;

      let streamed = '';
      try {
        await streamChatResponse(
          { message: trimmed },
          {
            signal: controller.signal,
            onDelta: (delta) => {
              streamed += delta;
              updateMessage(conversationId, assistantId, {
                content: streamed,
                status: 'streaming',
              });
            },
          },
        );
        updateMessage(conversationId, assistantId, { status: 'done' });
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          // User pressed stop — keep whatever text arrived so far.
          updateMessage(conversationId, assistantId, { status: 'done' });
        } else {
          console.error('Chat request failed:', error);
          updateMessage(conversationId, assistantId, { status: 'error' });
        }
      } finally {
        abortRef.current = null;
        setIsStreaming(false);
      }
    },
    [activeId, addMessage, updateMessage],
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const chooseOption = useCallback(
    (messageId: string, optionId: string, value: string) => {
      if (!activeId) return;
      updateMessage(activeId, messageId, { selectedOptionId: optionId });
      void sendMessage(value);
    },
    [activeId, updateMessage, sendMessage],
  );

  const newChat = useCallback(() => {
    abortRef.current?.abort();
    setActiveId(null);
  }, []);

  const openConversation = useCallback((conversationId: string) => {
    setActiveId(conversationId);
  }, []);

  const removeConversation = useCallback(
    (conversationId: string) => {
      if (conversationId === activeId) {
        abortRef.current?.abort();
        setActiveId(null);
      }
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    },
    [activeId],
  );

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        isStreaming,
        sendMessage,
        stopStreaming,
        chooseOption,
        newChat,
        openConversation,
        removeConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
