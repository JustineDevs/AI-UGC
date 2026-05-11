# Tasks: AI-UGC Template Platform Transformation

**Input**: Design documents from `/specs/002-ai-ugc-template-platform/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/openapi.yaml`, `quickstart.md`

## Phase 1: Setup

Purpose: establish the monorepo shell, shared tooling, and migration-ready package boundaries required by every story.

- [X] T001 Convert the root workspace to monorepo orchestration in `package.json`, `pnpm-workspace.yaml`, and `turbo.json`
- [X] T002 Create shared workspace configuration in `tsconfig.base.json`, `.eslintrc.cjs`, `.prettierrc`, and `.gitignore`
- [X] T003 [P] Create the API app shell by moving backend package metadata into `apps/api/package.json` and `apps/api/tsconfig.json`
- [X] T004 [P] Create the web app shell by moving frontend package metadata into `apps/web/package.json`, `apps/web/tsconfig.json`, and `apps/web/vite.config.ts`
- [X] T005 [P] Scaffold shared package manifests for `packages/contracts/package.json`, `packages/config/package.json`, `packages/domain/package.json`, `packages/provider-core/package.json`, `packages/provider-laozhang/package.json`, `packages/provider-apimart/package.json`, `packages/workflow-engine/package.json`, `packages/niche-packs/package.json`, and `packages/ui/package.json`
- [X] T006 Create local development infrastructure scaffolding in `.env.example`, `docker-compose.yml`, and `README-SETUP.md`

## Phase 2: Foundational

Purpose: implement the shared contracts, domain model, persistence seams, and provider abstractions that block all user stories.

- [X] T007 [P] Create shared API envelope and error contracts in `packages/contracts/src/api.ts`, `packages/contracts/src/errors.ts`, and `packages/contracts/src/index.ts`
- [X] T008 [P] Create core domain entities from the data model in `packages/domain/src/entities/WorkspaceTemplate.ts`, `ProviderProfile.ts`, `WorkflowBlueprint.ts`, `ProjectProfile.ts`, `GenerationSession.ts`, `ProviderJob.ts`, `SourceAsset.ts`, and `OutputAsset.ts`
- [X] T009 [P] Create shared environment/config parsing in `packages/config/src/index.ts`, `packages/config/src/providers.ts`, and `packages/config/src/storage.ts`
- [X] T010 [P] Create provider-core contracts in `packages/provider-core/src/capabilities.ts`, `packages/provider-core/src/provider-interface.ts`, `packages/provider-core/src/routing-policy.ts`, and `packages/provider-core/src/errors.ts`
- [X] T011 [P] Create domain repository ports and service interfaces in `packages/domain/src/repositories/index.ts` and `packages/domain/src/services/index.ts`
- [X] T012 Implement PostgreSQL persistence scaffolding and migrations in `apps/api/src/infrastructure/persistence/`, `apps/api/src/infrastructure/database/`, and `apps/api/migrations/`
- [X] T013 Implement shared API bootstrap using workspace packages in `apps/api/src/app.module.ts`, `apps/api/src/main.ts`, `apps/api/src/common/interceptors/response.interceptor.ts`, and `apps/api/src/common/filters/http-exception.filter.ts`
- [X] T014 Implement shared web bootstrap and typed API client wiring in `apps/web/src/main.tsx`, `apps/web/src/App.tsx`, `apps/web/src/services/api.ts`, and `apps/web/src/types/index.ts`

## Phase 3: User Story 1 - Workspace Setup for a Specific AI-UGC Niche

Goal: let an operator clone the template, create a workspace, choose a bundled or custom niche, and persist brand/channel rules without code edits.

Independent Test: create a workspace, choose one bundled niche and one custom niche composition, save brand/channel settings, and verify the UI/API return niche-specific schema and reusable project configuration.

- [X] T015 [P] [US1] Write API contract tests for workspace and project creation in `apps/api/test/contract/workspaces.contract.spec.ts` and `apps/api/test/contract/projects.contract.spec.ts`
- [X] T016 [P] [US1] Write web integration tests for workspace initialization in `apps/web/src/features/workspace/__tests__/workspace-setup.spec.tsx`
- [X] T017 [P] [US1] Implement the bundled niche pack catalog in `packages/niche-packs/src/catalog/index.ts`, `packages/niche-packs/src/packs/ecommerce.ts`, `local-services.ts`, `info-products.ts`, `creator-testimonials.ts`, and `organic-social-proof.ts`
- [X] T018 [P] [US1] Implement custom niche composition and validation in `packages/niche-packs/src/composer/custom-niche.ts` and `packages/workflow-engine/src/workspace-init/compose-niche.ts`
- [X] T019 [US1] Implement workspace and project persistence services in `apps/api/src/modules/workspaces/workspaces.service.ts`, `apps/api/src/modules/projects/projects.service.ts`, and matching repository adapters under `apps/api/src/infrastructure/persistence/`
- [X] T020 [US1] Implement workspace and project HTTP endpoints in `apps/api/src/modules/workspaces/workspaces.controller.ts`, `apps/api/src/modules/projects/projects.controller.ts`, and DTOs in `apps/api/src/modules/workspaces/dto/` and `apps/api/src/modules/projects/dto/`
- [X] T021 [P] [US1] Implement the workspace setup UI in `apps/web/src/features/workspace/WorkspaceSetupPage.tsx`, `NichePackSelector.tsx`, `CustomNicheBuilder.tsx`, and `ProjectProfileForm.tsx`
- [X] T022 [US1] Seed example workspace fixtures and quickstart examples in `tooling/fixtures/workspaces/`, `tooling/fixtures/niche-packs/`, and `specs/002-ai-ugc-template-platform/quickstart.md`

## Phase 4: User Story 2 - Provider Configuration With LaoZhang or APIMart

Goal: let a technical operator configure LaoZhang or APIMart, validate credentials, switch defaults, and define fallback/compatibility behavior without changing workflow logic.

Independent Test: configure LaoZhang, validate it, switch to APIMart, validate it, enable fallback, and verify the routing layer changes provider behavior without business-code edits.

- [X] T023 [P] [US2] Write provider contract tests for validation, profile registration, and fallback errors in `apps/api/test/contract/providers.contract.spec.ts`
- [X] T024 [P] [US2] Write provider-core unit tests for routing and capability resolution in `packages/provider-core/src/__tests__/routing-policy.spec.ts` and `capabilities.spec.ts`
- [X] T025 [US2] Implement the LaoZhang adapter in `packages/provider-laozhang/src/index.ts`, `packages/provider-laozhang/src/chat.ts`, and `packages/provider-laozhang/src/video.ts`
- [X] T026 [P] [US2] Implement the APIMart adapter in `packages/provider-apimart/src/index.ts`, `packages/provider-apimart/src/chat.ts`, and `packages/provider-apimart/src/video.ts`
- [X] T027 [US2] Implement provider registry, capability matrix, and fallback policy in `packages/provider-core/src/provider-registry.ts`, `packages/provider-core/src/capability-matrix.ts`, and `packages/provider-core/src/fallback.ts`
- [X] T028 [US2] Implement provider profile persistence and validation services in `apps/api/src/modules/providers/providers.service.ts`, `apps/api/src/modules/providers/provider-validation.service.ts`, and repository adapters under `apps/api/src/infrastructure/persistence/`
- [X] T029 [US2] Implement provider HTTP endpoints in `apps/api/src/modules/providers/providers.controller.ts`, `apps/api/src/modules/providers/dto/`, and `apps/api/src/modules/providers/provider-error.mapper.ts`
- [X] T030 [P] [US2] Implement the provider settings UI and validation flow in `apps/web/src/features/providers/ProviderSettingsPage.tsx`, `ProviderProfileForm.tsx`, and `ProviderValidationPanel.tsx`
- [X] T031 [US2] Implement provider health-check CLI commands and scripts in `apps/api/package.json` and `tooling/scripts/provider-validate.ts`

## Phase 5: User Story 3 - User-Driven AI-UGC Workflow Customization

Goal: let a strategist define versioned workflow blueprints, session inputs, prompt composition, and runtime behavior without rewriting core modules.

Independent Test: create two blueprint variants with different intake schema and prompt blocks, launch sessions from each, and verify runtime behavior and validation follow the selected blueprint version.

- [X] T032 [P] [US3] Write blueprint and session contract tests in `apps/api/test/contract/blueprints.contract.spec.ts` and `apps/api/test/contract/sessions.contract.spec.ts`
- [X] T033 [P] [US3] Write workflow-engine unit tests for blueprint versioning and execution in `packages/workflow-engine/src/__tests__/blueprint-versioning.spec.ts` and `execution.spec.ts`
- [X] T034 [P] [US3] Write web integration tests for blueprint editing and session launch in `apps/web/src/features/blueprints/__tests__/blueprint-editor.spec.tsx` and `apps/web/src/features/sessions/__tests__/session-launch.spec.tsx`
- [X] T035 [US3] Implement blueprint domain services and persistence in `apps/api/src/modules/blueprints/blueprints.service.ts`, `apps/api/src/modules/blueprints/blueprints.controller.ts`, and repository adapters under `apps/api/src/infrastructure/persistence/`
- [X] T036 [P] [US3] Implement workflow engine composition logic in `packages/workflow-engine/src/blueprints/`, `packages/workflow-engine/src/prompt-assembly/`, `packages/workflow-engine/src/moderation/`, and `packages/workflow-engine/src/output-policy/`
- [X] T037 [US3] Implement session, source asset, and provider job modules in `apps/api/src/modules/sessions/`, `apps/api/src/modules/assets/`, and `apps/api/src/modules/provider-jobs/`
- [X] T038 [US3] Integrate session execution orchestration with provider-core in `apps/api/src/modules/sessions/session-run.service.ts` and `apps/api/src/modules/sessions/session-status.service.ts`
- [X] T039 [P] [US3] Implement the blueprint editor and session launcher UI in `apps/web/src/features/blueprints/BlueprintEditorPage.tsx`, `apps/web/src/features/sessions/SessionStartPage.tsx`, and related form components

## Phase 6: User Story 4 - Monorepo Maintainability and Extension

Goal: let a maintainer add new niche packs and provider adapters through documented extension surfaces without changing unrelated app logic.

Independent Test: add a sample niche pack and a sample provider adapter using the documented extension path and verify registration works without touching session or blueprint models.

- [X] T040 [P] [US4] Write extension-surface contract tests in `apps/api/test/contract/extensions.contract.spec.ts` and `packages/provider-core/src/__tests__/registration.spec.ts`
- [X] T041 [P] [US4] Write fixture-based maintainability tests in `tooling/fixtures/__tests__/niche-pack-registration.spec.ts` and `provider-adapter-registration.spec.ts`
- [X] T042 [US4] Document extension conventions and invariants in `docs/extensions.md`, `packages/niche-packs/README.md`, and `packages/provider-core/README.md`
- [X] T043 [P] [US4] Implement a sample stub niche pack in `packages/niche-packs/src/packs/_sample-pack.ts` and a sample stub provider in `packages/provider-core/src/stubs/sample-provider.ts`
- [X] T044 [US4] Complete older-layout-to-monorepo migration of runtime entry points in `apps/api/src/`, `apps/web/src/`, and compatibility notes in `README.md`

## Final Phase: Polish & Cross-Cutting Concerns

Purpose: harden the platform across observability, documentation, verification, and release-ready workflow commands.

- [X] T045 [P] Implement observability and provenance logging in `apps/api/src/common/observability/`, `packages/provider-core/src/telemetry.ts`, and `apps/api/src/modules/provider-jobs/provider-job-audit.service.ts`
- [X] T046 [P] Implement secret-handling and workspace isolation safeguards in `packages/config/src/secrets.ts`, `apps/api/src/modules/providers/provider-secret.service.ts`, and `apps/api/src/common/guards/`
- [X] T047 [P] Add end-to-end smoke verification scripts in `tooling/scripts/smoke-workspace.ts`, `tooling/scripts/smoke-provider-switch.ts`, and `tooling/scripts/smoke-blueprint-run.ts`
- [X] T048 Run and fix workspace-wide validation commands in `package.json`, `turbo.json`, `apps/api/package.json`, and `apps/web/package.json`
- [X] T049 Finalize user and developer docs in `README.md`, `README-SETUP.md`, and `specs/002-ai-ugc-template-platform/quickstart.md`

## Dependencies & Order

- Phase 1 must complete before Phase 2.
- Phase 2 must complete before any user story implementation.
- User Story order for MVP progression: `US1` → `US2` → `US3` → `US4`.
- `US2` depends on the shared contracts, config, and provider-core foundations from Phase 2.
- `US3` depends on `US1` project/workspace persistence and `US2` provider routing.
- `US4` depends on the package boundaries created in Phases 1-2 and the registration patterns implemented in `US2` and `US3`.
- Final polish tasks run after the targeted user stories are complete.

## Parallel Execution Examples

### User Story 1

- T015 and T016 can run in parallel.
- T017 and T018 can run in parallel after Phase 2.
- T021 can run in parallel with T019-T020 once the contracts are stable.

### User Story 2

- T023 and T024 can run in parallel.
- T025 and T026 can run in parallel after T024 defines the shared adapter expectations.
- T030 can run in parallel with T028-T029 after endpoint shapes are fixed.

### User Story 3

- T032, T033, and T034 can run in parallel.
- T036 and T039 can run in parallel after T035 locks blueprint persistence contracts.

### User Story 4

- T040 and T041 can run in parallel.
- T042 and T043 can run in parallel after extension contracts are fixed.

## Implementation Strategy

### MVP First

- Deliver `US1` first to prove the project is now a reusable AI-UGC template rather than a single-purpose application.
- Deliver `US2` next so provider portability is real and not just documented.
- Treat `US3` as the first full user-driven customization milestone.
- Finish with `US4` to formalize extension safety and long-term maintainability.

### Incremental Delivery

- Preserve current behavior while moving code incrementally from `backend/` and `frontend/` into `apps/api` and `apps/web`.
- Extract contracts, config, provider-core, and domain packages before large feature rewrites.
- Keep each story independently testable so the repo can stop after any completed story and still provide coherent value.
