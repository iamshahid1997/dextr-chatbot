// Scripted replies for the mock LLM. The route handler picks the first script
// whose pattern matches the user's message, so the demo feels responsive.
//
// A reply can end with a fenced ```options block — the client turns it into
// multiple-choice buttons instead of showing it as text.

interface MockScript {
  match: RegExp;
  response: string;
}

export const MOCK_SCRIPTS: MockScript[] = [
  {
    match: /^(hi|hii+|hello|hey|yo|good (morning|afternoon|evening))[\s!.?]*$/i,
    response: `Hi there! 👋 How can I help you today?`,
  },
  {
    match: /^(bye|goodbye|see (ya|you)|good night)[\s!.?]*$/i,
    response: `Goodbye! 👋 Come back any time.`,
  },
  {
    match: /^(thanks|thank you|thx|ok(ay)?|great|awesome|nice|cool)[\s!.?]*$/i,
    response: `You're welcome! 😊 Anything else I can help with?`,
  },
  {
    match: /\b(what can you (do|help)|show me what|capab|features?)\b/i,
    response: `Here's what I can help with:

1. **Answer questions** about your business or data
2. **Write things** — emails, summaries, documents
3. **Explain things simply** — reports, jargon, numbers

Where would you like to start?

\`\`\`options
[
  { "id": "opt_write", "label": "✍️ Help me write something", "value": "Help me write an email to a customer" },
  { "id": "opt_explain", "label": "📊 Explain a report", "value": "Explain my monthly report simply" },
  { "id": "opt_ideas", "label": "💡 Give me ideas", "value": "Give me ideas to get more customers" }
]
\`\`\``,
  },
  {
    match: /\b(emails?|write|draft)\b/i,
    response: `Here's a draft you can start from:

**Subject:** Thank you for being a valued customer

Hi *{first name}*,

Thank you for your continued business! We recently launched a few improvements:

- Faster support responses
- A simpler billing page
- One-click report exports

If there's anything we can do better, just hit reply.

Warm regards,
**{your name}**

Want me to change the tone?

\`\`\`options
[
  { "id": "opt_formal", "label": "More formal", "value": "Make the email more formal" },
  { "id": "opt_casual", "label": "More casual", "value": "Make the email more casual" },
  { "id": "opt_short", "label": "Shorter", "value": "Make the email shorter" }
]
\`\`\``,
  },
  {
    match: /\b(reports?|summar|data|numbers?)\b/i,
    response: `Here's your monthly summary:

| Metric | Last Month | This Month | Change |
| --- | --- | --- | --- |
| New customers | 42 | 61 | 🟢 +45% |
| Revenue | $12,400 | $15,900 | 🟢 +28% |
| Support tickets | 89 | 74 | 🟢 −17% |

**In short:** more customers, more revenue, fewer problems. A great month!

Want me to dig into any of these numbers?`,
  },
  {
    match: /\b(ideas?|customers?|grow|marketing)\b/i,
    response: `Here are three practical ideas, easiest first:

1. **Ask for reviews** — message your 5 happiest customers today
2. **Referral offer** — *"Give $10, get $10"* works great
3. **Monthly email** — one useful tip keeps you top of mind

Which one would you like help with?

\`\`\`options
[
  { "id": "opt_reviews", "label": "⭐ Reviews", "value": "Tell me more about getting customer reviews" },
  { "id": "opt_referral", "label": "🤝 Referrals", "value": "How do I set up a referral offer?" },
  { "id": "opt_email", "label": "📧 Monthly email", "value": "Help me write a monthly email" }
]
\`\`\``,
  },
  {
    match: /\b(code|functions?|typescript|react)\b/i,
    response: `Sure — here's a small example:

\`\`\`tsx
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
\`\`\`

It waits until the user **stops typing** before updating — perfect for search inputs.`,
  },
];

export const FALLBACK_RESPONSES: string[] = [
  `I can help with that! Could you tell me a bit more about what you're looking for?`,
  `Got it! What's your main goal here?

\`\`\`options
[
  { "id": "opt_time", "label": "⏱ Save time", "value": "I want to save time on repetitive work" },
  { "id": "opt_money", "label": "💰 Cut costs", "value": "I want to reduce my costs" },
  { "id": "opt_explore", "label": "📚 Just exploring", "value": "I'm just exploring what's possible" }
]
\`\`\``,
];
