/**
 * MessageList — Stateless scrollable list of chat messages
 * Layer: Feature Slice (ai-search)
 * Pattern: Stateless Presentational
 *
 * Renders messages in a scroll area with empty-state placeholder when no
 * messages. Maps over messages and renders ChatMessage. Used by
 * AiSearchContainer.
 */

import { ScrollArea } from '@/components/ui/scroll-area';

import type { ChatMessage as ChatMessageType } from '../types';
import { ChatMessage } from './ChatMessage';

interface MessageListProps {
  messages: ChatMessageType[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 px-4 py-6">
      <div className="mx-auto max-w-2xl space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-muted-foreground text-lg">
              Ask anything about Australian businesses...
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>
    </ScrollArea>
  );
}
