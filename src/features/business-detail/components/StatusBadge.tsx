/**
 * StatusBadge — Stateless ACT/CAN status badge
 * Layer: Feature Slice (business-detail)
 * Pattern: Stateless Presentational
 *
 * Displays "Active" or "Cancelled" based on ABN status (ACT vs CAN).
 * Used in BusinessInfoCard and ColumnDefinitions for results table.
 */

import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === 'ACT';
  return (
    <Badge variant={isActive ? 'default' : 'secondary'}>
      {isActive ? 'Active' : 'Cancelled'}
    </Badge>
  );
}
