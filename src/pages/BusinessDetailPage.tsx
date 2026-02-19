/**
 * BusinessDetailPage — Page shell for business detail
 * Layer: Pages
 * Pattern: Page shell
 *
 * Renders BusinessDetailContainer which fetches business by ABN from route.
 * Mounted at /business/:abn. All logic and UI in the business-detail container.
 */

import { BusinessDetailContainer } from '@features/business-detail';

export default function BusinessDetailPage() {
  return <BusinessDetailContainer />;
}
