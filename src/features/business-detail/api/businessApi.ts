/**
 * businessApi — RTK Query ABN lookup endpoint
 * Layer: Feature Slice (business-detail)
 * Pattern: API definition (injected into baseApi)
 *
 * Injects getBusinessByAbn query into baseApi. Hits /businesses/:abn for
 * a single business. Tagged with Business:id for cache invalidation. Used
 * by BusinessDetailContainer on /business/:abn routes.
 */

import { baseApi } from '@app/baseApi';
import type { BusinessDetailResponse } from '@shared/types';

export const businessApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBusinessByAbn: build.query<BusinessDetailResponse, string>({
      query: (abn) => `/businesses/${abn}`,
      providesTags: (_result, _error, abn) => [{ type: 'Business', id: abn }],
    }),
  }),
});

export const { useGetBusinessByAbnQuery } = businessApi;
