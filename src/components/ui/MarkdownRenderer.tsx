import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { cn } from '@/utils/helpers';
import 'highlight.js/styles/atom-one-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Single place where assistant markdown is rendered: GFM (tables, task
// lists, strikethrough) + syntax-highlighted code blocks.
export default function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        'chat-prose prose prose-sm max-w-none text-chat leading-relaxed',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
