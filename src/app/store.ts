/**
 * store.ts — Redux Store Configuration
 * Layer: App
 * Pattern: Single source of truth for app-wide state
 *
 * Configures the root Redux store with RTK Query's baseApi reducer and middleware,
 * plus the aiChat slice for AI search conversation state. All feature slices
 * inject endpoints into baseApi rather than creating separate API instances.
 */

import { aiChatReducer } from '@features/ai-search';
import { configureStore } from '@reduxjs/toolkit';

import { baseApi } from './baseApi';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    aiChat: aiChatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
