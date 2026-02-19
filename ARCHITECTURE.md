# Vantage Frontend — Architecture Deep Dive

This document explains every architectural decision, design pattern, and technical concept used in the Vantage frontend. It's written so that you can read it top-to-bottom and walk away understanding *why* every piece exists, not just *what* it does.

---

## Table of Contents

1. [Vertical Slice Architecture](#1-vertical-slice-architecture)
2. [Stateful vs Stateless Separation](#2-stateful-vs-stateless-separation)
3. [Redux Toolkit and RTK Query](#3-redux-toolkit-and-rtk-query)
4. [URL-Driven State](#4-url-driven-state)
5. [React Router v7 and Lazy Loading](#5-react-router-v7-and-lazy-loading)
6. [Shadcn UI and Tailwind CSS 4](#6-shadcn-ui-and-tailwind-css-4)
7. [The Vite Dev Proxy](#7-the-vite-dev-proxy)
8. [TypeScript Generics in the UI Layer](#8-typescript-generics-in-the-ui-layer)
9. [React.memo and Render Optimization](#9-reactmemo-and-render-optimization)
10. [Error Boundaries](#10-error-boundaries)
11. [Custom Hooks](#11-custom-hooks)
12. [Bundle Splitting and manualChunks](#12-bundle-splitting-and-manualchunks)
13. [Path Aliases](#13-path-aliases)
14. [Folder Structure Reference](#14-folder-structure-reference)

---

## 1. Vertical Slice Architecture

### What it is

Most React tutorials teach **horizontal layering**: all components in `/components`, all hooks in `/hooks`, all API logic in `/api`. This works for small apps but becomes a nightmare at scale because adding a single feature means touching five different folders.

**Vertical Slice Architecture** flips this on its side. Code is organized by **feature domain**:

```
features/
  search/          ← everything the search feature needs
    components/    ← presentational components
    containers/    ← stateful components
    hooks/         ← feature-specific hooks
    api/           ← RTK Query endpoints
    types.ts       ← feature-local types
    index.ts       ← public barrel export
```

Each feature is a self-contained vertical slice that owns its UI, state, API definitions, and types. If you need to understand or modify "search," you open one folder.

### Why it matters

1. **Locality of reference.** Everything related to a feature lives together. You don't jump between five directories to trace a bug.
2. **Independent deployability.** In a larger team, one dev works on `ai-search/` while another works on `results/` without merge conflicts.
3. **Clear dependency direction.** Features import from `shared/` but **never from each other**. If `search` and `results` both need something, it belongs in `shared/`. This prevents circular dependencies and spaghetti imports.

### The shared layer

Cross-cutting concerns that don't belong to any single feature live in `shared/`:

- `shared/ui/` — Reusable presentational components (DataTable, Pagination, ModeToggle)
- `shared/hooks/` — Generic hooks (useDebounce, useMediaQuery, usePageTitle)
- `shared/lib/` — Utilities and constants (cn(), API_BASE_URL, filter options)
- `shared/types/` — Domain types mirrored from the backend (Business, SearchParams)

**Rule of thumb:** If only one feature uses it, keep it in that feature's folder. If two or more features use it, promote it to `shared/`.

---

## 2. Stateful vs Stateless Separation

This is the single most important React pattern in this project. Every component falls into exactly one of three categories:

### Stateless (Presentational) — `features/*/components/` or `shared/ui/`

```tsx
// Pure function of props. Zero useState, zero useEffect, zero API calls.
function HeroSection() {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-5xl font-bold">Vantage</h1>
      <p className="text-muted-foreground mt-3">
        Search the Australian Business Register
      </p>
    </div>
  );
}
```

These components:
- Take props in, render JSX out
- Have no internal state, no side effects
- Fire callback props (like `onSubmit`, `onFilterChange`) when the user interacts
- Are trivially testable — render with props, assert the output
- Can be wrapped in `React.memo` for free performance wins

### Stateful (Container) — `features/*/containers/`

```tsx
// Owns state, calls hooks, delegates ALL rendering to children.
function StandardSearchContainer() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const handleSubmit = () => {
    navigate(`/results?${buildParams(query, filters)}`);
  };

  return (
    <>
      <HeroSection />
      <SearchForm
        query={query}
        filters={filters}
        onQueryChange={setQuery}
        onFilterChange={handleFilterChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}
```

These components:
- Own `useState`, `useEffect`, RTK Query hooks, URL params
- Contain **zero styling or markup** — they delegate everything to stateless children
- Act as the "brain" that wires data to UI

### Pages — `pages/`

Pages are the thinnest possible wrappers. They read route parameters and render the correct container:

```tsx
export default function ResultsPage() {
  return <SearchResultsContainer />;
}
```

No business logic, no state, no styling. This keeps the routing layer dumb and the feature logic encapsulated.

### Why this separation matters

Imagine you need to change how the search results table looks. You open `features/results/components/` and edit the presentational components. The container logic (data fetching, pagination, error handling) is untouched. Conversely, if you need to change the API call, you edit the container and the presentational components don't change.

This is the **Single Responsibility Principle** applied to React components.

---

## 3. Redux Toolkit and RTK Query

### The problem RTK Query solves

Without RTK Query, every data-fetching component looks like this:

```tsx
function SearchResults({ query }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/v1/businesses/search?q=${query}`)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [query]);

  // ... render loading, error, or data
}
```

This pattern is repeated in every component that fetches data. It's verbose, error-prone (missing cleanup, race conditions), and doesn't handle caching.

### How RTK Query replaces it

RTK Query lets you define an endpoint once:

```tsx
const searchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    searchBusinesses: build.query<SearchResponse, SearchParams>({
      query: (params) => ({
        url: '/businesses/search',
        params,
      }),
    }),
  }),
});

export const { useSearchBusinessesQuery } = searchApi;
```

Then consume it with a single hook:

```tsx
const { data, isLoading, isError, refetch } = useSearchBusinessesQuery(params);
```

That one line replaces ~30 lines of manual fetch logic. RTK Query handles:

- **Loading/error/success states** — automatically
- **Caching** — identical requests within 120 seconds (our config) are served from memory, zero network
- **Deduplication** — if 3 components request the same data simultaneously, only 1 HTTP request fires
- **Automatic refetch** — when the hook arguments change (e.g., new search query), it refetches
- **Cache invalidation** — via `providesTags` / `invalidatesTags` (like how we tag search results with `'Search'`)

### baseApi: The single API instance

The entire app has exactly one `createApi` instance (`baseApi`). Each feature injects its endpoints into this base:

```
baseApi (single createApi)
  ├─ searchApi.injectEndpoints(...)     ← search feature
  ├─ businessApi.injectEndpoints(...)   ← business-detail feature
  └─ aiSearchApi.injectEndpoints(...)   ← ai-search feature
```

This ensures all API calls share the same cache, middleware, and reducer. The `injectEndpoints` pattern is how RTK Query supports code-splitting — the AI search endpoints aren't even loaded until the user switches to AI mode.

### When to use Redux vs RTK Query vs URL params

| State type | Where it lives | Why |
|---|---|---|
| API response data | RTK Query cache (automatic) | Caching, deduplication, refetch — all handled automatically |
| Search query, filters, pagination | URL search params | Shareable, bookmarkable, survives refresh |
| AI chat messages | Redux slice (`aiChatSlice`) | Ephemeral session state, not tied to a URL |
| Form input before submission | Local `useState` | Transient, doesn't need to persist |

The AI chat slice is the only hand-written Redux slice. Everything else is either URL-driven or RTK Query-managed.

### useLazyQuery vs useQuery

In `searchApi`, we use `useSearchBusinessesQuery(params)` — this fetches automatically when the component mounts or `params` change. It's "eager."

In `aiSearchApi`, we use `useLazyAiSearchQuery()` — this returns a `trigger` function that we call manually (on button click). It's "lazy." This is necessary because AI search fires on user action, not on mount.

---

## 4. URL-Driven State

### The concept

Instead of storing search parameters in Redux or component state, they live in the URL:

```
/results?q=plumbing&state=NSW&entityType=PRV&page=2&limit=20
```

### Why URLs instead of Redux

1. **Shareable.** Copy the URL, send it to a colleague — they see the exact same search results.
2. **Bookmarkable.** Users can bookmark a filtered search.
3. **Back button works.** Browser history tracks every search as a separate entry.
4. **No state synchronization bugs.** The URL is the single source of truth. When it changes, RTK Query automatically refetches.

### How it works in practice

The `useSearchQueryParams` hook reads from the URL:

```tsx
const [searchParams] = useSearchParams();
const q = searchParams.get('q') ?? undefined;
const page = Number(searchParams.get('page')) || 1;
```

The `StandardSearchContainer` writes to the URL on form submit:

```tsx
navigate(`/results?q=${query}&state=${state}`);
```

The `SearchResultsContainer` reads from the URL and passes to RTK Query:

```tsx
const { data } = useSearchBusinessesQuery({ q, state, page, limit });
```

When the URL changes (user clicks pagination, refines search, or hits back), the hook arguments change, and RTK Query automatically refetches (or serves from cache if the exact same URL was visited within 120 seconds).

### The mode parameter

The `?mode=standard|ai` parameter controls which search interface the home page renders. This lives in the URL too, which means switching between Standard and AI mode is just a URL change — the browser's back button seamlessly switches between modes.

---

## 5. React Router v7 and Lazy Loading

### Route-level code splitting

Pages are loaded via `React.lazy`:

```tsx
const HomePage = lazy(() => import('@pages/HomePage'));
const ResultsPage = lazy(() => import('@pages/ResultsPage'));
```

This means the browser only downloads the JavaScript for a page when the user navigates to it. The AI search feature (which includes the chat UI, message list, Redux slice, and API definition) is never loaded if the user stays on standard mode.

Each lazy-loaded page is wrapped in `<Suspense>` with a fallback:

```tsx
<Suspense fallback={<PageFallback />}>
  <HomePage />
</Suspense>
```

### The RootLayout pattern

React Router v7's `<Outlet />` renders the matched child route. The `RootLayout` wraps all routes with a persistent header (the ModeToggle). When the user navigates between pages, only the `<Outlet />` content changes — the header stays mounted and doesn't re-render.

```
RootLayout (persistent shell)
  ├─ Header with ModeToggle (always visible)
  └─ <Outlet /> (swaps between HomePage, ResultsPage, etc.)
```

---

## 6. Shadcn UI and Tailwind CSS 4

### Why Shadcn UI over a component library

Traditional component libraries (Material UI, Ant Design) ship as npm packages. You import components but can't easily modify their internals. If a button doesn't look right, you fight with `!important` overrides or complex theme configs.

Shadcn UI takes a different approach: you **copy components into your project** via `npx shadcn add button`. The component source code lives at `src/components/ui/button.tsx`. You own it completely. Need to change how the button renders? Edit the file directly. No abstraction to fight.

Under the hood, Shadcn components are built on:
- **Radix UI** — unstyled, accessible primitives (handles focus management, keyboard nav, ARIA attributes)
- **CVA (class-variance-authority)** — type-safe variant definitions (`variant="outline"`, `size="sm"`)
- **Tailwind CSS** — utility classes for styling

### Tailwind CSS 4: what's different

Tailwind CSS 4 uses **CSS-first configuration**. Instead of a `tailwind.config.js`, the config lives in CSS:

```css
@import 'tailwindcss';
```

Content detection is automatic — no more `content: ['./src/**/*.{ts,tsx}']`. Tailwind 4 scans your project automatically.

The theme is defined via CSS custom properties (in `src/index.css`):

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
}
```

This means `bg-background`, `text-foreground`, `text-primary` all resolve to these CSS variables. Switching to dark mode is just swapping the `:root` variables under a `.dark` class.

### The cn() utility

```tsx
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`cn()` solves a specific problem: Tailwind class conflicts. If a component has `px-4` internally and you pass `px-8` as a prop, both classes exist and the browser picks whichever comes last in the stylesheet (unpredictable). `twMerge` intelligently resolves conflicts — `px-8` wins, `px-4` is removed.

---

## 7. The Vite Dev Proxy

### The CORS problem

Your frontend runs on `http://localhost:5175`. Your backend runs on `http://localhost:3000`. When the browser tries to fetch `http://localhost:3000/api/v1/businesses/search` from the frontend origin, the browser blocks the request with a CORS error (Cross-Origin Resource Sharing). This is a browser security feature.

### The proxy solution

Instead of configuring CORS headers on the backend, Vite acts as a middleman:

```ts
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

When the frontend makes a request to `/api/v1/businesses/search`, the browser sends it to `http://localhost:5175/api/v1/businesses/search` (the Vite dev server). Vite intercepts it, forwards it to `http://localhost:3000/api/v1/businesses/search`, gets the response, and passes it back to the browser.

From the browser's perspective, the request never crosses origins. CORS is completely bypassed.

```
Browser → Vite (5175) → Backend (3000)
Browser ← Vite (5175) ← Backend (3000)
```

### Why you see port 5175 in the network tab

This is expected. The browser shows the request going to `localhost:5175` because the proxy is transparent. The browser doesn't know (or care) that Vite forwarded it to port 3000. If you look at Vite's terminal output, you'll see the proxied requests being logged.

### Production: no proxy needed

In production, the frontend is built into static files (`dist/`) and served by the same server as the backend (or a CDN). Since both share the same origin, CORS isn't an issue. The `VITE_API_BASE_URL` environment variable switches from the relative `/api/v1` to an absolute URL if needed.

---

## 8. TypeScript Generics in the UI Layer

### The DataTable generic

```tsx
export interface ColumnDef<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
}: DataTableProps<T>) { ... }
```

The `<T>` generic means DataTable works with **any data type**. When the results feature uses it, `T` becomes `Business`. When the AI search truncated table uses it, `T` is still `Business` but with different columns. If we added a "Users" feature tomorrow, the same DataTable works with `User` rows — zero modifications.

TypeScript infers `T` from usage:

```tsx
// TypeScript knows T = Business because businessColumns is ColumnDef<Business>[]
<DataTable columns={businessColumns} data={businesses} keyExtractor={(row) => row.abn} />
```

If you accidentally pass `User[]` data with `Business` columns, TypeScript catches it at compile time.

---

## 9. React.memo and Render Optimization

### The re-render problem

When a parent component's state changes, React re-renders all its children — even if their props haven't changed. In the results page, changing the current page (a state change in the container) would re-render every `ResultsHeader`, `CompactSearchBar`, `DataTable`, and `Pagination` component, even though only the DataTable's data actually changed.

### How React.memo fixes it

```tsx
export const Pagination = memo(function Pagination({ page, totalPages, onPageChange }) {
  // Only re-renders if page, totalPages, or onPageChange actually changed
});
```

`React.memo` wraps a component in a shallow comparison layer. If the new props are shallowly equal to the old props, the component skips rendering entirely. Since our stateless components are pure functions of props, memoization is always safe.

### Why not memo everything?

There is a small overhead to the comparison itself. For components that re-render cheaply (tiny, few props), the cost of comparing may exceed the cost of re-rendering. We apply `memo` to components that:

1. Are rendered frequently (table rows, pagination)
2. Have complex JSX trees (DataTable, MessageList)
3. Receive stable props that rarely change (HeroSection, ModeToggle)

### useCallback: keeping prop references stable

```tsx
const handleModeChange = useCallback(
  (next: 'standard' | 'ai') => { navigate(`/?mode=${next}`); },
  [navigate, searchParams],
);
```

Without `useCallback`, a new function object is created on every render. A memoized child receiving this function would think its props changed (because `oldFn !== newFn` even if they do the same thing). `useCallback` returns the same function reference across renders unless its dependencies change.

---

## 10. Error Boundaries

### Why a class component?

Error boundaries are the **only** React feature that still requires class components. There is no hook equivalent for `componentDidCatch` or `getDerivedStateFromError`. React's error boundary API catches errors during rendering, not in event handlers or async code.

```tsx
export class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}
```

### What it catches vs what it doesn't

| Caught | Not caught |
|---|---|
| Errors during render (`null.something`) | Errors in `onClick` handlers |
| Errors in lifecycle methods | Errors in `async` functions |
| Errors in child component tree | Errors in the error boundary itself |

For errors in event handlers and async code, we use `try/catch` (like in `AiSearchContainer.handleSend`) and Sonner toast notifications.

### Where it's placed

The ErrorBoundary wraps the entire app in `App.tsx`, above the providers and router. If any component in the tree throws during render, the user sees a "Something went wrong" screen with a "Try again" button instead of a white page.

---

## 11. Custom Hooks

### useDebounce

```tsx
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
```

**What it does:** Returns a value that only updates after `delay` milliseconds of inactivity.

**Why it matters:** Without debouncing, a search input fires an API call on every keystroke. Typing "plumber" sends 7 requests: "p", "pl", "plu", "plum", "plumb", "plumbe", "plumber". With a 300ms debounce, only the final "plumber" request fires (assuming the user types faster than 300ms per character).

**How the cleanup works:** The `return () => clearTimeout(timer)` is a cleanup function. When `value` changes, React runs the cleanup from the previous effect (cancels the old timer) before starting the new one. This ensures only the latest timer survives.

### useMediaQuery

Subscribes to a CSS media query and returns a boolean. Useful for responsive logic that can't be expressed in CSS alone (like conditionally rendering a component vs hiding it with `display: none`).

### usePageTitle

Sets `document.title` and restores the previous title on unmount. This gives each page a descriptive browser tab title without cluttering the page component with `useEffect`.

---

## 12. Bundle Splitting and manualChunks

### The problem with one big bundle

Without splitting, Vite produces a single JavaScript file containing React, Redux, Shadcn UI, Lucide icons, and all your application code. The browser downloads everything upfront, even if the user only visits the home page.

### Route-level splitting (React.lazy)

```tsx
const ResultsPage = lazy(() => import('@pages/ResultsPage'));
```

This tells Vite to create a separate chunk for `ResultsPage` and everything it imports. The browser only downloads it when the user navigates to `/results`. The AI search feature (including `AiSearchContainer`, `aiChatSlice`, `ChatMessage`, etc.) is in its own chunk, loaded only when the user switches to AI mode.

### Vendor splitting (manualChunks)

```ts
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router'],
  'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
  'ui-vendor': ['class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
}
```

**Why separate vendor chunks?** Libraries like React rarely change between deployments. By isolating them into their own chunk, the browser caches `react-vendor.js` permanently. When you deploy a code change, only the application chunk is invalidated — users don't re-download React.

### The production build output

```
dist/
  index.html                    0.87 kB
  assets/
    index-xxxx.css             40 kB      ← all styles (Tailwind purges unused)
    react-vendor-xxxx.js       39 kB      ← React + ReactDOM + Router
    redux-vendor-xxxx.js       41 kB      ← Redux Toolkit + RTK Query
    ui-vendor-xxxx.js          31 kB      ← CVA + clsx + tw-merge + icons
    HomePage-xxxx.js           86 kB      ← Standard + AI search (lazy)
    ResultsPage-xxxx.js         4 kB      ← Results feature (lazy)
    BusinessDetailPage-xxxx.js  5 kB      ← Detail feature (lazy)
    NotFoundPage-xxxx.js        1 kB      ← 404 page (lazy)
    index-xxxx.js             288 kB      ← app shell + shared code
```

Initial load: `index.js` + `react-vendor.js` + `redux-vendor.js` + `ui-vendor.js` + `index.css`. Feature chunks load on-demand.

---

## 13. Path Aliases

### The import hell problem

Without aliases:

```tsx
import { Business } from '../../../../shared/types/business';
import { DataTable } from '../../../../shared/ui/DataTable';
```

With aliases:

```tsx
import { Business } from '@shared/types/business';
import { DataTable } from '@shared/ui';
```

### How they work

Path aliases are configured in **two places** (they must stay in sync):

1. **`tsconfig.json`** — tells TypeScript how to resolve imports for type checking:
   ```json
   { "paths": { "@shared/*": ["./src/shared/*"] } }
   ```

2. **`vite.config.ts`** — tells Vite how to resolve imports at build time:
   ```ts
   resolve: { alias: { '@shared': path.resolve(__dirname, './src/shared') } }
   ```

If you add an alias in `tsconfig.json` but not in `vite.config.ts`, TypeScript is happy but the build fails. If you add it in Vite but not `tsconfig.json`, the build works but your editor shows red squiggles.

---

## 14. Folder Structure Reference

```
src/
  app/                          ← App-wide wiring (store, baseApi, router, providers)
  features/
    search/                     ← Standard keyword search
      components/               ← Stateless: HeroSection, SearchForm, FilterBar, FilterDropdown
      containers/               ← Stateful: StandardSearchContainer
      hooks/                    ← useSearchQueryParams
      api/                      ← RTK Query: searchBusinesses
      types.ts                  ← SearchFilters
    results/                    ← Paginated search results
      components/               ← Stateless: ResultsHeader, CompactSearchBar, ColumnDefinitions
      containers/               ← Stateful: SearchResultsContainer
      hooks/                    ← usePagination
    ai-search/                  ← ChatGPT-style AI search
      components/               ← Stateless: ChatMessage, TruncatedTable, MessageList, ChatInput
      containers/               ← Stateful: AiSearchContainer
      api/                      ← RTK Query: aiSearch (lazy)
      slices/                   ← Redux: aiChatSlice
    business-detail/            ← Single business view
      components/               ← Stateless: BusinessInfoCard, BusinessNamesTable, StatusBadge
      containers/               ← Stateful: BusinessDetailContainer
      api/                      ← RTK Query: getBusinessByAbn
  shared/
    ui/                         ← Reusable: DataTable, Pagination, ModeToggle, EmptyState, etc.
    hooks/                      ← useDebounce, useMediaQuery, usePageTitle
    lib/                        ← cn(), constants (API_BASE_URL, filter options)
    types/                      ← Business, SearchParams, PaginatedResponse
  pages/                        ← Thin shells: HomePage, ResultsPage, BusinessDetailPage, NotFoundPage
  layouts/                      ← RootLayout (header + Outlet)
  components/ui/                ← Shadcn UI generated primitives (Button, Input, Select, etc.)
```

**Key principle:** The further right a folder is in the tree, the more specific it is. `shared/` is used everywhere. `features/search/` is used only by the search feature. `features/search/components/FilterDropdown.tsx` is used only by `FilterBar.tsx`.

**Dependency flow:** `pages → features → shared → components/ui`. Never backwards, never sideways between features.
