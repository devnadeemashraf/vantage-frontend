/**
 * RootLayout — Root layout shell
 * Layer: Layouts
 * Pattern: Layout shell
 *
 * Wraps all routes with header (ModeToggle) and main content area (Outlet).
 * Reads ?mode= from URL and syncs via navigate. ModeToggle controls whether
 * HomePage renders Standard or AI search. Outlet renders matched child routes.
 */

import { ModeToggle } from '@shared/ui';
import { useCallback } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router';

export default function RootLayout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = (searchParams.get('mode') as 'standard' | 'ai') ?? 'standard';

  const handleModeChange = useCallback(
    (next: 'standard' | 'ai') => {
      const params = new URLSearchParams(searchParams);
      if (next === 'standard') {
        params.delete('mode');
      } else {
        params.set('mode', next);
      }
      navigate(`/?${params.toString()}`);
    },
    [navigate, searchParams],
  );

  return (
    <div className="bg-background text-foreground min-h-svh">
      <header className="flex justify-center pt-6">
        <ModeToggle mode={mode} onModeChange={handleModeChange} />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
