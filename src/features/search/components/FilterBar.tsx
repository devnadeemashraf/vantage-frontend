/**
 * FilterBar — Stateless filter bar composing dropdowns
 * Layer: Feature Slice (search)
 * Pattern: Stateless Presentational
 *
 * Composes three FilterDropdowns (State, Entity Type, ABN Status) using
 * options from shared constants. Maps '__all__' to empty string for
 * "no filter selected". Used by SearchForm on home and refinement flows.
 */

import {
  ABN_STATUS_OPTIONS,
  ENTITY_TYPE_OPTIONS,
  STATE_OPTIONS,
} from '@shared/lib/constants';

import type { SearchFilters } from '../types';
import { FilterDropdown } from './FilterDropdown';

interface FilterBarProps {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const handleChange = (key: keyof SearchFilters) => (value: string) => {
    onFilterChange(key, value === '__all__' ? '' : value);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <FilterDropdown
        label="State"
        value={filters.state || '__all__'}
        options={STATE_OPTIONS}
        onChange={handleChange('state')}
      />
      <FilterDropdown
        label="Entity Type"
        value={filters.entityType || '__all__'}
        options={ENTITY_TYPE_OPTIONS}
        onChange={handleChange('entityType')}
      />
      <FilterDropdown
        label="ABN Status"
        value={filters.abnStatus || '__all__'}
        options={ABN_STATUS_OPTIONS}
        onChange={handleChange('abnStatus')}
      />
    </div>
  );
}
