# Crypto Market Dashboard

Live top-20 cryptocurrencies by market cap, powered by CoinGecko.

## Prerequisites

- [Bun](https://bun.sh) (v1+)

## Setup

```bash
bun install
```

## Development

```bash
bun dev
```

Opens at `http://localhost:5173`.

## Commands

| Task | Command |
|------|---------|
| Dev server | `bun dev` |
| Build | `bun run build` |
| Production serve | `bun run start` |
| Lint | `bun run lint` |
| Format | `bun run format` |
| Typecheck | `bun run typecheck` |

## Stack

- React Router v8 (SPA mode) + Vite
- Mantine v9
- TanStack React Query
- Zod v4
- Biome (lint + format)
- TypeScript via `tsgo` (`@typescript/native-preview`)
