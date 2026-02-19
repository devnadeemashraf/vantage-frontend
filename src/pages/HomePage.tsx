/**
 * HomePage — Page shell for home, reads mode
 * Layer: Pages
 * Pattern: Page shell
 *
 * Reads ?mode= from URL and renders either AiSearchContainer (mode=ai) or
 * StandardSearchContainer (default). Minimal orchestration; delegates all
 * UI to feature containers.
 */

import { AiSearchContainer } from '@features/ai-search';
import { StandardSearchContainer } from '@features/search';
import { useSearchParams } from 'react-router';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get('mode') as 'standard' | 'ai') ?? 'standard';

  if (mode === 'ai') {
    return <AiSearchContainer />;
  }

  return <StandardSearchContainer />;
}
