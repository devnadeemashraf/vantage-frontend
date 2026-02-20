/**
 * CompactSearchBar — Stateless refinement search bar
 * Layer: Feature Slice (results)
 * Pattern: Stateless Presentational
 *
 * Smaller variant of the search input for refining results on the results
 * page. Renders input + search button. Enter triggers onSubmit. Supports
 * disabled state during loading. Used by ResultsToolbar.
 */

import { Loader2, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CompactSearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function CompactSearchBar({
  query,
  onQueryChange,
  onSubmit,
  disabled = false,
}: CompactSearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled) onSubmit();
  };

  return (
    <div className="flex max-w-lg gap-2">
      <Input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Refine search..."
        className="h-9"
        aria-label="Refine search"
        disabled={disabled}
      />
      <Button
        size="icon"
        variant="outline"
        onClick={onSubmit}
        disabled={disabled}
      >
        {disabled ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
