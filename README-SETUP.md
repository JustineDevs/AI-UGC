# AI-UGC Setup

## Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL 15+ or a writable local SQLite path
- S3-compatible object storage for source and output assets
- Google Gemini API key
- LaoZhang and/or APIMart credentials

## Environment

Create a root `.env` or `.env.local`:

```bash
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_ugc

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

AUTH_TOKEN_SECRET=replace-with-a-long-random-secret
AUTH_SESSION_TTL_HOURS=24
```

Web defaults can usually stay implicit. If needed:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

## Install, Migrate, Run

```bash
pnpm install
pnpm db:migrate
pnpm dev
```

Expected local services:

- API: `http://localhost:3000`
- Web: `http://localhost:5173`

## Useful Commands

```bash
pnpm typecheck
pnpm build
pnpm lint
pnpm test
pnpm provider:validate --provider=laozhang
pnpm provider:validate --provider=apimart
```

## Smoke Verification

```bash
pnpm --filter @ai-ugc/api exec ts-node ../../tooling/scripts/smoke-workspace.ts
pnpm --filter @ai-ugc/api exec ts-node ../../tooling/scripts/smoke-provider-switch.ts
pnpm --filter @ai-ugc/api exec ts-node ../../tooling/scripts/smoke-blueprint-run.ts
```

## Storage Notes

- Metadata and runtime state use the configured database.
- Media assets remain on S3-compatible object storage.
- If browser-to-S3 uploads need local CORS help, see
  [S3-CORS-CONFIG.md](S3-CORS-CONFIG.md).

## Troubleshooting

- If `pnpm db:migrate` fails, verify `DATABASE_URL` and database reachability.
- If provider validation fails, check the API key, base URL, and model names.
- If the web app cannot persist workspace data, verify the API is running and
  reachable at `VITE_API_BASE_URL`.
