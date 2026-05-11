# `@ai-ugc/provider-core`

Shared provider contracts and routing primitives for AI-UGC provider adapters.

## What Lives Here

- capability types and provider keys
- the `ProviderAdapter` interface
- provider validation and execution result shapes
- `ProviderRegistry`
- routing policy helpers
- capability lookup and fallback helpers

## Core Contract

Adapters are expected to expose:

- `providerKey`
- `capabilities`
- `validate()`
- `execute(request)`

Capability entries currently describe:

- `providerKey`
- `capabilityType`
- `modelKey`
- `supportsAsync`
- `supportsWebhook`
- `inputModes`
- `outputModes`
- optional `notes`

## Current Built-In Providers

The platform currently ships with:

- LaoZhang
- APIMart

Their package implementations are the working examples for new adapter authors:

- `packages/provider-laozhang/src/index.ts`
- `packages/provider-apimart/src/index.ts`

## Adding A New Adapter

1. Create a provider package such as `packages/provider-<name>/`.
2. Implement a `ProviderAdapter` with accurate capability metadata.
3. Keep transport-specific logic inside the provider package.
4. Add a documentation fixture under `tooling/fixtures/providers/`.
5. Register the adapter with the shared `ProviderRegistry` at module bootstrap.

## Routing Notes

`ProviderRegistry` and `resolveProviderForCapability()` define the intended
package-level extension path:

- register adapters centrally
- select providers through policy rather than app-specific branching
- keep fallback order explicit

The package seam is now ready for this pattern, and provider validation uses
the shared registry rather than direct adapter selection.

## Current Limits

- The default web UX still foregrounds the two built-in providers.
- Fixture-backed smoke scripts validate registry behavior offline, but do not
  replace a live deployed-environment verification pass.

See `docs/extensions.md` for the broader maintainer workflow and current
extension caveats.
