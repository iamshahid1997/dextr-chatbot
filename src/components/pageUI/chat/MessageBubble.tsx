'use client';

import React, { useMemo } from 'react';
import OptionsPrompt from '@/components/pageUI/chat/OptionsPrompt';
import Avatar from '@/components/ui/Avatar';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import TypingIndicator from '@/components/ui/TypingIndicator';
import { useBrand } from '@/context/BrandContext';
import { ChatMessage } from '@/ts/chat';
import { cn, formatTime } from '@/utils/helpers';
import { parseMessageContent } from '@/utils/parseMessage';

interface MessageBubbleProps {
  message: ChatMessage;
  isLast: boolean;
  isStreaming: boolean;
  onChooseOption: (messageId: string, optionId: string, value: string) => void;
}

export default function MessageBubble({
  message,
  isLast,
  isStreaming,
  onChooseOption,
}: MessageBubbleProps) {
  const { brand } = useBrand();
  const isUser = message.role === 'user';
  const isPending = message.status === 'pending';
  const isError = message.status === 'error';

  // Derive what to show from the raw streamed text. This runs on every
  // chunk, so the ```options block is hidden while the reply types out and
  // becomes buttons the moment the reply is finished.
  const { visibleContent, options } = useMemo(
    () => parseMessageContent(message.content, message.status === 'done'),
    [message.content, message.status],
  );

  return (
    <div
      className={cn(
        'flex animate-fade-up gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <Avatar role={message.role} botInitial={brand.botName.charAt(0)} />

      <div
        className={cn(
          'flex min-w-0 max-w-[85%] flex-col gap-1',
          isUser && 'items-end',
        )}
      >
        <div
          className={cn(
            'rounded-bubble px-4 py-2.5',
            isUser
              ? 'bg-brand text-brand-fg'
              : 'border border-line bg-surface-raised',
            isError && 'border-red-500/40',
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-chat leading-relaxed">
              {message.content}
            </p>
          ) : (
            <>
              {isPending && <TypingIndicator />}
              {!isPending && <MarkdownRenderer content={visibleContent} />}
              {isError && (
                <p className="text-sm text-red-400">
                  Something went wrong while replying. Please try again.
                </p>
              )}
            </>
          )}
        </div>

        {/* Multiple-choice buttons attached to a finished bot reply. */}
        {!isUser && message.status === 'done' && options && (
          <OptionsPrompt
            messageId={message.id}
            options={options}
            selectedOptionId={message.selectedOptionId}
            // Only the latest prompt stays clickable; older ones lock.
            disabled={!isLast || isStreaming}
            onChoose={onChooseOption}
          />
        )}

        <span className="px-1 text-[11px] text-ink-faint">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
