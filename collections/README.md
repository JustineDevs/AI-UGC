# Prompt Collections

This directory contains external prompt and skill libraries added to AI-UGC.

Rules:
- collections stay namespaced under `collections/` and do not replace the
  repo-owned runtime contract in `prompts/` or `skills/`
- vendored collections may use their own formats, conventions, and folder
  structures
- active runtime loading still comes from `prompts/`, `skills/`, and
  `packages/workflow-engine`
- use collection manifests and curated indexes to bridge useful external
  content back into AI-UGC workflows intentionally
