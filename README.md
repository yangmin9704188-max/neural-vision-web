# Neural Vision Web

AI-powered virtual fitting — from body scan to photorealistic try-on.

> **Single Sources of Truth (SSoT):** All implementation decisions derive from these three documents — any deviation requires a document PR first.
>
> 1. [`docs/ssot/WEB_SSoT_v0.md`](docs/ssot/WEB_SSoT_v0.md) — UI / Routing / UX / Definition of Done (highest priority)
> 2. [`contracts/web_repo_layout_contract_v0.md`](contracts/web_repo_layout_contract_v0.md) — Folder structure / lock file / CI conventions
> 3. [`docs/PIPELINE_MAP_MASTER_v1.md`](docs/PIPELINE_MAP_MASTER_v1.md) — Pipeline / artifact naming / display items

---

## Quick Start

```bash
npm install
npm run dev          # → http://localhost:3000
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript type check (`tsc --noEmit`) |
| `npm run validate:schemas` | Validate contracts lock + schemas (Ajv) |
| `npm run ci` | Run all CI checks locally |

## Routes

| Path | Description | Status |
|------|-------------|--------|
| `/` | Landing page | Skeleton |
| `/demo` | Virtual fitting demo | Skeleton (PR-A) |
| `/showcase` | Pre-generated results gallery | Skeleton (PR-A) |
| `/seller` | Seller portal home | Skeleton (PR-B) |
| `/seller/dashboard` | Seller dashboard | Skeleton (PR-B) |
| `/seller/products` | Garment registration | Skeleton (PR-B) |
| `/seller/jobs` | Fitting job management | Skeleton (PR-C) |

## Architecture

```
src/lib/engine/
├── types.ts      # Shared types (mirrors pipeline contracts)
├── client.ts     # EngineClient interface (abstract)
├── mock.ts       # MockEngineClient (dev/demo)
└── index.ts      # getEngine() factory — switches via NEXT_PUBLIC_ENGINE_MODE
```

Engine mode is controlled by `NEXT_PUBLIC_ENGINE_MODE` environment variable:
- `mock` (default) — in-memory mock data
- `real` — connects to Neural Vision Engine API (PR-D)

## Contracts

Contracts are pinned via `contracts.lock.json` at the repo root.
See `contracts/README.md` for the update procedure.

## Roadmap

- **PR-A:** Mock Engine API routes + `/demo` connection
- **PR-B:** Seller portal: onboarding, product registration with schema validation
- **PR-C:** Job UX: submit/list/get + artifact render/download
- **PR-D:** Real engine switch (`NEXT_PUBLIC_ENGINE_MODE=real`), minimal UI changes
