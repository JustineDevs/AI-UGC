# Release Gate

## Scope

- Real auth tokens/sessions
- Postgres-backed persistence and gated repository tests
- Stronger workspace isolation
- Stronger observability and audit logging
- Semantic prompt/skill runtime hardening

## Required Checks

- `pnpm install`
- `pnpm typecheck`
- `pnpm build`
- `pnpm lint`
- `pnpm test`

## Extra Verification

- `pnpm --filter @ai-ugc/api exec ts-node ../../tooling/scripts/smoke-workspace.ts`
- `pnpm --filter @ai-ugc/api exec ts-node ../../tooling/scripts/smoke-provider-switch.ts`
- `pnpm --filter @ai-ugc/api exec ts-node ../../tooling/scripts/smoke-blueprint-run.ts`

## Status

- `pnpm install`: PASS
- `pnpm typecheck`: PASS
- `pnpm build`: PASS
- `pnpm test`: PASS
- `pnpm lint`: PARTIAL

### Notes

- Web lint has passed on the current app surface.
- The broad API lint command does not terminate deterministically in this
  environment after the latest hardening pass, but no concrete lint failures
  surfaced during the run.
- The release should be treated as engineering-ready, but not as a fully
  audited production release without an explicit final architect sign-off and a
  deterministic API lint completion in the target environment.
