'use client';

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { SCROLL_LOCK_THRESHOLD_PX } from '@/utils/constants';

// Keeps a scroll container pinned to the bottom while new content streams in,
// but respects the user scrolling up to read history (no scroll hijacking).
export default function useAutoScroll(dep: unknown): {
  containerRef: RefObject<HTMLDivElement | null>;
  isAtBottom: boolean;
  scrollToBottom: () => void;
} {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const isAtBottomRef = useRef(true);

  const scrollToBottom = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const handleScroll = () => {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      const atBottom = distanceFromBottom < SCROLL_LOCK_THRESHOLD_PX;
      isAtBottomRef.current = atBottom;
      setIsAtBottom(atBottom);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // Follow the stream only while the user is already at the bottom.
  useEffect(() => {
    if (isAtBottomRef.current) {
      scrollToBottom();
    }
  }, [dep, scrollToBottom]);

  return { containerRef, isAtBottom, scrollToBottom };
}
