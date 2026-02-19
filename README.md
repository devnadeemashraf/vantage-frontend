# Vantage Frontend

> A modern React SPA for searching the Australian Business Register. Built with TypeScript, Redux Toolkit, RTK Query, Shadcn UI, and Tailwind CSS 4, following Vertical Slice Architecture.

---

## Highlights

- **Vertical Slice Architecture** — code organized by feature domain (search, results, ai-search, business-detail), not by technical role. Each slice owns its components, containers, hooks, API definitions, and types.
- **Strict Stateful/Stateless Separation** — containers own state and side-effects; presentational components are pure functions of props with zero internal state.
- **RTK Query** — automatic API caching, deduplication, and cache invalidation. No manual `useEffect` + `useState` fetch patterns.
- **URL-Driven State** — search queries, filters, and pagination live in the URL. Every search is shareable and bookmarkable.
- **Route-Level Code Splitting** — pages are lazy-loaded via `React.lazy` + `Suspense`, keeping the initial bundle small.
- **Shadcn UI + Tailwind CSS 4** — fully customizable component library with CSS-first Tailwind configuration.

---

## Architecture

```
src/
  app/                  # Store, base API, router, providers
  features/
    search/             # Standard search (hero, form, filters)
    results/            # Search results (table, pagination)
    ai-search/          # AI chat interface (messages, truncated table)
    business-detail/    # Single business view (info card, names table)
  shared/
    ui/                 # Reusable presentational components
    hooks/              # useDebounce, useMediaQuery, usePageTitle
    lib/                # cn() utility, constants
    types/              # Business, API response shapes
  pages/                # Thin page shells (no logic)
  layouts/              # RootLayout with ModeToggle
  components/ui/        # Shadcn UI generated primitives
```

### Data Flow

```
URL params ──> useSearchParams() ──> RTK Query hook ──> API fetch ──> Cache
                                          │
                                     Auto-generated
                                     { data, isLoading, isError }
                                          │
                                   Container component
                                          │
                                   Stateless children
```

### Feature Dependency Rule

Features import from `shared/` but **never from each other**. If two features need the same thing, it belongs in `shared/`.

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Language | TypeScript | ~5.9.3 |
| UI Framework | React | 19+ |
| Build Tool | Vite | 7+ |
| Routing | React Router | 7 |
| State | Redux Toolkit + RTK Query | Latest |
| UI Components | Shadcn UI (New York) | Latest |
| Styling | Tailwind CSS | 4 |
| Linting | ESLint (flat config) | 9+ |
| Formatting | Prettier | 3+ |
| Import Sorting | eslint-plugin-simple-import-sort | 12+ |

---

## Getting Started

### Prerequisites

- Node.js v20+ (LTS)
- The Vantage backend running on `http://localhost:3000` (see `../backend/`)

### Setup

```bash
# Install dependencies
npm install

# Create environment file (rename .env.txt to .env)
cp .env.txt .env

# Start dev server (proxies /api to backend)
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start dev server with HMR + API proxy |
| `build` | `tsc -b && vite build` | Production build (type-check + bundle) |
| `preview` | `vite preview` | Preview production build locally |
| `lint` | `eslint .` | Run ESLint checks |
| `lint:fix` | `eslint . --fix` | Auto-fix lint issues |
| `format` | `prettier --write "src/**/*.{ts,tsx,css,json}"` | Format all source files |
| `type-check` | `tsc --noEmit` | Type-check without emitting |

---

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Standard search with hero text, input field, and filter dropdowns |
| `/?mode=ai` | AI Search | ChatGPT-style interface with natural language input |
| `/results?q=...` | Results | Paginated table of matching businesses |
| `/business/:abn` | Detail | Full business information card with trading names |

---

## API Integration

The frontend consumes the Vantage backend REST API:

| Endpoint | Usage |
|----------|-------|
| `GET /api/v1/businesses/search?q=&state=&page=&limit=` | Standard + AI search |
| `GET /api/v1/businesses/:abn` | Business detail lookup |
| `GET /api/v1/health` | Health check |

In development, Vite proxies `/api` requests to `http://localhost:3000`, avoiding CORS issues.

---

## Performance

- **Bundle splitting** — React, Redux, and UI vendors are split into separate chunks for independent browser caching.
- **RTK Query cache** — 120-second cache lifetime; identical searches served instantly from memory.
- **React.memo** — All stateless components are memoized to prevent unnecessary re-renders.
- **Lazy loading** — Pages are code-split; the AI search feature chunk is only loaded when the user switches to AI mode.
- **Debounced input** — Search refinements fire after 300ms of inactivity, not on every keystroke.
