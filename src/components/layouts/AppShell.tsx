'use client';

import React, { ReactNode, useState } from 'react';
import ChatHeader from '@/components/layouts/ChatHeader';
import ChatSidebar from '@/components/layouts/ChatSidebar';
import useChat from '@/hooks/useChat';

interface AppShellProps {
  children: ReactNode;
}

// The app chrome shared by every page: history sidebar + header, with the
// current page rendered inside. Adding a new page (settings, help, …) means
// adding a route under app/ — it gets this shell automatically.
export default function AppShell({ children }: AppShellProps) {
  const {
    conversations,
    activeConversation,
    newChat,
    openConversation,
    removeConversation,
  } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh">
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversation?.id ?? null}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={newChat}
        onOpenConversation={openConversation}
        onDeleteConversation={removeConversation}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader onToggleSidebar={() => setIsSidebarOpen((open) => !open)} />
        {children}
      </div>
    </div>
  );
}
