'use client';

import React, { FormEvent, KeyboardEvent, useRef, useState } from 'react';
import IconButton from '@/components/ui/IconButton';
import { useBrand } from '@/context/BrandContext';
import { MAX_INPUT_LENGTH } from '@/utils/constants';

interface ComposerProps {
  isStreaming: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}

// Message input: auto-growing textarea, Enter to send / Shift+Enter for a
// newline, and a Stop button while the assistant is streaming.
export default function Composer({
  isStreaming,
  onSend,
  onStop,
}: ComposerProps) {
  const { brand } = useBrand();
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const canSend = value.trim().length > 0 && !isStreaming;

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }
  };

  const submit = () => {
    if (!canSend) return;
    onSend(value);
    setValue('');
    requestAnimationFrame(resizeTextarea);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-line bg-surface-raised px-4 py-3 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-thread items-end gap-2 rounded-bubble border border-line bg-surface-sunken px-3 py-2 focus-within:border-brand/60"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          maxLength={MAX_INPUT_LENGTH}
          placeholder={brand.inputPlaceholder}
          aria-label="Message input"
          onChange={(event) => {
            setValue(event.target.value);
            resizeTextarea();
          }}
          onKeyDown={handleKeyDown}
          className="max-h-[200px] flex-1 resize-none bg-transparent py-1.5 text-chat leading-relaxed outline-none placeholder:text-ink-faint"
        />

        {isStreaming ? (
          <IconButton
            label="Stop generating"
            onClick={onStop}
            variant="primary"
          >
            <svg
              aria-hidden
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="5" y="5" width="14" height="14" rx="2" />
            </svg>
          </IconButton>
        ) : (
          <IconButton
            label="Send message"
            onClick={submit}
            disabled={!canSend}
            variant="primary"
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
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </IconButton>
        )}
      </form>
      <p className="mx-auto mt-2 max-w-thread text-center text-[11px] text-ink-faint">
        {brand.botName} can make mistakes. Please double-check important info.
      </p>
    </div>
  );
}
