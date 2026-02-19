/**
 * ChatMessage — Stateless single message bubble
 * Layer: Feature Slice (ai-search)
 * Pattern: Stateless Presentational
 *
 * Renders a chat bubble (user right-aligned, assistant left-aligned). Shows
 * message content and optionally a TruncatedTable when businesses are
 * included. Memoized. Used by MessageList.
 */

import { memo } from 'react';

import { cn } from '@/lib/utils';

import type { ChatMessage as ChatMessageType } from '../types';
import { TruncatedTable } from './TruncatedTable';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = memo(function ChatMessage({
  message,
}: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-3',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground',
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {message.businesses && message.businesses.length > 0 && (
          <TruncatedTable
            businesses={message.businesses}
            query={message.content}
          />
        )}
      </div>
    </div>
  );
});
