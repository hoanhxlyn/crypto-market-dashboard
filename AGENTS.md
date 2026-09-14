# AGENTS.md

## Stack

- React Router v8 SPA (`ssr: false` in `react-router.config.ts`) + Vite
- Mantine v9 (UI library) — import styles via `@mantine/core/styles.css`
- TanStack React Query — query client configured in `app/root.tsx` (staleTime: 60s, retry: 3)
- Zod v4 for API response validation — schemas in `app/types/coin.ts`
- CoinGecko free API (`api.coingecko.com/api/v3`) — no API key, rate limited (429)

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Production serve | `npm run start` |
| Lint | `npm run lint` |
| Format | `npm run format` |
| Typecheck | `npm run typecheck` (runs `react-router typegen && tsc`) |

**Order matters:** `typecheck` depends on `react-router typegen` first — `.react-router/types/` must exist before `tsc` passes.

## Linting

Biome (not ESLint/Prettier). Config: `biome.json`.
- Indent: 2 spaces, line width 80
- Pre-commit hook (lefthook) runs `biome check --staged --write`

## Project Structure

```
app/
  root.tsx          — Layout, QueryClientProvider, MantineProvider, ErrorBoundary
  routes.ts         — flatRoutes() from @react-router/fs-routes
  routes/           — File-based routing (index + coin detail)
  components/       — UI components (coin-card, loading-skeleton)
  hooks/queries.ts  — React Query hooks + useCoinParams (reads URL search params)
  lib/api.ts        — CoinGecko fetch functions (with Zod validation)
  types/coin.ts     — Coin/CoinDetail Zod schemas + inferred types
```

## Conventions

- Path alias: `~/` maps to `app/` (tsconfig paths)
- File-based routing via `@react-router/fs-routes` — add routes by creating files in `app/routes/`
- API types: always validate CoinGecko responses with Zod schemas before use
- Data fetching: use React Query hooks in `app/hooks/queries.ts`, not raw `fetch`
- Search/sort params: read from URL via `useSearchParams` (state in URL, not component state)
