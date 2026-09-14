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
| Dev server | `bun dev` |
| Build | `bun run build` |
| Production serve | `bun run start` |
| Lint | `bun run lint` |
| Format | `bun run format` |
| Typecheck | `bun run typecheck` (runs `react-router typegen && tsgo`) |

**Order matters:** `typecheck` depends on `react-router typegen` first — `.react-router/types/` must exist before `tsgo` passes.

## Linting

Biome v2.5.13 (not ESLint/Prettier). Config: `biome.json` with `$schema`.
- Indent: 2 spaces, line width 80
- Pre-commit hook (lefthook) runs `bunx biome check --staged --write`
- `.md` files excluded from Biome via `files.includes`

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
- Lockfile: `bun.lock` (not `package-lock.json`)
- Typecheck uses `tsgo` from `@typescript/native-preview`, not `tsc`
