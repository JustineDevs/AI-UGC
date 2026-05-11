# Quickstart: AI-UGC Template Platform Transformation

## Goal

Stand up the transformed monorepo locally, choose either LaoZhang or APIMart as the active provider gateway, and boot a niche-specific AI-UGC workspace.

## Monorepo Layout

```text
apps/api
apps/web
packages/contracts
packages/config
packages/domain
packages/provider-core
packages/provider-laozhang
packages/provider-apimart
packages/workflow-engine
packages/niche-packs
packages/ui
```

## Prerequisites

- Node.js 20+
- pnpm 10+ or newer workspace-compatible version
- PostgreSQL 15+
- S3-compatible object storage bucket
- Google Gemini API key for source-content analysis
- One or both provider credentials:
  - LaoZhang API key
  - APIMart API key

## Environment Setup

Create a root `.env` (or `.env.local`) with shared workspace settings:

```bash
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_ugc_template
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=changeme
AWS_SECRET_ACCESS_KEY=changeme
AWS_S3_BUCKET=ai-ugc-assets
GEMINI_API_KEY=changeme

DEFAULT_PROVIDER=laozhang

LAOZHANG_API_KEY=changeme
LAOZHANG_API_BASE_URL=https://api.laozhang.ai/v1
LAOZHANG_TEXT_MODEL=gpt-5
LAOZHANG_VIDEO_MODEL=sora-2

APIMART_API_KEY=changeme
APIMART_API_BASE_URL=https://api.apimart.ai/v1
APIMART_TEXT_MODEL=gpt-5
APIMART_VIDEO_MODEL=sora2
```

## Install and Run

```bash
pnpm install
pnpm --filter @ai-ugc/api db:migrate
pnpm dev
```

Expected dev services:

- `apps/api` on `http://localhost:3000`
- `apps/web` on `http://localhost:5173`

## Starter Fixtures

Use the fixture set in `tooling/fixtures/` as copyable starting points and
smoke-test inputs:

- `tooling/fixtures/workspaces/ecommerce-laozhang.workspace-template.json`
- `tooling/fixtures/workspaces/local-services-apimart.workspace-template.json`
- `tooling/fixtures/niche-packs/sample-custom-niche-pack.json`
- `tooling/fixtures/providers/sample-provider-adapter.json`

Suggested usage:

1. Pick the workspace fixture closest to your niche and provider setup.
2. Adjust `enabledNichePackKeys`, provider credentials, and project-profile content.
3. Use the niche-pack fixture as the shape reference for a new bundled pack or a custom workspace-specific pack.
4. Use the provider fixture to document capability expectations before wiring a new adapter package.

## Initialize a Workspace

1. Open the web app.
2. Create a workspace template.
3. Choose a bundled niche pack such as:
   - ecommerce product ads
   - local service ads
   - creator testimonial ads
   - info-product promos
   - organic social proof
4. Select the default provider:
   - LaoZhang for OpenAI-compatible routing through `https://api.laozhang.ai/v1`
   - APIMart for OpenAI-compatible routing through `https://api.apimart.ai/v1`
5. Enter brand rules, audience, offer details, and target channels.
6. Save the project profile and start a generation session.

## Extension References

Maintainer-facing extension documentation lives in:

- `docs/extensions.md`
- `packages/niche-packs/README.md`
- `packages/provider-core/README.md`

## Provider Validation Checks

Run provider health checks from the API app:

```bash
pnpm --filter @ai-ugc/api provider:validate --provider=laozhang
pnpm --filter @ai-ugc/api provider:validate --provider=apimart
```

Expected outcomes:

- Credentials are loaded from environment configuration
- The provider adapter resolves supported capabilities
- Chat/prompt connectivity succeeds
- Video capability is either validated or marked unsupported with a clear message

## Architecture Notes

- `apps/api` is the active API entrypoint
- `apps/web` is the active web entrypoint
- shared contracts and domain entities live in `packages/contracts` and
  `packages/domain`
- provider-specific runtime behavior is routed through shared provider packages
- durable metadata persistence replaces process-local storage for workspace,
  project, session, provider-job, and output-asset state

## Verification Checklist

- `pnpm lint`
- `pnpm test`
- `pnpm build`
- provider validation succeeds for at least one configured gateway
- a sample niche pack can create a workspace and start a generation session
- chosen fixture payload matches the workspace and provider shape documented in `tooling/fixtures/`
- `pnpm --filter @ai-ugc/api exec ts-node ../../tooling/scripts/smoke-workspace.ts`
- `pnpm --filter @ai-ugc/api exec ts-node ../../tooling/scripts/smoke-provider-switch.ts`
- `pnpm --filter @ai-ugc/api exec ts-node ../../tooling/scripts/smoke-blueprint-run.ts`
