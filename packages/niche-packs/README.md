# `@ai-ugc/niche-packs`

Bundled and custom niche-pack entry points for the AI-UGC template platform.

## What Lives Here

- built-in niche-pack definitions under `src/packs/`
- the built-in catalog in `src/catalog/index.ts`
- the custom niche composer re-export in `src/composer/custom-niche.ts`

## Built-In Catalog

Current bundled pack keys:

- `ecommerce-product-ads`
- `local-service-ads`
- `info-product-promos`
- `creator-testimonial-ads`
- `organic-social-proof`

These packs are collected in `builtInNichePacks`, which is the current source for default workspace enablement.

## Pack Contract

Each pack currently follows the declarative shape below:

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

The canonical behavior and naming expectations are documented in:

- `docs/extensions.md`
- `specs/002-ai-ugc-template-platform/data-model.md`

## Adding A New Bundled Pack

1. Create a new module in `src/packs/`.
2. Keep the object shape aligned with the existing pack files.
3. Register it in `src/catalog/index.ts`.
4. Add or update a representative fixture in `tooling/fixtures/niche-packs/`.
5. Update quickstart or docs if setup guidance changes.

## Custom Pack Composition

`createCustomNichePack` currently delegates to `@ai-ugc/workflow-engine` and returns a pack-like object with:

- generated `custom-<slug>` key
- fixed `1.0.0` version
- `custom/intake-schema.json`
- `custom/output-policy.json`

This is a convenience surface for custom workspace setup, not a replacement for bundled pack registration.

## Current Limits

- Built-in registration is currently array-based, not plugin-based.
- Pack-specific schema and output-policy artifacts are still documented by reference rather than enforced by dedicated contract tests.
- Automated fixture-backed registration tests are planned but not present yet.
