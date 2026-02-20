/**
 * Composed Context Providers
 * Layer: App
 *
 * Wraps the entire app in Redux + Router providers in the correct nesting order.
 * Adding a new global provider (theme, auth, etc.) means adding it here once,
 * keeping App.tsx minimal and focused.
 */

import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router';

import { store } from '@/app/store';

import { ThemeProvider } from './themeProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vantage-ui">
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    </ReduxProvider>
  );
}
