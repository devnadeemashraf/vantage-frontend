import { useEffect, useState } from 'react';

/**
 * Debounces a value by the specified delay.
 * Returns the debounced value which only updates after `delay` ms of inactivity.
 * Useful for search inputs — prevents an API call on every keystroke.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
