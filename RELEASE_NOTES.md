# Release Notes

## AI-UGC Platform Hardening Release

### Highlights

- Added a repo-owned `prompts/` semantic prompt system.
- Added a repo-owned `skills/` contract system with machine-readable schema,
  policy, and step definitions.
- Integrated semantic blueprint, prompt, provider, scoring, revision, and
  export orchestration into the API runtime.
- Upgraded persistence from process-only memory maps to a database-backed layer
  with PostgreSQL support and SQLite fallback.
- Added bearer-token-backed auth session issuance and workspace isolation
  checks.
- Added structured audit logging and request-context-aware observability hooks.
- Added Postgres-gated repository contract tests and extended web/API tests.

### Important Notes

- PostgreSQL-backed repository tests run when `AI_UGC_TEST_DATABASE_URL` or
  `DATABASE_URL` points to Postgres.
- SQLite remains the local fallback when no Postgres URL is supplied.
- The semantic runtime is contract-aware and machine-policy-aware, but it still
  uses handwritten handlers under the hood.

### Follow-up Opportunities

- Add stronger media-quality evaluation that inspects generated media artifacts.
- Replace handwritten handlers with a more dynamic skill-execution model.
- Expand observability from local audit logs to centralized telemetry sinks.
