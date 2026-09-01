// app/page.tsx
import React from 'react';
import ChatContainer from '@/components/pageUI/chat/ChatContainer';

// The chat page. The shared shell (sidebar + header) comes from the layout;
// this page only renders what is specific to chatting.
function Page() {
  return <ChatContainer />;
}

export default Page;
