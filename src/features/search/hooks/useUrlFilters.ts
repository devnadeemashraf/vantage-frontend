/**
 * useUrlFilters — URL-synchronized filter state hook
 * Layer: Feature Slice (search)
 * Pattern: Custom hook (URL sync)
 *
 * Reads filter values from URL search params and provides a memoized setter
 * that updates the URL. Resets pagination when filters change. Used by both
 * SearchResultsContainer and optionally StandardSearchContainer for consistent
 * filter state management across pages.
 */

import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

import type { SearchFilters } from '../types';

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: SearchFilters = {
    technique: searchParams.get('technique') ?? '',
    state: searchParams.get('state') ?? '',
    entityType: searchParams.get('entityType') ?? '',
    abnStatus: searchParams.get('abnStatus') ?? '',
  };

  const setFilter = useCallback(
    (key: keyof SearchFilters, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('technique');
    params.delete('state');
    params.delete('entityType');
    params.delete('abnStatus');
    params.delete('page');
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  return { filters, setFilter, clearFilters };
}
