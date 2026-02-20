/**
 * useSearchParams — URL search params hook for search
 * Layer: Feature Slice (search)
 * Pattern: Custom hook (URL sync)
 *
 * Reads search parameters from the URL (q, state, entityType, abnStatus, page,
 * limit, mode) and returns typed params plus a setParams updater. Used by
 * SearchResultsContainer to drive API queries and pagination from the URL.
 */

import { DEFAULT_PAGE_SIZE } from '@shared/lib/constants';
import type { SearchParams } from '@shared/types';
import { useSearchParams as useRouterSearchParams } from 'react-router';

/**
 * Reads search parameters from the URL and returns them as a typed object.
 * Also provides a setter to update the URL (triggering a re-render and refetch).
 */
export function useSearchQueryParams() {
  const [searchParams, setSearchParams] = useRouterSearchParams();

  const params: SearchParams = {
    q: searchParams.get('q') ?? undefined,
    state: searchParams.get('state') ?? undefined,
    postcode: searchParams.get('postcode') ?? undefined,
    entityType: searchParams.get('entityType') ?? undefined,
    abnStatus: searchParams.get('abnStatus') ?? undefined,
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || DEFAULT_PAGE_SIZE,
    mode: (searchParams.get('mode') as 'standard' | 'ai') ?? 'standard',
    technique:
      (searchParams.get('technique') as 'native' | 'optimized') ?? 'native',
  };

  const setParams = (next: Partial<SearchParams>) => {
    const merged = { ...params, ...next };
    const entries: Record<string, string> = {};

    if (merged.q) entries.q = merged.q;
    if (merged.state) entries.state = merged.state;
    if (merged.postcode) entries.postcode = merged.postcode;
    if (merged.entityType) entries.entityType = merged.entityType;
    if (merged.abnStatus) entries.abnStatus = merged.abnStatus;
    if (merged.page && merged.page > 1) entries.page = String(merged.page);
    if (merged.limit && merged.limit !== DEFAULT_PAGE_SIZE)
      entries.limit = String(merged.limit);
    if (merged.mode && merged.mode !== 'standard') entries.mode = merged.mode;
    if (merged.technique && merged.technique !== 'native')
      entries.technique = merged.technique;

    setSearchParams(entries);
  };

  return { params, setParams };
}
