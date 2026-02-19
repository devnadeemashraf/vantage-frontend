import { Providers } from '@app/providers';
import { AppRouter } from '@app/router';
import { ErrorBoundary } from '@shared/ui';

import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <AppRouter />
        <Toaster richColors position="top-right" />
      </Providers>
    </ErrorBoundary>
  );
}
