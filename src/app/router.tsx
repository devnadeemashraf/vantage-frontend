/**
 * Application Route Definitions
 * Layer: App
 *
 * Pages are lazy-loaded via React.lazy + Suspense for route-level code splitting.
 * Each page chunk is only fetched when the user navigates to that route,
 * keeping the initial bundle small.
 *
 * Route structure:
 *   /                -> HomePage (standard search or AI search based on mode)
 *   /results         -> ResultsPage (paginated search results)
 *   /business/:abn   -> BusinessDetailPage (single business detail view)
 *   *                -> NotFoundPage (404 catch-all)
 */

import RootLayout from '@layouts/RootLayout';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const HomePage = lazy(() => import('@pages/HomePage'));
const ResultsPage = lazy(() => import('@pages/ResultsPage'));
const BusinessDetailPage = lazy(() => import('@pages/BusinessDetailPage'));
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-muted-foreground text-sm">Loading...</div>
    </div>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<PageFallback />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="results"
          element={
            <Suspense fallback={<PageFallback />}>
              <ResultsPage />
            </Suspense>
          }
        />
        <Route
          path="business/:abn"
          element={
            <Suspense fallback={<PageFallback />}>
              <BusinessDetailPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<PageFallback />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
