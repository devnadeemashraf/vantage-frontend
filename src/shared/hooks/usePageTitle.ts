/**
 * usePageTitle — Page title side effect
 * Layer: Shared / Hooks
 * Pattern: Side-effect hook
 *
 * Sets document.title to the given title with " — Vantage" suffix. Restores
 * previous title on unmount. Used by SearchResultsContainer and similar
 * page-level components for SEO and browser tab labeling.
 */

import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — Vantage` : 'Vantage';
    return () => {
      document.title = prev;
    };
  }, [title]);
}
