/**
 * ResultsPage — Page shell for search results
 * Layer: Pages
 * Pattern: Page shell
 *
 * Renders SearchResultsContainer which reads URL params and fetches results.
 * Minimal shell; all logic and UI live in the results feature container.
 */

import { SearchResultsContainer } from '@features/results';

export default function ResultsPage() {
  return <SearchResultsContainer />;
}
