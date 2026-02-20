/**
 * NewSearchButton — Button to return to home search page
 * Layer: Feature Slice (results)
 * Pattern: Stateless Presentational
 *
 * Navigates to the home page to start a fresh search. Clears all
 * query parameters. Shows Home icon with tooltip for compact display.
 * Supports disabled state during loading.
 */

import { Home } from 'lucide-react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

interface NewSearchButtonProps {
  disabled?: boolean;
}

export function NewSearchButton({ disabled = false }: NewSearchButtonProps) {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={handleClick}
      aria-label="New Search"
      title="New Search"
      className="h-9 w-9"
      disabled={disabled}
    >
      <Home className="h-4 w-4" />
    </Button>
  );
}
