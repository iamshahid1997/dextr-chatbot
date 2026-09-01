import React from 'react';
import { MessageRole } from '@/ts/chat';
import { cn } from '@/utils/helpers';

interface AvatarProps {
  role: MessageRole;
  botInitial: string;
}

export default function Avatar({ role, botInitial }: AvatarProps) {
  const isUser = role === 'user';
  return (
    <div
      aria-hidden
      className={cn(
        'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full text-sm font-semibold',
        isUser ? 'bg-line text-ink-muted' : 'bg-brand text-brand-fg',
      )}
    >
      {isUser ? 'You'.charAt(0) : botInitial}
    </div>
  );
}
