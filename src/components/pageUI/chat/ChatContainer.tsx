'use client';

import React from 'react';
import Composer from '@/components/pageUI/chat/Composer';
import EmptyState from '@/components/pageUI/chat/EmptyState';
import MessageList from '@/components/pageUI/chat/MessageList';
import useChat from '@/hooks/useChat';

// The chat page's content: scrollable thread + composer. The surrounding
// shell (sidebar, header) lives in the layout, not here.
export default function ChatContainer() {
  const {
    activeConversation,
    isStreaming,
    sendMessage,
    stopStreaming,
    chooseOption,
  } = useChat();

  const messages = activeConversation?.messages ?? [];

  return (
    <>
      {messages.length === 0 ? (
        <EmptyState onSuggestionClick={sendMessage} />
      ) : (
        <MessageList
          messages={messages}
          isStreaming={isStreaming}
          onChooseOption={chooseOption}
        />
      )}

      <Composer
        isStreaming={isStreaming}
        onSend={sendMessage}
        onStop={stopStreaming}
      />
    </>
  );
}
