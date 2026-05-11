# Feature Specification: AI-UGC Template Platform Transformation

**Feature Branch**: `002-ai-ugc-template-platform`  
**Created**: 2026-05-11  
**Status**: Draft  
**Input**: User description: "Transform the current UGC application into an AI-UGC template that is user-driven, niche-specific, compatible with LaoZhang and APIMart, and organized as a clean monorepo."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Workspace Setup for a Specific AI-UGC Niche (Priority: P1) 🎯 MVP

An operator clones the template, selects a concrete niche/campaign profile (for example skincare ads, local service ads, ecommerce testimonials, app promos, or creator-style organic posts), configures brand rules and desired output channels, and gets a working workspace with relevant fields, defaults, and generated assets tailored to that niche rather than a generic demo.

**Why this priority**: The product only becomes a reusable AI-UGC template when users can shape it to a concrete niche and campaign style immediately after cloning. Without this, the project remains a single-purpose application.

**Independent Test**: Initialize a new workspace from the template, choose a niche profile, set campaign metadata, and verify the UI/API present the expected niche-specific schema, copy guidance, and output rules without requiring code changes.

**Acceptance Scenarios**:

1. **Given** a fresh clone of the template, **When** the operator selects a niche profile during setup, **Then** the system provisions niche-specific defaults for intake fields, prompt modules, asset requirements, and output checks
2. **Given** a niche profile is selected, **When** the operator changes platform targets such as TikTok, Meta ads, YouTube Shorts, or landing-page explainer, **Then** the workflow updates duration, aspect ratio, CTA, and copy constraints accordingly
3. **Given** the operator defines brand voice, forbidden claims, audience, and offer details, **When** setup completes, **Then** those rules persist as reusable project configuration for future generations
4. **Given** the operator does not want a bundled niche pack, **When** they create a custom profile, **Then** the system supports custom schema composition from template modules without editing source code

---

### User Story 2 - Provider Configuration With LaoZhang or APIMart (Priority: P1)

A technical operator configures the platform to run against either LaoZhang or APIMart as the default OpenAI-compatible gateway, verifies credentials, and optionally enables fallback routing between them while preserving the same prompt, image, and video generation workflows.

**Why this priority**: Provider portability is a hard requirement from the user request. The transformation is incomplete if the platform remains coupled to LaoZhang-only assumptions.

**Independent Test**: Switch the configured provider from LaoZhang to APIMart, run provider validation, and verify that text and video job requests are emitted through a common adapter interface with identical downstream workflow behavior.

**Acceptance Scenarios**:

1. **Given** the platform has no provider configured, **When** the operator selects LaoZhang, enters credentials, and runs validation, **Then** the system saves the provider profile and confirms connectivity against the LaoZhang-compatible endpoint
2. **Given** LaoZhang is configured, **When** the operator switches the default provider to APIMart, **Then** the system updates only provider configuration and adapter resolution, not business workflow code
3. **Given** both providers are configured, **When** the operator enables provider fallback, **Then** the system defines an ordered routing policy for supported text, image, and video operations with clear unsupported-operation handling
4. **Given** a provider does not support a requested model or capability, **When** generation is attempted, **Then** the system returns an actionable compatibility error or reroutes according to policy

---

### User Story 3 - User-Driven AI-UGC Workflow Customization (Priority: P2)

A strategist customizes how the platform analyzes source content, collects product/campaign data, assembles prompts, applies moderation, and generates final assets for a specific business model or content format without rewriting core modules.

**Why this priority**: The template needs to support "anyone customizing based on their own desire" while staying specific. This requires modular workflow composition, not just theme changes.

**Independent Test**: Create two different workflow blueprints, such as a direct-response ad flow and a founder-story organic content flow, and verify that each can use distinct intake schema, prompt blocks, moderation rules, and generation settings while using the same platform runtime.

**Acceptance Scenarios**:

1. **Given** a workspace admin is editing a workflow blueprint, **When** they reorder or disable modules such as source analysis, hook generation, offer framing, or CTA packaging, **Then** the runtime honors the customized sequence for that project
2. **Given** a workflow blueprint defines required inputs for a niche, **When** a creator starts a new session, **Then** the UI and API enforce only that blueprint’s required fields and validations
3. **Given** a blueprint contains reusable prompt blocks and guardrails, **When** generation runs, **Then** the system composes provider-ready prompts from those blocks plus project/session data
4. **Given** a blueprint is updated, **When** new sessions start, **Then** the new version is applied without mutating completed session history

---

### User Story 4 - Monorepo Maintainability and Extension (Priority: P3)

A maintainer extends the transformed codebase by adding a new niche pack, a new provider adapter, or a new generation surface while preserving the repo’s architecture discipline, shared contracts, and clear package boundaries.

**Why this priority**: The user asked for a clean monorepo with the same architecture discipline. The structure must stay maintainable as the template expands.

**Independent Test**: Add a new niche pack and a stub provider adapter through documented extension points and verify no changes are needed in unrelated app layers beyond registration.

**Acceptance Scenarios**:

1. **Given** a maintainer adds a new niche package, **When** they register it in the template catalog, **Then** the frontend and backend discover it through shared contracts rather than hardcoded per-app logic
2. **Given** a maintainer adds a new provider adapter, **When** they implement the provider contract and register capabilities, **Then** the orchestration layer can resolve it without changing session or blueprint models
3. **Given** the monorepo contains shared packages for contracts, provider abstractions, and workflow schemas, **When** one package changes, **Then** versioned interfaces and tests expose any compatibility breaks early

## Edge Cases

- A workspace blueprint requires image generation or moderation features that one provider does not support
- The selected niche pack requires extra validation fields that older session payloads do not contain
- Provider credentials are valid for chat but not for async video generation
- Fallback routing could switch providers mid-session and create inconsistent output provenance
- A cloned workspace removes bundled niche packs and relies entirely on custom project schemas
- A long-running generation job succeeds at the provider but callback delivery to the platform fails
- The source repo’s current single-app frontend/backend assumptions conflict with a new monorepo package boundary
- Existing sessions and API responses need a migration path into the new template model

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST transform the existing application into a monorepo that separates deployable apps from shared packages while preserving the current workflow architecture discipline
- **FR-002**: The system MUST provide a template initialization flow that creates a workspace configuration for a specific AI-UGC niche or custom niche composition
- **FR-003**: The system MUST support bundled niche packs for at least ecommerce product ads, local service ads, info-product promos, creator testimonial ads, and organic social proof content
- **FR-004**: The system MUST allow custom niche definitions through declarative configuration rather than source edits for standard use cases
- **FR-005**: The system MUST preserve a multi-step creation workflow covering intake, source analysis, prompt assembly, moderation, generation, and output review
- **FR-006**: The system MUST model workflow blueprints as versioned configuration artifacts that can be attached to projects and sessions
- **FR-007**: The system MUST expose a provider abstraction layer for chat/text generation, image handling, video generation, task status polling, and capability discovery
- **FR-008**: The system MUST ship with LaoZhang and APIMart provider adapters configured as standard supported providers
- **FR-009**: The system MUST use LaoZhang’s OpenAI-compatible endpoint format for text generation and compatible video operations where configured
- **FR-010**: The system MUST use APIMart’s OpenAI-compatible endpoint format for text generation and async video operations where configured
- **FR-011**: The system MUST allow selecting a default provider globally and overriding provider choice by environment, workspace, or workflow blueprint
- **FR-012**: The system MUST provide a capability matrix so the runtime can determine whether a provider supports the requested text, image, or video operation
- **FR-013**: The system MUST provide deterministic compatibility errors or fallback routing when a requested capability is unsupported
- **FR-014**: The system MUST centralize provider credentials and endpoints in configuration with environment-variable-based setup for local development and deployment
- **FR-015**: The system MUST preserve a consistent API response envelope and error structure across apps and providers
- **FR-016**: The system MUST share validation schemas and domain contracts between frontend and backend packages
- **FR-017**: The system MUST support project-level brand rules including voice, audience, claims, offer structure, CTA policy, and asset constraints
- **FR-018**: The system MUST support session-level source assets, campaign inputs, generated prompts, moderation results, provider jobs, and output assets
- **FR-019**: The system MUST store provider job metadata including provider name, model, capability type, external task ID, and status history
- **FR-020**: The system MUST support blueprint-specific required fields, validations, and generation settings without frontend/backend drift
- **FR-021**: The system MUST provide a documented extension path for adding new niche packs and provider adapters
- **FR-022**: The system MUST preserve the existing core value: analyzing successful source content and generating derivative AI-UGC outputs adapted to user-supplied products or campaigns
- **FR-023**: The system MUST provide a migration strategy from the current `frontend/` + `backend/` structure into the target monorepo layout
- **FR-024**: The system MUST provide quickstart documentation for local setup with either LaoZhang or APIMart

### Key Entities *(include if feature involves data)*

- **Workspace Template**: A cloned project instance with repo-level configuration, enabled providers, storage configuration, and registered niche packs
- **Niche Pack**: A declarative package containing intake schema, prompt modules, output rules, validation, and presentation metadata for one AI-UGC use case
- **Workflow Blueprint**: A versioned orchestration definition describing enabled steps, required inputs, prompt composition blocks, moderation gates, provider preferences, and output policies
- **Provider Profile**: A configuration object for LaoZhang, APIMart, or future providers containing credentials, base URL, enabled capabilities, fallback order, and model mappings
- **Capability Matrix**: A runtime-readable record of which provider supports which operation, model family, and async status pattern
- **Project Profile**: A persistent customer/campaign configuration containing brand voice, audience, claims policy, offer framing, channel targets, and selected blueprint
- **Generation Session**: A user execution instance containing source assets, niche inputs, prompt versions, moderation results, provider jobs, and generated outputs
- **Provider Job**: A normalized record for async or sync provider work with request payload summary, provider task ID, model, timestamps, status transitions, and error details
- **Output Asset**: A generated or uploaded artifact such as source video, product image, voiceover draft, prompt text, or final output video linked back to its session and provider job

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new operator can clone the repo, select a niche pack, configure one provider, and reach a runnable local environment in under 30 minutes using quickstart only
- **SC-002**: Switching the default provider between LaoZhang and APIMart requires configuration changes only, with no edits to workflow business logic
- **SC-003**: At least 5 bundled niche packs can be enabled with distinct required fields and prompt composition while sharing the same runtime
- **SC-004**: The monorepo separates apps and shared packages such that at least 80% of domain validation and provider contracts are reused across frontend and backend
- **SC-005**: Provider errors surface with normalized codes/messages for 100% of supported generation entry points
- **SC-006**: A maintainer can add a new niche pack or provider adapter by touching only the documented extension surfaces plus registration tests
- **SC-007**: Existing source-content analysis and derivative video generation functionality remains representable in the new template model without losing required workflow data

## Assumptions

- The transformed project will remain TypeScript-first and preserve the current React/NestJS architectural style unless research identifies a strong reason to adjust packaging tools
- A monorepo tool such as pnpm workspaces with Turbo or native workspace scripts is acceptable if it does not introduce unnecessary runtime complexity
- AWS S3 or equivalent object storage remains suitable for source and generated assets
- Provider integration should prefer OpenAI-compatible SDK/request shapes to minimize adapter complexity across LaoZhang and APIMart
- APIMart and LaoZhang both remain externally managed gateways; the platform should abstract them rather than fork provider-specific business flows
- The planning phase may define migration steps without fully rewriting the current repository in this turn
