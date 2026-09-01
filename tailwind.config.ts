import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand-aware tokens driven by CSS variables so the Enterprise / SMB
        // themes can swap palettes without touching component code.
        brand: {
          DEFAULT: 'rgb(var(--color-brand) / <alpha-value>)',
          soft: 'rgb(var(--color-brand-soft) / <alpha-value>)',
          fg: 'rgb(var(--color-brand-fg) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          raised: 'rgb(var(--color-surface-raised) / <alpha-value>)',
          sunken: 'rgb(var(--color-surface-sunken) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          muted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
          faint: 'rgb(var(--color-ink-faint) / <alpha-value>)',
        },
        line: 'rgb(var(--color-line) / <alpha-value>)',
      },
      borderRadius: {
        bubble: 'var(--radius-bubble)',
        control: 'var(--radius-control)',
      },
      fontSize: {
        chat: 'var(--font-size-chat)',
      },
      maxWidth: {
        thread: '48rem',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.25s ease-out',
        blink: 'blink 1s ease-in-out infinite',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgb(var(--color-ink))',
            '--tw-prose-headings': 'rgb(var(--color-ink))',
            '--tw-prose-bold': 'rgb(var(--color-ink))',
            '--tw-prose-links': 'rgb(var(--color-brand))',
            '--tw-prose-code': 'rgb(var(--color-ink))',
            '--tw-prose-quotes': 'rgb(var(--color-ink-muted))',
            '--tw-prose-quote-borders': 'rgb(var(--color-brand))',
            '--tw-prose-bullets': 'rgb(var(--color-ink-faint))',
            '--tw-prose-counters': 'rgb(var(--color-ink-muted))',
            '--tw-prose-th-borders': 'rgb(var(--color-line))',
            '--tw-prose-td-borders': 'rgb(var(--color-line))',
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
