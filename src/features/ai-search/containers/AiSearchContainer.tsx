/**
 * AiSearchContainer — Stateful container for AI chat search
 * Layer: Feature Slice (ai-search)
 * Pattern: Stateful Container
 *
 * Manages chat messages (Redux aiChat slice), input state, and AI search
 * flow. Dispatches user messages, triggers useLazyAiSearchQuery, and
 * appends assistant/error responses. Composes MessageList and ChatInput.
 * Used by HomePage when mode=ai.
 */

import type { RootState } from '@app/store';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useLazyAiSearchQuery } from '../api/aiSearchApi';
import { ChatInput } from '../components/ChatInput';
import { MessageList } from '../components/MessageList';
import { addMessage, setLoading } from '../slices/aiChatSlice';

export function AiSearchContainer() {
  const dispatch = useDispatch();
  const { messages, isLoading } = useSelector(
    (state: RootState) => state.aiChat,
  );
  const [input, setInput] = useState('');
  const [triggerSearch] = useLazyAiSearchQuery();

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    dispatch(
      addMessage({
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: Date.now(),
      }),
    );
    setInput('');
    dispatch(setLoading(true));

    try {
      const result = await triggerSearch(text).unwrap();
      const businesses = result.data ?? [];
      const total = result.pagination?.total ?? 0;

      dispatch(
        addMessage({
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content:
            total > 0
              ? `Found ${total.toLocaleString()} businesses matching "${text}".`
              : `No businesses found matching "${text}". Try a different query.`,
          businesses: businesses.length > 0 ? businesses : undefined,
          timestamp: Date.now(),
        }),
      );
    } catch {
      dispatch(
        addMessage({
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
          timestamp: Date.now(),
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex h-[calc(100svh-80px)] flex-col">
      <MessageList messages={messages} />
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        disabled={isLoading}
      />
    </div>
  );
}
