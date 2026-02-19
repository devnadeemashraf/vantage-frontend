/**
 * aiSearchApi — RTK Query AI search endpoint
 * Layer: Feature Slice (ai-search)
 * Pattern: API definition (injected into baseApi)
 *
 * Injects aiSearch query into baseApi. Hits /businesses/search with
 * mode=ai and limit=5 for quick previews in chat. Exposes useLazyAiSearchQuery
 * for on-demand calls. Used by AiSearchContainer.
 */

import { baseApi } from '@app/baseApi';
import type { SearchResponse } from '@shared/types';

export const aiSearchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    aiSearch: build.query<SearchResponse, string>({
      query: (q) => ({
        url: '/businesses/search',
        params: { q, mode: 'ai', limit: 5 },
      }),
    }),
  }),
});

export const { useLazyAiSearchQuery } = aiSearchApi;
