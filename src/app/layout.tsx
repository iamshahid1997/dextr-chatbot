import type { Metadata } from 'next';
import React from 'react';
import AppShell from '@/components/layouts/AppShell';
import { BrandProvider } from '@/context/BrandContext';
import { ChatProvider } from '@/context/ChatContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dextr AI — Chat',
  description: 'Full-page chat assistant with streaming responses',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

// The layout owns everything shared across pages: global providers and the
// app shell (sidebar + header). Pages only render their own content.
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" data-brand="enterprise" suppressHydrationWarning>
      <body>
        <BrandProvider>
          <ChatProvider>
            <AppShell>{children}</AppShell>
          </ChatProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
