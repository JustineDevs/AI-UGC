# Extension Surfaces

This document defines the current maintainer-facing extension path for the
AI-UGC monorepo.

The goal is narrow: add or adjust niche packs and provider adapters without
spreading one-off logic across unrelated app code. This guide documents the
supported path and the remaining hardening gaps.

## Current Extension Surfaces

### Niche packs

Primary files:

- `packages/niche-packs/src/packs/*.ts`
- `packages/niche-packs/src/catalog/index.ts`
- `packages/niche-packs/src/composer/custom-niche.ts`

Current runtime behavior:

- Built-in packs are exported as plain objects and collected in `builtInNichePacks`.
- Workspace creation currently defaults to `builtInNichePacks.map((pack) => pack.key)` when no explicit pack list is supplied.
- Custom niche composition is exposed through `createCustomNichePack`, which delegates to `@ai-ugc/workflow-engine`.

Required pack shape today:

- `key`
- `version`
- `label`
- `description`
- `defaultChannelTargets`
- `requiredAssetTypes`
- `intakeSchemaRef`
- `promptModuleRefs`
- `outputPolicyRef`
- `status`

Extension steps:

1. Add a pack module under `packages/niche-packs/src/packs/`.
2. Keep the object shape aligned with the `NichePack` data model in `specs/002-ai-ugc-template-platform/data-model.md`.
3. Register the pack in `packages/niche-packs/src/catalog/index.ts`.
4. Add or update a representative fixture under `tooling/fixtures/niche-packs/`.
5. Update quickstart or package docs when the new pack changes setup expectations.

Invariant:

- Adding a bundled pack should only require package-level registration plus associated docs/fixtures. It should not require per-pack branching in app workflows.

### Provider adapters

Primary files:

- `packages/provider-core/src/provider-interface.ts`
- `packages/provider-core/src/provider-registry.ts`
- `packages/provider-core/src/routing-policy.ts`
- `packages/provider-*/src/index.ts`

Current runtime behavior:

- Provider packages expose `ProviderAdapter` objects with `providerKey`, `capabilities`, `validate()`, and `execute()`.
- The package-level registry and routing primitives exist in `@ai-ugc/provider-core`.
- The API validation module resolves adapters through a shared `ProviderRegistry`,
  and the registry may include built-in adapters plus any extra adapters
  registered at module bootstrap.

Required adapter contract today:

- `providerKey`
- `capabilities`
- `validate(): Promise<ProviderValidationResult>`
- `execute(request): Promise<ProviderExecutionResult>`

Capability entries must include:

- `providerKey`
- `capabilityType`
- `modelKey`
- `supportsAsync`
- `supportsWebhook`
- `inputModes`
- `outputModes`
- optional `notes`

Extension steps:

1. Create a dedicated provider package such as `packages/provider-<name>/`.
2. Implement a `ProviderAdapter` in that package's `src/index.ts`.
3. Define capability entries that match the provider's actual text/image/video behavior.
4. Add a fixture under `tooling/fixtures/providers/` that documents expected capability and validation output.
5. Register the adapter at module bootstrap so the `ProviderRegistry` can
   resolve it for validation and execution.

Invariant:

- Provider-specific HTTP and capability details belong in provider packages, not in workflow or session logic.

### Workspace fixtures

Primary files:

- `tooling/fixtures/workspaces/*.json`
- `tooling/fixtures/niche-packs/*.json`
- `tooling/fixtures/providers/*.json`

Current intent:

- Give maintainers seedable, human-readable examples for workspace bootstrap, niche catalog additions, and provider adapter metadata.
- Keep fixtures aligned with the spec and package contracts even before automated fixture-based tests land.

## Fixture Inventory

- `tooling/fixtures/workspaces/ecommerce-laozhang.workspace-template.json`
- `tooling/fixtures/workspaces/local-services-apimart.workspace-template.json`
- `tooling/fixtures/niche-packs/sample-custom-niche-pack.json`
- `tooling/fixtures/providers/sample-provider-adapter.json`

These fixtures now back smoke and maintainability checks, but they are still
lightweight examples rather than a full seed pipeline.

## Current Limits

The package seams are still ahead of the runtime in a few places:

- The default web UX still emphasizes the two built-in providers, even though
  the runtime registry can now resolve additional adapters.
- Fixture-backed smoke scripts validate contracts and registry behavior offline,
  but they do not replace a live deployed-environment verification pass.

Those gaps are current platform limits. A new third-party provider is
registry-resolvable, but production onboarding still requires explicit
bootstrap registration and live environment validation.

## Maintainer Checklist

- Add or modify package-level registration first.
- Keep docs and fixtures in the same change as the extension surface update.
- Reuse the existing pack/adaptor object patterns before inventing new abstractions.
- Do not add per-niche or per-provider branching in unrelated app modules
  unless an explicit architecture decision calls for it.
- When adding a new provider beyond the built-ins, verify all hardcoded provider unions are removed or intentionally updated.
