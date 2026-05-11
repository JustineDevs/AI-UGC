<!--
SYNC IMPACT REPORT
==================
Version Change: 1.0.0 → 1.1.0
Modified Principles:
- I. Code Quality Standards → I. Codebase Boundary Discipline
- III. User Experience Consistency → II. Contract & Configuration Consistency
- IV. Performance Requirements → V. Operational Readiness & Provenance
Added Principles:
- III. Provider Portability & Workflow Modularity
Added Sections:
- None
Removed Sections:
- None

Templates Requiring Updates:
✅ updated - .specify/templates/plan-template.md
✅ created - .specify/templates/spec-template.md
✅ updated - .specify/templates/tasks-template.md
✅ verified compatible - .specify/templates/checklist-template.md
⚠ pending - .specify/templates/commands/*.md (directory not present in this repo)

Follow-up TODOs:
- None
-->

# AI-UGC Constitution

## Core Principles

### I. Codebase Boundary Discipline

All repository changes MUST preserve a clean, type-safe, monorepo-ready structure:

- **Linting & Formatting**: All code MUST pass ESLint with zero warnings and MUST be formatted by the repo-standard Prettier configuration before merge.
- **Type Safety**: Shared domain types, API payloads, and configuration contracts MUST live in shared packages or shared modules; duplicate cross-app type definitions are prohibited.
- **Boundary Integrity**: App-layer code MUST depend on shared contracts and services through explicit interfaces. Provider-specific logic MUST NOT leak into general workflow, session, or UI modules.
- **Module Scope**: Files and functions MUST have a single clear responsibility. Cross-cutting utilities MUST be extracted rather than re-implemented in multiple apps.
- **Documentation**: Public modules, exported utilities, and migration seams MUST include concise documentation explaining purpose, dependencies, and invariants.
- **Dependency Changes**: New dependencies MUST include explicit justification tied to delivery, maintainability, or verification value.

**Rationale**: AI-UGC is being transformed into a multi-package platform. Weak boundaries or duplicated contracts will create drift between apps, providers, and niche modules quickly.

### II. Contract & Configuration Consistency

All user-facing and system-facing contracts MUST remain explicit, shared, and stable:

- **API Envelope**: All HTTP responses MUST use a consistent success/error/meta envelope unless a documented exception is approved.
- **Validation Rules**: Input validation MUST be defined once and reused across API, UI, CLI, and background workflows where applicable.
- **Configuration Source of Truth**: Provider, storage, and environment configuration MUST be centralized and typed. Secret handling MUST use dedicated configuration paths, not ad hoc environment access inside business logic.
- **Schema Reuse**: Workspace setup, niche packs, workflow blueprints, and session payloads MUST use shared schema definitions to prevent frontend/backend drift.
- **Migration Clarity**: Any change to contracts, configuration keys, or storage shape MUST include migration notes and backward-compatibility expectations.
- **Terminology**: Canonical terms such as Workspace Template, Niche Pack, Workflow Blueprint, Provider Profile, Generation Session, and Provider Job MUST be used consistently across docs and code.

**Rationale**: The platform’s main value depends on reusable template configuration. Contract drift or inconsistent configuration semantics will make customization fragile and provider switching unsafe.

### III. Provider Portability & Workflow Modularity

Business workflows MUST remain portable across providers and configurable across niches:

- **Provider Abstraction**: Text, image, video, moderation, and status operations MUST be expressed through provider interfaces or adapters, not hardcoded directly inside session or UI flows.
- **Capability Awareness**: Supported operations, model mappings, async behavior, and fallback rules MUST be declared through a capability matrix or equivalent explicit metadata.
- **Configuration-Only Switching**: Changing the default provider between supported gateways MUST require configuration changes only; workflow business logic rewrites are prohibited.
- **Declarative Workflow Design**: Niche packs and workflow blueprints MUST be expressed as versioned configuration artifacts or structured modules rather than branch-per-niche code forks.
- **Extension Safety**: New niche packs and provider adapters MUST be addable through documented registration surfaces with minimal unrelated code edits.
- **Fallback Transparency**: When fallback routing exists, the rules for reroute, incompatibility, and provenance MUST be documented and observable.

**Rationale**: AI-UGC must support LaoZhang and APIMart while staying usable for multiple AI-UGC niches. Tight coupling to one provider or one campaign shape defeats the platform goal.

### IV. Test-First Verification (NON-NEGOTIABLE)

All feature work MUST be verified through tests written before or alongside implementation in a way that proves requirements, migrations, and integrations:

- **TDD Requirement**: New behavior MUST begin with failing tests or failing contract checks before implementation is considered complete.
- **Coverage Shape**: Business logic MUST have unit coverage, public contracts MUST have contract tests, and end-to-end story flows MUST have integration or smoke coverage where they cross process or provider boundaries.
- **Regression Locking**: Migration or extraction work MUST add regression tests before moving or rewriting existing behavior.
- **Mocking Strategy**: External providers, object storage, and databases MUST be mocked or isolated in unit tests. Production credentials and production services MUST NOT be required for deterministic CI.
- **Parallel Safety**: Tests MUST be independent, deterministic, and structured to support parallel execution in a monorepo.
- **Completion Evidence**: Claims of completion MUST cite actual verification artifacts such as lint, typecheck, unit tests, contract tests, integration tests, or smoke scripts.

**Rationale**: This transformation involves extraction, migration, and provider abstraction. Without aggressive regression locking, breakage will hide inside refactors until late.

### V. Operational Readiness & Provenance

The platform MUST remain debuggable, secure, and measurable from local development through release:

- **Observability**: Provider routing, async job state transitions, and cross-service failures MUST emit logs and structured identifiers suitable for debugging.
- **Provenance**: Generated outputs, source assets, prompts, provider jobs, and fallback decisions MUST remain traceable to their originating session and provider profile.
- **Secret Protection**: API keys, storage credentials, and sensitive configuration MUST be isolated from presentation code and MUST NOT be logged or embedded in client bundles.
- **Performance Targets**: Non-provider API requests, workspace setup flows, and provider validation flows MUST define explicit latency or throughput expectations during planning.
- **Idempotency & Recovery**: State-changing operations, retries, and provider callbacks MUST define safe retry or reconciliation behavior.
- **Operator Readiness**: Quickstart and setup documentation MUST remain runnable for a new operator without hidden environment assumptions.

**Rationale**: AI-UGC depends on long-running provider jobs and reusable project configuration. Without provenance, observability, and recovery discipline, failures become expensive to diagnose and unsafe to retry.

## Quality Gates

All features MUST pass these gates before merging:

### Pre-Implementation

- [ ] Constitution compliance verified against all five principles
- [ ] User stories independently testable and prioritized
- [ ] Shared contracts, persistence impacts, and provider impacts identified
- [ ] Migration boundary documented when changing existing runtime structure

### Implementation

- [ ] Failing tests or contract checks added before feature completion
- [ ] No provider-specific logic leaked into app-layer business workflows
- [ ] Shared schemas/contracts updated alongside all consuming surfaces
- [ ] Code passes linting, formatting, and type validation

### Pre-Merge

- [ ] Unit, contract, integration, and smoke checks pass for affected surfaces
- [ ] Provider validation and fallback behavior verified when provider code changes
- [ ] Observability, provenance, and secret-handling implications reviewed
- [ ] Quickstart, migration notes, and extension docs updated when applicable
- [ ] No unhandled warnings, debug logging, or undocumented breaking changes remain

## Development Workflow

### Feature Development Process

1. **Specification**: Create or update a feature spec following `spec-template.md` with prioritized user stories, measurable outcomes, and explicit edge cases.
2. **Clarification**: Resolve high-impact ambiguity before implementation whenever possible.
3. **Planning**: Generate an implementation plan using `plan-template.md`, including a Constitution Check aligned with all five principles.
4. **Task Breakdown**: Generate `tasks.md` organized by user story, with contract, provider, migration, and verification work represented explicitly where required.
5. **Test-First Implementation**: For each task or story slice:
   - add failing tests or failing contract checks
   - implement the minimum code to pass
   - refactor while keeping tests green
   - document migration or operator impacts when relevant
6. **Validation**: Run the relevant lint, typecheck, tests, and smoke checks before requesting review.
7. **Review & Merge**: Address feedback, preserve contract stability, and update documentation before merge.

### Branching Strategy

- **Main branch**: MUST remain releasable and verification-clean
- **Feature branches**: SHOULD use `###-feature-name` format where spec-kit workflows apply
- **Migration branches**: MUST document compatibility and rollback implications when changing repo structure

### Commit Standards

- Commit messages SHOULD describe intent, not just file changes
- Commits that change contracts, providers, or migrations MUST mention that scope explicitly
- Verification performed and known gaps SHOULD be recorded when commits are prepared for review

## Governance

### Constitution Authority

This constitution supersedes conflicting local practices and guidance inside the repository scope unless a higher-priority instruction from the system, developer, or user overrides it explicitly.

### Amendment Process

Constitution amendments require:

1. **Proposal**: Document the change, rationale, and scope of impact
2. **Review**: Evaluate effects on templates, workflows, and active feature artifacts
3. **Version Update**: Apply semantic versioning to the constitution itself
   - **MAJOR**: Principle removal, principle redefinition, or governance changes that invalidate prior expectations
   - **MINOR**: New principle or materially expanded required guidance
   - **PATCH**: Clarifications, wording improvements, or non-semantic sync updates
4. **Propagation**: Update dependent templates and guidance documents in the same change when possible
5. **Communication**: Record the sync impact report at the top of this file

### Compliance Review

- **Per-Feature**: Every `plan.md` MUST include a Constitution Check mapped to the current principles
- **Per-Tasks Run**: Generated task sets MUST reflect principle-driven work such as contracts, provider boundaries, observability, migrations, and testing where applicable
- **Per-PR**: Reviewers MUST validate constitution compliance and note any justified exceptions
- **Violations**: Exceptions MUST be documented explicitly in planning or review artifacts with rationale and mitigation

### Enforcement

- Automated enforcement SHOULD cover linting, formatting, type validation, and repeatable tests
- Manual enforcement MUST cover architecture boundaries, provider abstraction discipline, and documentation quality
- Persistent violations require either a constitution amendment or a corrective refactor plan

**Version**: 1.1.0 | **Ratified**: 2025-11-24 | **Last Amended**: 2026-05-11
