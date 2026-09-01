// theme/themeConfig.ts
// Central brand registry. Each brand maps to a `data-brand` attribute on
// <html>; the CSS variables that power Tailwind's semantic tokens live in
// globals.css under matching selectors.
import { BrandConfig, BrandKey } from '@/ts/chat';

const themes: Record<BrandKey, BrandConfig> = {
  enterprise: {
    key: 'enterprise',
    name: 'Dextr Enterprise',
    tagline: 'AI Workspace Assistant',
    botName: 'Dextr',
    emptyStateTitle: 'How can I help you today?',
    emptyStateSubtitle:
      'Ask about your data, draft documents, or explore what Dextr can do.',
    inputPlaceholder: 'Message Dextr…',
    newChatLabel: 'New chat',
    historyLabel: 'Recent',
    suggestions: [
      'Summarize our Q3 pipeline risks',
      'Draft a security review checklist',
      'Show me what you can do',
      'Compare our onboarding flows',
    ],
  },
  smb: {
    key: 'smb',
    name: 'Dextr Buddy',
    tagline: 'Your friendly helper',
    botName: 'Buddy',
    emptyStateTitle: 'Hi there! 👋 What can I do for you?',
    emptyStateSubtitle:
      'Just type below like you would in a text message. No tech skills needed!',
    inputPlaceholder: 'Type your question here…',
    newChatLabel: 'Start a new chat',
    historyLabel: 'Your past chats',
    suggestions: [
      'Help me write an email to a customer',
      'What can you help me with?',
      'Explain my monthly report simply',
      'Give me ideas to get more customers',
    ],
  },
};

export const DEFAULT_BRAND: BrandKey = 'enterprise';

export default themes;
