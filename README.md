# Dextr AI — Chat UI

A full-page ChatGPT-style chat app built with **Next.js 15 (App Router), React 19, TypeScript and Tailwind CSS**.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. (`npm run build && npm start` for a production build.)

## What's covered

- **Type & send messages** — auto-growing textarea, Enter to send, Shift+Enter for a newline, send/stop button.
- **Scrollable message history** — the thread scrolls and follows the stream, plus a **conversation sidebar** (like ChatGPT): every chat is saved in the list, titled after your first message, and you can switch between chats or delete them. On mobile the sidebar becomes a slide-over drawer.
- **Streaming responses** — the client POSTs a string message to `/api/chat` and reads back a chunked stream, a few characters at a time, with a short "thinking" delay first. The transport is the same one a real LLM gateway uses, so swapping the mock for a real provider only touches `src/app/api/chat/route.ts`.
- **Markdown** — bot replies render GitHub-flavored markdown: headings, lists, **bold**/_italic_, tables, links, and syntax-highlighted code blocks.
- **Multiple choice** — the bot can end a reply with a small ` ```options ` JSON block. The client removes it from the text and shows it as buttons. Clicking one highlights your pick, locks the group, and sends the choice as your next message. Old option groups lock automatically.
- **Also handled** — stop generating mid-stream (keeps the partial text), typing indicator, "scroll to latest" button when you've scrolled up, per-message error state, empty state with tappable suggestions, casual messages ("hi", "thanks", "bye") get short natural replies, responsive layout, accessibility labels throughout.

## Bonus: two styles

The toggle in the header switches between two complete looks:

|             | **Enterprise**                    | **Simple (SMB)**                            |
| ----------- | --------------------------------- | ------------------------------------------- |
| Palette     | Dark navy, indigo accent          | Warm cream, orange accent                   |
| Shape       | Squared corners, compact          | Big rounded pill shapes                     |
| Text size   | 15px, dense                       | 17px, bigger tap targets                    |
| Words       | "AI Workspace Assistant", brief   | "Your friendly helper", plain words + emoji |
| Suggestions | "Summarize our Q3 pipeline risks" | "Help me write an email to a customer"      |

**How:** every color, radius and font size goes through CSS variables set per-brand in `globals.css` (keyed by `data-brand` on `<html>`) and mapped to Tailwind tokens in `tailwind.config.ts`. Components just say `bg-surface` or `rounded-bubble` and never know which brand is active. The wording lives in `src/theme/themeConfig.ts`. Adding a third brand = one CSS block + one config entry. The choice is remembered in localStorage.

## Conventions & tooling

- **Prettier + ESLint** (`next/core-web-vitals`) keep formatting and code quality consistent.
- **husky + lint-staged** enforce quality gates automatically:
  - `pre-commit` → runs `eslint --fix` + `prettier --write` on the staged files only (fast).
  - `pre-push` → runs the full `tsc --noEmit` typecheck, a project-wide lint, and a production `next build`, so nothing that fails to compile can reach the remote.
- Useful scripts: `npm run lint`, `npm run typecheck`, `npm run format`.

## How the code is organized

```
src/
├── app/
│   ├── api/chat/route.ts     # Mock LLM: picks a scripted reply, streams it back
│   ├── layout.tsx            # Root layout: providers + AppShell (sidebar + header)
│   └── page.tsx              # The chat page — page-specific content only
├── components/
│   ├── ui/                   # Small reusable pieces (Avatar, IconButton, MarkdownRenderer…)
│   ├── pageUI/chat/          # Chat page pieces (MessageList, MessageBubble, Composer…)
│   └── layouts/              # App chrome (AppShell, ChatHeader, ChatSidebar)
├── context/
│   ├── BrandContext.tsx      # Which brand/style is active
│   └── ChatContext.tsx       # ALL chat state + the send → stream → finish flow
├── hooks/
│   ├── useChat.ts            # Convenience hook over ChatContext
│   └── useAutoScroll.ts      # Follow the stream without hijacking the scrollbar
├── services/
│   ├── apiURLs.ts            # Endpoint registry
│   └── apis/chat/api.ts      # fetch + ReadableStream client
├── theme/themeConfig.ts      # Brand names, copy, suggestions
├── ts/chat.ts                # Shared types
└── utils/                    # constants, helpers, message parser, mock replies
```

(Same `app / components(ui|pageUI|layouts) / context / hooks / services / theme / ts / utils` convention as our other frontends.)

## Design decisions

1. **Layout owns the shell, pages own their content.** The root layout renders the shared chrome (`AppShell`: history sidebar + header) around every route, so adding a future page (settings, help, …) is just a new folder under `app/` — it inherits the shell automatically. `app/page.tsx` renders only what is chat-specific.

2. **Keep it simple: no state library.** All chat state is plain `useState` inside one provider, `ChatContext` (read through the `useChat` hook). Read that one file top-to-bottom and you understand the whole app: add user message → add empty bot message → stream text into it → done. It lives in a context (rather than inside the page) because both the layout's sidebar and the page's thread render from it. Components only render props.

3. **Realistic API seam.** The UI doesn't know the LLM is fake. The client does a normal `fetch` and reads the response stream; the route handler streams a scripted reply with delays. Point it at a real provider tomorrow and nothing else changes.

4. **What you see is derived, not stored.** A message stores only the raw streamed text; a pure function (`utils/parseMessage.ts`) turns it into what's shown — text plus option buttons — on every render. Because parsing runs during the stream too, the ```options JSON is hidden from its very first character; the user never sees the wire format typing out. One source of truth, one code path for streaming and finished messages, and malformed JSON just falls back to plain text.

5. **Semantic design tokens.** Components never hardcode colors (`bg-gray-800`); they use meaning-based tokens (`bg-surface-raised`). That's the entire trick behind shipping two brands without two codebases.

6. **No scroll hijacking.** Auto-follow only happens if you're already at the bottom; scrolling up to read pauses it and a "jump to latest" button appears.

7. **Constants in one place** (`utils/constants.ts`) — stream pacing, input limits, the options regex. No magic numbers in components.

### Trade-offs / next steps

- Conversations live in memory, so a refresh clears them. Persisting to localStorage is a ~5-line addition in `useChat`; left out to keep the code minimal.
- Markdown re-parses on every streamed chunk. Fine at this size; memoizing parsed blocks is the optimization path for very long replies.
