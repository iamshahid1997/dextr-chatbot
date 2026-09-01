'use client';

import React from 'react';
import { useBrand } from '@/context/BrandContext';
import themes from '@/theme/themeConfig';
import { BrandKey } from '@/ts/chat';
import { cn } from '@/utils/helpers';

const BRAND_LABELS: Record<BrandKey, string> = {
  enterprise: 'Enterprise',
  smb: 'Simple',
};

// Toggle between the Enterprise and SMB skins. In a real deployment the
// brand would come from the tenant config; the switcher exists so reviewers
// can flip between both styles instantly.
export default function BrandSwitcher() {
  const { brand, setBrand } = useBrand();

  return (
    <div
      role="radiogroup"
      aria-label="Interface style"
      className="flex items-center gap-1 rounded-control border border-line bg-surface p-1"
    >
      {(Object.keys(themes) as BrandKey[]).map((key) => (
        <button
          key={key}
          type="button"
          role="radio"
          aria-checked={brand.key === key}
          onClick={() => setBrand(key)}
          className={cn(
            'rounded-control px-3 py-1 text-xs font-medium transition-colors',
            brand.key === key
              ? 'bg-brand text-brand-fg'
              : 'text-ink-muted hover:text-ink',
          )}
        >
          {BRAND_LABELS[key]}
        </button>
      ))}
    </div>
  );
}
