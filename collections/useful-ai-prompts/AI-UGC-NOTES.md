# AI-UGC Integration Notes

This collection is vendored as an external reference library.

Use these files first:

- `COLLECTION.json` for source metadata and integration boundaries
- `AI-UGC-CURATED.json` for the AI-UGC-relevant subset
- `PROMPT-INDEX.json` for the full upstream machine-readable catalog

Important:

- These prompts remain in the upstream markdown/XML format.
- These skills remain in the upstream Claude skill format.
- They are not auto-loaded by `packages/workflow-engine`.
- Convert or adapt selected prompts before wiring them into the strict
  repo-owned runtime catalog in `prompts/` or `skills/`.
