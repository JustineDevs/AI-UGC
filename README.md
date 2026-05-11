# AI-UGC

AI-UGC is a configurable AI user-generated content platform for analyzing
winning source content and generating niche-specific marketing, advertising,
and brand videos.

## What It Includes

- `apps/api` for the NestJS API
- `apps/web` for the React/Vite workspace UI
- `packages/*` for shared contracts, domain types, provider adapters,
  workflow-engine logic, and niche packs
- `prompts/` and `skills/` for repo-owned semantic prompt and execution
  contracts
- `tooling/fixtures/` for workspace, niche-pack, and provider examples

## Current Product Shape

AI-UGC supports:

- workspace setup for bundled or custom niches
- project-level brand, audience, offer, and channel rules
- provider configuration for LaoZhang and APIMart
- versioned blueprint persistence and session launching
- semantic prompt composition and skill-chain runtime orchestration
- output artifact persistence and provider job tracking

## Repo Layout

```text
AI-UGC/
├── apps/
│   ├── api/
│   └── web/
├── packages/
│   ├── config/
│   ├── contracts/
│   ├── domain/
│   ├── niche-packs/
│   ├── provider-apimart/
│   ├── provider-core/
│   ├── provider-laozhang/
│   ├── ui/
│   └── workflow-engine/
├── prompts/
├── schemas/
├── skills/
├── specs/
│   └── 002-ai-ugc-template-platform/
└── tooling/
    └── fixtures/
```

## Quick Start

Use the canonical setup guide:

- [README-SETUP.md](README-SETUP.md)
- [specs/002-ai-ugc-template-platform/quickstart.md](specs/002-ai-ugc-template-platform/quickstart.md)

Typical local flow:

```bash
pnpm install
pnpm db:migrate
pnpm dev
```

Verification:

```bash
pnpm typecheck
pnpm build
pnpm lint
pnpm test
```

## Extension Surfaces

Maintainer-facing extension docs:

- [docs/extensions.md](docs/extensions.md)
- [packages/niche-packs/README.md](packages/niche-packs/README.md)
- [packages/provider-core/README.md](packages/provider-core/README.md)
- [tooling/fixtures/README.md](tooling/fixtures/README.md)

## External Collections

AI-UGC can also vendor external prompt and skill libraries without merging them
into the strict runtime catalog. The current imported collection is:

- [collections/useful-ai-prompts](collections/useful-ai-prompts)

## API Contract

The active platform contract lives at:

- [specs/002-ai-ugc-template-platform/contracts/openapi.yaml](specs/002-ai-ugc-template-platform/contracts/openapi.yaml)

## Development Notes

- The monorepo entrypoints are `apps/api` and `apps/web`.
- The repo is managed as a pnpm workspace with Turborepo orchestration.
- The semantic runtime is repo-owned through `prompts/`, `skills/`, and
  `packages/workflow-engine`.
