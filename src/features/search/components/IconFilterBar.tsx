/**
 * IconFilterBar — Icon-based filter bar for search page
 * Layer: Feature Slice (search)
 * Pattern: Stateless Presentational
 *
 * Composes IconFilterButtons for Technique, State, Entity Type, and ABN Status
 * filters. Renders as a horizontal row with icon-only buttons. Full labels
 * shown in dropdown menus. Used by SearchForm on the home page.
 */

import {
  ABN_STATUS_OPTIONS,
  ENTITY_TYPE_OPTIONS,
  FILTERING_TECHNIQUES,
  STATE_OPTIONS,
} from '@shared/lib/constants';
import { IconFilterButton } from '@shared/ui';
import { Building2, CircleCheck, Gauge, MapPin } from 'lucide-react';
import { memo, useMemo } from 'react';

import type { SearchFilters } from '../types';

function getTechniqueVariant(
  technique: string,
): 'default' | 'success' | 'danger' {
  if (technique === 'optimized') return 'success';
  if (technique === 'native' || technique === '') return 'danger';
  return 'default';
}

interface IconFilterBarProps {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
}

export const IconFilterBar = memo(function IconFilterBar({
  filters,
  onFilterChange,
}: IconFilterBarProps) {
  const techniqueVariant = useMemo(
    () => getTechniqueVariant(filters.technique),
    [filters.technique],
  );

  return (
    <div className="flex items-center justify-center gap-2">
      <IconFilterButton
        icon={Gauge}
        label="Technique"
        value={filters.technique}
        options={FILTERING_TECHNIQUES}
        onChange={(value) => onFilterChange('technique', value)}
        variant={techniqueVariant}
      />
      <IconFilterButton
        icon={MapPin}
        label="State"
        value={filters.state}
        options={STATE_OPTIONS}
        onChange={(value) => onFilterChange('state', value)}
      />
      <IconFilterButton
        icon={Building2}
        label="Entity Type"
        value={filters.entityType}
        options={ENTITY_TYPE_OPTIONS}
        onChange={(value) => onFilterChange('entityType', value)}
      />
      <IconFilterButton
        icon={CircleCheck}
        label="ABN Status"
        value={filters.abnStatus}
        options={ABN_STATUS_OPTIONS}
        onChange={(value) => onFilterChange('abnStatus', value)}
      />
    </div>
  );
});
