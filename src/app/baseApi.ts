/**
 * RTK Query base API — the single createApi instance for the entire app.
 *
 * Feature slices inject their endpoints into this base via `injectEndpoints()`,
 * which keeps API definitions co-located with features while sharing a single
 * cache, middleware, and reducer.
 *
 * Cache tuning:
 *   - keepUnusedDataFor: 120s — cached results persist for 2 minutes after the
 *     last component using them unmounts. This means navigating back to a
 *     previous search result is instant within that window.
 *   - refetchOnMountOrArgChange: false — don't refetch if the cache is still valid.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@shared/lib/constants';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Business', 'Search'],
  keepUnusedDataFor: 120,
  refetchOnMountOrArgChange: false,
  endpoints: () => ({}),
});
