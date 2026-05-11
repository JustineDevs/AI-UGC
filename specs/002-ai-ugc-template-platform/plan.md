# Implementation Plan: AI-UGC Template Platform Transformation

**Branch**: `002-ai-ugc-template-platform` | **Date**: 2026-05-11 | **Spec**: [`specs/002-ai-ugc-template-platform/spec.md`](./spec.md)
**Input**: Feature specification from `/specs/002-ai-ugc-template-platform/spec.md`

## Summary

This feature transforms the current single-purpose application into a reusable AI-UGC template platform. The target state keeps the existing React + NestJS workflow discipline but migrates the repository into a clean monorepo with separate deployable apps and shared packages for provider adapters, workflow blueprints, niche packs, contracts, and configuration. LaoZhang and APIMart become first-class provider adapters behind one OpenAI-compatible abstraction layer, allowing users to configure either gateway without rewriting workflow logic. The resulting platform supports niche-specific workspace setup, project-level brand rules, versioned workflow blueprints, persistent generation sessions, and documented extension points for future providers and content niches.

## Technical Context

**Language/Version**: Node.js 20+, TypeScript 5.x  
**Primary Dependencies**: Existing NestJS backend, React 18 + Vite frontend, AWS SDK, Google Gemini SDK, OpenAI-compatible HTTP client layer, pnpm workspaces, Turborepo  
**Storage**: PostgreSQL for project/session/config metadata, S3-compatible object storage for source/generated assets  
**Testing**: Jest for backend/domain tests, React Testing Library/Vitest for frontend unit tests, Supertest for API integration tests, contract validation against OpenAPI  
**Target Platform**: Browser-based workspace application plus HTTP API  
**Project Type**: TypeScript monorepo with `apps/*` and `packages/*`  
**Performance Goals**: Provider selection/config validation under 3 seconds, session/project reads under 250ms p95, non-provider API responses under 500ms p95, async provider status polling every 3-5 seconds, local bootstrap to first successful run in under 30 minutes  
**Constraints**: Preserve current analysis → prompt → generation workflow value, keep consistent API envelope, support LaoZhang and APIMart through OpenAI-compatible interfaces, avoid provider-specific business logic leaking into app layers, maintain repo clarity during incremental migration from `frontend/` and `backend/`  
**Scale/Scope**: 2 primary apps, 6-8 shared packages, 5 bundled niche packs, 2 built-in providers, migration of the existing single-workflow application into a configurable template runtime

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Codebase Boundary Discipline
- [x] Linting and formatting plan defined: root workspace commands will orchestrate package lint/format tasks
- [x] Shared contracts/types are centralized: TypeScript contracts are extracted into shared workspace packages
- [x] Module and package boundaries are explicit: providers, workflows, niche packs, and contracts are isolated packages
- [x] Provider-specific logic is isolated from app-layer workflow code: adapter behavior moves out of general session and UI logic
- [x] Documentation and dependency changes are justified: quickstart, migration notes, extension guides, and package READMEs are planned

### II. Contract & Configuration Consistency
- [x] API envelope and error semantics are defined through shared API contract utilities
- [x] Validation rules and schemas are shared via declarative niche/workflow schemas
- [x] Configuration and secrets strategy is centralized in shared config packages
- [x] Migration and terminology impacts are documented for the monorepo transition

### III. Provider Portability & Workflow Modularity
- [x] Provider abstraction/interface design is explicit through provider-core plus LaoZhang/APIMart adapters
- [x] Capability matrix and compatibility rules are documented in the plan and data model
- [x] Provider switching remains configuration-driven rather than business-logic-driven
- [x] Niche packs and workflow blueprints are modular and version-aware

### IV. Test-First Verification (NON-NEGOTIABLE)
- [x] Test-first implementation path defined: migration tasks will begin by locking current behavior and new shared contracts with failing tests
- [x] Coverage strategy spans unit, contract, and integration/smoke checks
- [x] External services are mocked or isolated appropriately
- [x] Migration/regression locking strategy is defined

### V. Operational Readiness & Provenance
- [x] Observability and provenance requirements are addressed through provider-job modeling and audit-friendly routing traces
- [x] Secret handling and workspace isolation concerns are addressed in centralized provider configuration
- [x] Performance targets are explicit
- [x] Idempotency, retry, and recovery behavior are addressed through capability-aware routing and async job handling

**GATE STATUS**: PASS

## Project Structure

### Documentation (this feature)

```text
specs/002-ai-ugc-template-platform/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
apps/
├── api/                    # NestJS API migrated from backend/
└── web/                    # React/Vite app migrated from frontend/

packages/
├── contracts/              # Shared API/domain contracts
├── config/                 # Environment parsing and typed config
├── domain/                 # Core entities, services, and error types
├── provider-core/          # Provider interfaces, routing, capability matrix
├── provider-laozhang/      # LaoZhang adapter implementation
├── provider-apimart/       # APIMart adapter implementation
├── workflow-engine/        # Blueprint execution and prompt assembly
├── niche-packs/            # Built-in niche definitions and registry
└── ui/                     # Shared UI primitives and workflow form pieces

tooling/
├── scripts/                # Migration and bootstrap scripts
└── fixtures/               # Provider mocks and seed workspace configs
```

**Structure Decision**: A two-app monorepo preserves the existing frontend/backend separation while extracting cross-cutting concerns that are currently coupled to application code. Provider-specific logic moves out of services like `prompt.service.ts` and `generation.service.ts`; workflow customization moves out of hardcoded UI steps; domain contracts become shared packages instead of duplicated TypeScript types. This keeps the same architecture discipline but makes the project a reusable template rather than a bespoke demo.

## Complexity Tracking

No constitution violations identified.

## Post-Phase 1 Constitution Re-Check

*Re-evaluation after Phase 1 design complete*

### Design Review Against Constitution

✅ **I. Codebase Boundary Discipline**  
The target monorepo isolates provider and workflow concerns into bounded packages with typed contracts and clear package responsibilities.

✅ **II. Contract & Configuration Consistency**  
The design preserves one response/error envelope, shared schemas, and centralized configuration semantics across apps and providers.

✅ **III. Provider Portability & Workflow Modularity**  
The design keeps business workflows provider-agnostic and makes niche/workflow customization declarative and version-aware.

✅ **IV. Test-First Verification**  
The design supports contract-first migration, provider mocks, and regression coverage around current workflow behavior before extraction.

✅ **V. Operational Readiness & Provenance**  
The design uses capability-aware routing, persisted job metadata, provenance tracking, and async status handling instead of opaque provider coupling.

### Final Gate Status

**GATE STATUS**: PASS
