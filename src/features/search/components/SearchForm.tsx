/**
 * SearchForm — Stateless search form with filters
 * Layer: Feature Slice (search)
 * Pattern: Stateless Presentational
 *
 * Renders search input, submit button, and FilterBar. All state is controlled
 * via props (query, filters, handlers). Handles Enter key to submit. Used by
 * StandardSearchContainer on the home page.
 */

import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { SearchFilters } from '../types';
import { FilterBar } from './FilterBar';

interface SearchFormProps {
  query: string;
  filters: SearchFilters;
  onQueryChange: (value: string) => void;
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
  onSubmit: () => void;
}

export function SearchForm({
  query,
  filters,
  onQueryChange,
  onFilterChange,
  onSubmit,
}: SearchFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSubmit();
  };

  return (
    <div className="space-y-4">
      <div className="mx-auto flex max-w-2xl gap-2">
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter keyword..."
          className="h-12 text-base"
          aria-label="Search businesses"
        />
        <Button size="lg" onClick={onSubmit} aria-label="Search">
          <Search className="h-5 w-5" />
        </Button>
      </div>
      <FilterBar filters={filters} onFilterChange={onFilterChange} />
    </div>
  );
}
