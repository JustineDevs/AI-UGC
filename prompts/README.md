# AI-UGC Prompts

This directory holds the repo-owned semantic prompt layer for AI-UGC.

Rules:
- prompt blocks are structured JSON, not ad hoc prose
- templates assemble blocks from multiple categories
- guard blocks constrain output quality and compliance
- provider blocks adapt prompt payloads to runtime gateways
- scoring blocks define how quality is judged after generation

External prompt libraries live under `collections/` and are not auto-loaded by
the workflow engine unless explicitly adapted into this JSON prompt format.
