/**
 * ResultsHeader — Stateless results header with count
 * Layer: Feature Slice (results)
 * Pattern: Stateless Presentational
 *
 * Displays "Search Results for [query]" or "All Businesses" plus a badge
 * showing total result count. Memoized for performance. Used by
 * SearchResultsContainer above the CompactSearchBar and DataTable.
 */

import { memo } from 'react';

import { Badge } from '@/components/ui/badge';

interface ResultsHeaderProps {
  query: string | undefined;
  total: number;
  totalTimeMs: number;
  queryTimeMs: number;
}

export const ResultsHeader = memo(function ResultsHeader({
  query,
  total,
  totalTimeMs,
  queryTimeMs,
}: ResultsHeaderProps) {
  return (
    <div className="mb-6 flex items-baseline gap-3">
      <h1 className="text-2xl font-semibold">
        {query ? (
          <span className="text-muted-foreground font-normal">
            Search Results for &ldquo;
            <span className="text-primary font-bold">{query}</span>&rdquo;
          </span>
        ) : (
          'All Businesses'
        )}
      </h1>
      <Badge variant="secondary">{total.toLocaleString()} results</Badge>
      {totalTimeMs && (
        <Badge variant="secondary">
          Total Time: {totalTimeMs.toLocaleString()}ms
        </Badge>
      )}
      {queryTimeMs && (
        <Badge variant="secondary">
          Query Time: {queryTimeMs.toLocaleString()}ms
        </Badge>
      )}
    </div>
  );
});
