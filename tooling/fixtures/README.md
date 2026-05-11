# Fixture Catalog

This directory contains human-readable example fixtures for the AI-UGC platform.

Current scope:

- `workspaces/` holds sample workspace bootstrap payloads
- `niche-packs/` holds declarative niche-pack examples
- `providers/` holds provider adapter capability and validation examples

These files are not wired into an automated seeding command. They exist so
maintainers can:

- validate documentation examples against a concrete payload
- exercise extension and smoke-test flows against repo-native payloads
- keep niche-pack and provider-extension discussions grounded in repo-native
  shapes

These fixtures are the canonical source material for extension examples and
smoke coverage.
