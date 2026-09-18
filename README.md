# Crypto Market Dashboard

[![Deploy](https://img.shields.io/badge/Live_Preview-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://charming-figolla-931f3d.netlify.app/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/c4bb28e6-e612-4eb9-83f2-75a518f5b3a8/deploy-status)](https://app.netlify.com/projects/charming-figolla-931f3d/deploys)

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
