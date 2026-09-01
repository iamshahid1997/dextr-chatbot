'use client';

import React from 'react';
import MessageBubble from '@/components/pageUI/chat/MessageBubble';
import useAutoScroll from '@/hooks/useAutoScroll';
import { ChatMessage } from '@/ts/chat';

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onChooseOption: (messageId: string, optionId: string, value: string) => void;
}

export default function MessageList({
  messages,
  isStreaming,
  onChooseOption,
}: MessageListProps) {
  // Re-pin to the bottom whenever content grows (new message or new delta).
  const lastMessage = messages[messages.length - 1];
  const scrollDep = `${messages.length}:${lastMessage?.content.length ?? 0}`;
  const { containerRef, isAtBottom, scrollToBottom } = useAutoScroll(scrollDep);

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={containerRef}
        className="h-full overflow-y-auto px-4 py-6 sm:px-6"
        aria-live="polite"
      >
        <div className="mx-auto flex max-w-thread flex-col gap-6">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
              isStreaming={isStreaming}
              onChooseOption={onChooseOption}
            />
          ))}
        </div>
      </div>

      {!isAtBottom && (
        <button
          type="button"
          onClick={scrollToBottom}
          aria-label="Scroll to latest message"
          className="absolute bottom-4 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-line bg-surface-raised text-ink-muted shadow-lg transition-colors hover:text-ink"
        >
          <svg
            aria-hidden
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}
