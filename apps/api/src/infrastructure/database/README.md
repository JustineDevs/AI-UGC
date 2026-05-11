# Database Infrastructure

This directory contains the shared database adapter for the AI-UGC API.

- PostgreSQL is used when `DATABASE_URL` is `postgres://` or `postgresql://`
- SQLite is used for local fallback when `DATABASE_URL` is `file:...`
- SQL migrations live in `apps/api/migrations/`
- `pnpm db:migrate` applies pending migrations and records them in
  `schema_migrations`
