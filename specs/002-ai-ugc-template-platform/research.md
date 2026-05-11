# Phase 0 Research: AI-UGC Template Platform Transformation

## Decision 1: Use pnpm workspaces with Turborepo for the monorepo

- **Decision**: Migrate the repo to pnpm workspaces at the root and orchestrate workspace tasks with Turborepo.
- **Rationale**: The target project needs multiple apps and shared packages. pnpm has first-class workspace support and a root `pnpm-workspace.yaml`, while Turborepo is designed to orchestrate build/test/lint tasks across workspace packages incrementally. This combination fits the requested clean monorepo structure without forcing a framework rewrite.
- **Alternatives considered**:
  - Keep npm-only root + ad hoc scripts | Rejected because shared-package growth will make cross-package scripts brittle
  - Nx | Rejected because the repo does not need heavier generators/graph conventions for this first transformation

## Decision 2: Preserve React + NestJS, but extract reusable runtime packages

- **Decision**: Keep the current React/Vite frontend and NestJS backend as the deployable app surfaces, then extract shared contracts, provider abstractions, niche packs, and workflow logic into packages.
- **Rationale**: The existing repo already has clean feature modules (`analysis`, `prompt`, `generation`, `product`, `video`) and a single-page React workflow. Preserving those runtime technologies keeps migration risk down while still solving the real problem: cross-cutting logic is currently embedded in app-layer services and components.
- **Alternatives considered**:
  - Rewrite the frontend to Next.js or the backend to a different framework | Rejected because the user asked to keep the same architecture discipline
  - Keep everything in `frontend/` and `backend/` only | Rejected because it cannot support user-driven template reuse cleanly

## Decision 3: Introduce a provider-core abstraction with LaoZhang and APIMart adapters

- **Decision**: Add a shared provider contract package that normalizes text generation, image handling, video creation, status polling, and capability discovery; implement LaoZhang and APIMart as separate adapters.
- **Rationale**: Both LaoZhang and APIMart document OpenAI-compatible base URLs and request patterns, which makes a shared adapter interface practical. The current code is LaoZhang-coupled in `prompt.service.ts`, `generation.service.ts`, config names, and test scripts; that must be extracted if provider switching is supposed to be configuration-only.
- **Alternatives considered**:
  - Hardcode `if provider === ...` branches inside existing services | Rejected because it leaks provider-specific behavior into business workflow logic
  - Support only one gateway and document a manual switch | Rejected because it fails a core user requirement

## Decision 4: Replace in-memory session-only state with durable metadata storage

- **Decision**: Use PostgreSQL for workspace, blueprint, project, session, and provider-job metadata while keeping S3-compatible object storage for large media assets.
- **Rationale**: The current `SessionService` stores all workflow state in memory with a 24-hour TTL, which is acceptable for a POC but not for a reusable template with persistent workspace configuration, niche packs, versioned blueprints, and provider job history. Durable metadata is necessary for user-driven customization and migration-safe session continuity.
- **Alternatives considered**:
  - Keep in-memory sessions only | Rejected because workspace/project customization would disappear on process restart
  - Store everything in S3 JSON blobs | Rejected because relational queries for blueprints, jobs, and compatibility checks would become awkward and fragile

## Decision 5: Model niche packs and workflow blueprints as declarative versioned configuration

- **Decision**: Represent bundled niches and custom workspace behavior as versioned configuration artifacts consumed by a workflow engine rather than hardcoding steps into components and services.
- **Rationale**: The user explicitly wants the template to be specific per niche, not a generic shell. Declarative blueprint + niche-pack configuration allows one runtime to support ecommerce ads, service ads, founder content, testimonial variations, and future content types without cloning code paths.
- **Alternatives considered**:
  - Theme-only customization on top of the current fixed workflow | Rejected because it does not change the required fields, prompts, or output rules
  - One code fork per niche | Rejected because maintainability collapses immediately

## Decision 6: Normalize provider job lifecycle for async generation

- **Decision**: Introduce a `ProviderJob` record with provider name, capability type, external task ID, status history, payload summary, retries, and output references.
- **Rationale**: APIMart explicitly documents async video task management and status tracking, and the current repo already treats video generation as an async lifecycle. Normalizing jobs at the domain layer prevents provider status differences from leaking into the UI/API.
- **Alternatives considered**:
  - Keep generation status only inside session blobs | Rejected because provider-specific retries, fallbacks, and auditability become difficult to manage
  - Expose raw provider responses directly to clients | Rejected because it breaks consistency and portability

## Decision 7: Use an incremental strangler migration instead of a big-bang rewrite

- **Decision**: Migrate `backend/` to `apps/api` and `frontend/` to `apps/web` incrementally while extracting packages in phases.
- **Rationale**: The current repository already works as a vertical slice. The safest path is to preserve working endpoints/components first, then peel off shared config, contracts, provider logic, and workflow definitions behind stable tests.
- **Alternatives considered**:
  - Rebuild the template from scratch in a fresh repo | Rejected because it discards validated behavior and slows delivery
  - Move every file into a new monorepo in one step | Rejected because it creates avoidable integration and verification risk
