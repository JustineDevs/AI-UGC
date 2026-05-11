# Fixture Scaffolding

This directory contains human-readable example fixtures for the AI-UGC monorepo migration.

Current scope:

- `workspaces/` holds sample workspace bootstrap payloads
- `niche-packs/` holds declarative niche-pack examples
- `providers/` holds provider adapter capability and validation examples

These files are not wired into an automated seeding command yet. They exist so maintainers can:

- validate documentation examples against a concrete payload
- prepare future fixture-based tests
- keep niche-pack and provider-extension discussions grounded in repo-native shapes

When the runtime and tests are expanded, these fixtures should become the source material for contract and registration smoke coverage rather than being replaced by ad hoc examples.
