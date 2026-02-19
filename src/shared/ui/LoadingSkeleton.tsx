/**
 * LoadingSkeleton — Loading placeholder
 * Layer: Shared / UI
 * Pattern: Stateless Presentational
 *
 * Renders a configurable grid of Skeleton placeholders (rows x columns).
 * Used by SearchResultsContainer and BusinessDetailContainer during
 * initial data fetch.
 */

import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  rows?: number;
  columns?: number;
}

export function LoadingSkeleton({
  rows = 5,
  columns = 4,
}: LoadingSkeletonProps) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-full" />
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
