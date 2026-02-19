/**
 * NotFoundPage — 404 fallback
 * Layer: Pages
 * Pattern: Page shell (fallback)
 *
 * Renders when no route matches. Shows 404 heading, message, and link to
 * home. Used as catch-all route in the router config.
 */

import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Link to="/" className="text-primary underline underline-offset-4">
        Go home
      </Link>
    </div>
  );
}
