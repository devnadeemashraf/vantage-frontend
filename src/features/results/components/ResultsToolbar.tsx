/**
 * ResultsToolbar — Combined search and filter toolbar for results page
 * Layer: Feature Slice (results)
 * Pattern: Stateless Presentational
 *
 * Composes CompactSearchBar (left), CompactFilterBar (center-right), and
 * NewSearchButton (far right) into a single responsive toolbar. Supports
 * disabled state during loading. Used by SearchResultsContainer.
 */

import type { SearchFilters } from '@features/search/types';
import { memo } from 'react';

import { CompactFilterBar } from './CompactFilterBar';
import { CompactSearchBar } from './CompactSearchBar';
import { NewSearchButton } from './NewSearchButton';

interface ResultsToolbarProps {
  query: string;
  filters: SearchFilters;
  onQueryChange: (value: string) => void;
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export const ResultsToolbar = memo(function ResultsToolbar({
  query,
  filters,
  onQueryChange,
  onFilterChange,
  onSubmit,
  disabled = false,
}: ResultsToolbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
      <CompactSearchBar
        query={query}
        onQueryChange={onQueryChange}
        onSubmit={onSubmit}
        disabled={disabled}
      />
      <div className="flex items-center gap-2">
        <CompactFilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          disabled={disabled}
        />
        <NewSearchButton disabled={disabled} />
      </div>
    </div>
  );
});
