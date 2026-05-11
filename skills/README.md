# AI-UGC Skills

This directory defines the repo-owned runtime skill layer for AI-UGC.

Rules:
- every skill has a machine-readable `skill.json`
- every skill defines `input.schema.json` and `output.schema.json`
- `policy.md` defines execution and safety boundaries
- `steps.md` defines ordered behavior
- skills may consume prompt blocks, but prompts and skills remain separate layers
