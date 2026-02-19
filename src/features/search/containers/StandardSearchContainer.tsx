/**
 * StandardSearchContainer — Stateful container for standard search
 * Layer: Feature Slice (search)
 * Pattern: Stateful Container
 *
 * Owns form state (query, filters) and coordinates submission. On submit,
 * builds URL search params and navigates to /results. Composes HeroSection
 * and SearchForm; delegates all presentational rendering to child components.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router';

import { HeroSection } from '../components/HeroSection';
import { SearchForm } from '../components/SearchForm';
import type { SearchFilters } from '../types';
import { EMPTY_FILTERS } from '../types';

export function StandardSearchContainer() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (filters.state) params.set('state', filters.state);
    if (filters.entityType) params.set('entityType', filters.entityType);
    if (filters.abnStatus) params.set('abnStatus', filters.abnStatus);

    navigate(`/results?${params.toString()}`);
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <HeroSection />
      <SearchForm
        query={query}
        filters={filters}
        onQueryChange={setQuery}
        onFilterChange={handleFilterChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
