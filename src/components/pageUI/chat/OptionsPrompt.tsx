'use client';

import React from 'react';
import { ChatOption } from '@/ts/chat';
import { cn } from '@/utils/helpers';

interface OptionsPromptProps {
  messageId: string;
  options: ChatOption[];
  selectedOptionId?: string;
  disabled: boolean;
  onChoose: (messageId: string, optionId: string, value: string) => void;
}

// Renders a bot "pick one" prompt as buttons. Once an option is chosen (or
// the conversation moves on) the group locks, with the pick highlighted.
export default function OptionsPrompt({
  messageId,
  options,
  selectedOptionId,
  disabled,
  onChoose,
}: OptionsPromptProps) {
  const isLocked = disabled || Boolean(selectedOptionId);

  return (
    <div
      className="mt-1 flex flex-wrap gap-2"
      role="group"
      aria-label="Choose an option"
    >
      {options.map((option) => {
        const isSelected = option.id === selectedOptionId;
        return (
          <button
            key={option.id}
            type="button"
            disabled={isLocked}
            onClick={() => onChoose(messageId, option.id, option.value)}
            className={cn(
              'rounded-control border px-3.5 py-2 text-sm font-medium transition-colors',
              isSelected
                ? 'border-brand bg-brand-soft text-brand'
                : 'border-line bg-surface-raised text-ink-muted',
              !isLocked &&
                'hover:border-brand hover:bg-brand-soft hover:text-brand',
              isLocked && !isSelected && 'opacity-50',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
