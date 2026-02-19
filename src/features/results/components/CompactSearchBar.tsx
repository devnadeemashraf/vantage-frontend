/**
 * CompactSearchBar — Stateless refinement search bar
 * Layer: Feature Slice (results)
 * Pattern: Stateless Presentational
 *
 * Smaller variant of the search input for refining results on the results
 * page. Renders input + search button. Enter triggers onSubmit. Used by
 * SearchResultsContainer for in-page query refinement.
 */

import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CompactSearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
}

export function CompactSearchBar({
  query,
  onQueryChange,
  onSubmit,
}: CompactSearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSubmit();
  };

  return (
    <div className="mb-4 flex max-w-lg gap-2">
      <Input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Refine search..."
        className="h-9"
        aria-label="Refine search"
      />
      <Button size="sm" variant="outline" onClick={onSubmit}>
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
