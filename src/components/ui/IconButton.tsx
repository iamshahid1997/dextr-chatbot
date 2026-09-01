import React from 'react';
import { cn } from '@/utils/helpers';

interface IconButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'ghost' | 'danger';
  children: React.ReactNode;
  className?: string;
}

export default function IconButton({
  label,
  onClick,
  disabled = false,
  variant = 'ghost',
  children,
  className,
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-control transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-40',
        variant === 'primary' &&
          'bg-brand text-brand-fg hover:opacity-90 active:opacity-80',
        variant === 'ghost' && 'text-ink-muted hover:bg-line/40 hover:text-ink',
        variant === 'danger' &&
          'text-ink-muted hover:bg-red-500/10 hover:text-red-500',
        className,
      )}
    >
      {children}
    </button>
  );
}
