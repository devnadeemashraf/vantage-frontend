/**
 * searchApi — RTK Query search endpoint
 * Layer: Feature Slice (search)
 * Pattern: API definition (injected into baseApi)
 *
 * Injects searchBusinesses query into baseApi. Hits /businesses/search with
 * params (q, state, entityType, abnStatus, page, limit, mode). Tagged
 * with 'Search' for cache invalidation. Used by SearchResultsContainer.
 */

import { baseApi } from '@app/baseApi';
import type { SearchParams, SearchResponse } from '@shared/types';

export const searchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    searchBusinesses: build.query<SearchResponse, SearchParams>({
      query: (params) => ({
        url: '/businesses/search',
        params: {
          q: params.q || undefined,
          state: params.state || undefined,
          postcode: params.postcode || undefined,
          entityType: params.entityType || undefined,
          abnStatus: params.abnStatus || undefined,
          page: params.page,
          limit: params.limit,
          mode: params.mode,
          technique: params.technique,
        },
      }),
      providesTags: ['Search'],
    }),
  }),
});

export const { useSearchBusinessesQuery } = searchApi;
