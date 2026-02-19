# Vantage Frontend

B2B Company Search Directory — a React SPA for searching Australian businesses via the ABR (Australian Business Register).

## Tech Stack

- **React 19** + **TypeScript** (strict mode)
- **Vite** — dev server with HMR + optimized production builds
- **Tailwind CSS 4** — CSS-first configuration
- **Shadcn UI** — Radix-based component primitives (neutral theme, new-york style)
- **Redux Toolkit + RTK Query** — state management and API caching *(coming in Commit 2)*
- **React Router v7** — client-side routing *(coming in Commit 4)*

## Architecture

**Vertical Slice Architecture** — code organized by feature domain, not technical role.

```
src/
  app/              # App-wide wiring (store, router, providers)
  features/         # Self-contained feature slices
    search/         # Standard search
    results/        # Search results display
    ai-search/      # AI-powered search
    business-detail/# Single business view
  shared/           # Cross-cutting concerns (UI, hooks, types)
  pages/            # Thin composition layers
  layouts/          # Shell layouts
  components/ui/    # Shadcn UI generated primitives
```

## Getting Started

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` with an API proxy forwarding `/api` requests to `http://localhost:3000`.

## Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start Vite dev server with HMR       |
| `npm run build`    | TypeScript check + production build   |
| `npm run preview`  | Preview production build locally      |
| `npm run lint`     | ESLint check                          |
| `npm run lint:fix` | ESLint auto-fix                       |
| `npm run format`   | Prettier formatting                   |
| `npm run type-check` | TypeScript type check (no emit)    |

## Environment Variables

| Variable            | Default   | Purpose                                         |
| ------------------- | --------- | ----------------------------------------------- |
| `VITE_API_BASE_URL` | `/api/v1` | API base URL (proxied in dev, absolute in prod) |
