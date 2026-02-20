/**
 * TableShimmer — Shimmer overlay for table loading state
 * Layer: Shared / UI
 * Pattern: Stateless Presentational
 *
 * Renders a shimmer animation overlay that sits on top of table content
 * during refetch operations. Provides visual feedback that data is being
 * refreshed while keeping the previous content visible underneath.
 */

import { Skeleton } from '@/components/ui/skeleton';

interface TableShimmerProps {
  rows?: number;
  columns?: number;
}

export function TableShimmer({ rows = 8, columns = 5 }: TableShimmerProps) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              className="h-12 flex-1"
              style={{ animationDelay: `${(rowIdx * columns + colIdx) * 50}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
