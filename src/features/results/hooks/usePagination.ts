/**
 * usePagination — Pagination hook synced to URL
 * Layer: Feature Slice (results)
 * Pattern: Custom hook (URL sync)
 *
 * Reads page and limit from URL search params and provides setPage to update
 * the URL (resetting to page 1 when appropriate). Used by SearchResultsContainer
 * to drive pagination without separate state.
 */

import { DEFAULT_PAGE_SIZE } from '@shared/lib/constants';
import { useSearchParams } from 'react-router';

export function usePagination() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || DEFAULT_PAGE_SIZE;

  const setPage = (next: number) => {
    const params = new URLSearchParams(searchParams);
    if (next <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(next));
    }
    setSearchParams(params);
  };

  return { page, limit, setPage };
}
