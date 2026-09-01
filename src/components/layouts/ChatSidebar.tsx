'use client';

import React from 'react';
import { useBrand } from '@/context/BrandContext';
import { Conversation } from '@/ts/chat';
import { cn } from '@/utils/helpers';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onOpenConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

// Conversation history panel: permanent column on desktop, slide-over drawer
// on mobile (mirrors the ChatGPT layout).
export default function ChatSidebar({
  conversations,
  activeConversationId,
  isOpen,
  onClose,
  onNewChat,
  onOpenConversation,
  onDeleteConversation,
}: ChatSidebarProps) {
  const { brand } = useBrand();

  const handleOpen = (id: string) => {
    onOpenConversation(id);
    onClose();
  };

  const handleNewChat = () => {
    onNewChat();
    onClose();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close history"
          onClick={onClose}
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
        />
      )}

      <aside
        aria-label="Chat history"
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-line bg-surface-raised transition-transform duration-200',
          'md:static md:z-auto md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="p-3">
          <button
            type="button"
            onClick={handleNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-control bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg transition-opacity hover:opacity-90"
          >
            <svg
              aria-hidden
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            {brand.newChatLabel}
          </button>
        </div>

        <p className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
          {brand.historyLabel}
        </p>

        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          {conversations.length === 0 && (
            <p className="px-2 py-3 text-sm text-ink-faint">
              No chats yet — your conversations will show up here.
            </p>
          )}

          <ul className="flex flex-col gap-1">
            {conversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;
              return (
                <li key={conversation.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => handleOpen(conversation.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'w-full truncate rounded-control px-3 py-2.5 pr-9 text-left text-sm transition-colors',
                      isActive
                        ? 'bg-brand-soft font-medium text-brand'
                        : 'text-ink-muted hover:bg-line/40 hover:text-ink',
                    )}
                  >
                    {conversation.title}
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete "${conversation.title}"`}
                    onClick={() => onDeleteConversation(conversation.id)}
                    className={cn(
                      'absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-faint transition-colors hover:text-red-500',
                      'opacity-0 focus-visible:opacity-100 group-hover:opacity-100',
                      isActive && 'opacity-100',
                    )}
                  >
                    <svg
                      aria-hidden
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
