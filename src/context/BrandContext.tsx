'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import themes, { DEFAULT_BRAND } from '@/theme/themeConfig';
import { BrandConfig, BrandKey } from '@/ts/chat';
import { BRAND_STORAGE_KEY } from '@/utils/constants';

interface BrandContextType {
  brand: BrandConfig;
  setBrand: (key: BrandKey) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

interface BrandProviderProps {
  children: ReactNode;
}

export function BrandProvider({ children }: BrandProviderProps) {
  const [brandKey, setBrandKey] = useState<BrandKey>(DEFAULT_BRAND);

  // Restore the persisted brand and reflect it on <html data-brand="…"> so
  // the CSS-variable palettes in globals.css apply globally.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BRAND_STORAGE_KEY) as BrandKey | null;
      if (stored && themes[stored]) {
        setBrandKey(stored);
      }
    } catch {
      // Storage unavailable (private mode etc.) — fall back to default.
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', brandKey);
  }, [brandKey]);

  const setBrand = useCallback((key: BrandKey) => {
    setBrandKey(key);
    try {
      localStorage.setItem(BRAND_STORAGE_KEY, key);
    } catch {
      // Non-fatal.
    }
  }, []);

  const value = useMemo(
    () => ({ brand: themes[brandKey], setBrand }),
    [brandKey, setBrand],
  );

  return (
    <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}
