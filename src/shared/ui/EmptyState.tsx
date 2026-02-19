/**
 * EmptyState — No results display
 * Layer: Shared / UI
 * Pattern: Stateless Presentational
 *
 * Displays icon, title, and description when no data is found. Configurable
 * via props; defaults to "No results found" and search-adjustment hint. Used
 * by SearchResultsContainer when the search returns zero businesses.
 */

import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your search or filters.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="text-muted-foreground">
        {icon ?? <SearchX className="h-12 w-12" />}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
