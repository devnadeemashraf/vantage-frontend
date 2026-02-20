/**
 * SearchForm — Stateless search form with filters
 * Layer: Feature Slice (search)
 * Pattern: Stateless Presentational
 *
 * Renders search input, submit button, and IconFilterBar. All state is
 * controlled via props (query, filters, handlers). Handles Enter key to
 * submit. Used by StandardSearchContainer on the home page.
 */

import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { SearchFilters } from '../types';
import { IconFilterBar } from './IconFilterBar';

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
    <div className="space-y-6">
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by name, ABN, or keyword..."
            className="h-12 rounded-full pr-4 pl-12 text-base shadow-sm"
            aria-label="Search businesses"
          />
        </div>
        <Button
          onClick={onSubmit}
          size="lg"
          className="h-12 rounded-full px-6"
          aria-label="Search"
        >
          Search
        </Button>
      </div>
      <IconFilterBar filters={filters} onFilterChange={onFilterChange} />
    </div>
  );
}
