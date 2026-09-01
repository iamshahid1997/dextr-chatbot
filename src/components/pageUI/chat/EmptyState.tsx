'use client';

import React from 'react';
import { useBrand } from '@/context/BrandContext';

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

// Shown before the first message: brand greeting + tappable suggestions so
// users (especially non-technical ones) never face a blank box.
export default function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  const { brand } = useBrand();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 overflow-y-auto px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl font-bold text-brand-fg">
          {brand.botName.charAt(0)}
        </div>
        <h2 className="text-xl font-semibold">{brand.emptyStateTitle}</h2>
        <p className="mt-2 max-w-md text-sm text-ink-muted">
          {brand.emptyStateSubtitle}
        </p>
      </div>

      <div className="grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
        {brand.suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSuggestionClick(suggestion)}
            className="rounded-bubble border border-line bg-surface-raised px-4 py-3 text-left text-sm text-ink-muted transition-colors hover:border-brand/50 hover:text-ink"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
