/**
 * ChatInput — Stateless chat input with send button
 * Layer: Feature Slice (ai-search)
 * Pattern: Stateless Presentational
 *
 * Renders text input and send button. Enter (without Shift) triggers onSend.
 * Supports disabled state during loading. Used by AiSearchContainer at the
 * bottom of the AI chat view.
 */

import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t p-4">
      <div className="mx-auto flex max-w-2xl gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about businesses..."
          disabled={disabled}
          className="h-11"
          aria-label="AI search query"
        />
        <Button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          size="lg"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
