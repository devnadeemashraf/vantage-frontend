/**
 * CompactFilterBar — Icon-based filter bar for results page
 * Layer: Feature Slice (results)
 * Pattern: Stateless Presentational
 *
 * Composes IconFilterButtons for State, Entity Type, ABN Status, and
 * Technique filters. Renders as a compact horizontal row with icons only.
 * Full labels shown in dropdown menus. Technique filter shows red for
 * native/default and green for optimized. Used by ResultsToolbar.
 */

import type { SearchFilters } from '@features/search/types';
import {
  ABN_STATUS_OPTIONS,
  ENTITY_TYPE_OPTIONS,
  FILTERING_TECHNIQUES,
  STATE_OPTIONS,
} from '@shared/lib/constants';
import { IconFilterButton } from '@shared/ui';
import { Building2, CircleCheck, Gauge, MapPin } from 'lucide-react';
import { memo, useMemo } from 'react';

function getTechniqueVariant(
  technique: string,
): 'default' | 'success' | 'danger' {
  if (technique === 'optimized') return 'success';
  if (technique === 'native' || technique === '') return 'danger';
  return 'default';
}

interface CompactFilterBarProps {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
  disabled?: boolean;
}

export const CompactFilterBar = memo(function CompactFilterBar({
  filters,
  onFilterChange,
  disabled = false,
}: CompactFilterBarProps) {
  const techniqueVariant = useMemo(
    () => getTechniqueVariant(filters.technique),
    [filters.technique],
  );

  return (
    <div className="flex items-center gap-1">
      <IconFilterButton
        icon={Gauge}
        label="Technique"
        value={filters.technique}
        options={FILTERING_TECHNIQUES}
        onChange={(value) => onFilterChange('technique', value)}
        variant={techniqueVariant}
        disabled={disabled}
      />
      <IconFilterButton
        icon={MapPin}
        label="State"
        value={filters.state}
        options={STATE_OPTIONS}
        onChange={(value) => onFilterChange('state', value)}
        disabled={disabled}
      />
      <IconFilterButton
        icon={Building2}
        label="Entity Type"
        value={filters.entityType}
        options={ENTITY_TYPE_OPTIONS}
        onChange={(value) => onFilterChange('entityType', value)}
        disabled={disabled}
      />
      <IconFilterButton
        icon={CircleCheck}
        label="ABN Status"
        value={filters.abnStatus}
        options={ABN_STATUS_OPTIONS}
        onChange={(value) => onFilterChange('abnStatus', value)}
        disabled={disabled}
      />
    </div>
  );
});
