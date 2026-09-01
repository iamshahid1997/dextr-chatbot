import React from 'react';

// Three-dot "the bot is thinking" indicator, shown before the first token.
export default function TypingIndicator() {
  return (
    <output
      className="flex items-center gap-1 py-2"
      aria-label="Assistant is typing"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 animate-blink rounded-full bg-ink-faint"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </output>
  );
}
