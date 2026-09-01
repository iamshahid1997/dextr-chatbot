'use client';

import React from 'react';
import BrandSwitcher from '@/components/ui/BrandSwitcher';
import IconButton from '@/components/ui/IconButton';
import { useBrand } from '@/context/BrandContext';

interface ChatHeaderProps {
  onToggleSidebar: () => void;
}

export default function ChatHeader({ onToggleSidebar }: ChatHeaderProps) {
  const { brand } = useBrand();

  return (
    <header className="flex items-center justify-between border-b border-line bg-surface-raised px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        {/* History toggle — only needed on mobile where the sidebar hides. */}
        <IconButton
          label="Toggle chat history"
          onClick={onToggleSidebar}
          className="md:hidden"
        >
          <svg
            aria-hidden
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </IconButton>

        <div className="flex h-9 w-9 items-center justify-center rounded-control bg-brand text-lg font-bold text-brand-fg">
          {brand.botName.charAt(0)}
        </div>
        <div>
          <h1 className="text-sm font-semibold leading-tight">{brand.name}</h1>
          <p className="text-xs text-ink-muted">{brand.tagline}</p>
        </div>
      </div>

      <BrandSwitcher />
    </header>
  );
}
