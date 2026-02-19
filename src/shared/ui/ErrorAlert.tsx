/**
 * ErrorAlert — Error display with retry
 * Layer: Shared / UI
 * Pattern: Stateless Presentational
 *
 * Displays error icon, message, and optional Retry button. Used when API
 * calls fail in SearchResultsContainer, BusinessDetailContainer, and
 * other containers. onRetry typically triggers refetch.
 */

import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ErrorAlertProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorAlert({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorAlertProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <AlertCircle className="text-destructive h-12 w-12" />
      <p className="text-muted-foreground text-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
