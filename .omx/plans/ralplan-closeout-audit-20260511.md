# Consensus Close-Out Draft: AI-UGC Template Platform

## Plan Summary

**Plan saved to:** `.omx/plans/ralplan-closeout-audit-20260511.md`

**Scope:**
- 5 tasks across ~10-16 files plus `.omx/state` / `.omx/context` artifacts
- Estimated complexity: MEDIUM

**Evidence baseline:**
- `specs/002-ai-ugc-template-platform/tasks.md` shows `49` complete / `0` remaining.
- The active Ralph state is now `iteration: 1`, `current_phase: executing`, with task description `Implement architect-identified remaining AI-UGC closeout gaps`; it no longer records the earlier pass/fail summary inline.
- Two context snapshots exist and both are stale in different ways:
  - `ai-ugc-monorepo-implementation-20260510T211006Z.md` still says `22 complete / 27 remaining`
  - `ai-ugc-remaining-closeout-20260510T223003Z.md` still claims backend provider-core gaps that are already fixed
- Several files still describe completed work as pending or scaffolded:
  - `specs/002-ai-ugc-template-platform/quickstart.md`
  - `docs/extensions.md`
  - `packages/provider-core/README.md`
  - `apps/web/src/features/blueprints/BlueprintEditorPage.tsx`
  - `apps/web/src/features/sessions/SessionStartPage.tsx`
- Backend/provider-core generalization is partially complete already:
  - `packages/provider-core/src/capabilities.ts` uses `ProviderKey = string`
  - `apps/api/src/modules/providers/provider-validation.service.ts` resolves via `ProviderRegistry`
  - `apps/web/src/features/workspace/WorkspaceSetupPage.tsx` already attempts API persistence
- The real remaining implementation gaps are narrower and mostly web/test-facing:
  - built-in-only provider UX defaults/options remain in `apps/web/src/features/providers/ProviderSettingsPage.tsx`, `ProviderProfileForm.tsx`, and `apps/web/src/features/workspace/WorkspaceSetupPage.tsx`
  - `apps/web/src/features/blueprints/BlueprintEditorPage.tsx` is still preview-only rather than endpoint-backed
  - `apps/web/src/features/sessions/SessionStartPage.tsx` is still preview/scaffold-only rather than project/session endpoint-backed
  - reopened tests are needed because current web tests only assert scaffold rendering
  - the sample third-provider path exists in provider-core, but the web provider UX still biases the operator toward only the two built-ins

## RALPLAN-DR

### Principles
1. Prefer evidence over ledger optimism; checked boxes do not override contradictory repo state.
2. Reopen implementation when executable behavior contradicts accepted story completion; do not hide product gaps behind stale-copy cleanup.
3. Preserve narrow scope; finish with auditable close-out evidence, not a broad redesign.
4. Keep acceptance criteria executable: state, docs, UI copy, and verification must agree.

### Decision Drivers
1. Live repo truth: is anything user-facing or extension-critical still genuinely unfinished?
2. Close-out integrity: can Ralph/team handoff rely on the current ledger and verification state?
3. Cost of reopening: avoid unnecessary implementation churn if the remaining work is reconciliation-only.

### Viable Options
1. **Verification-only close-out**
   - Pros: fastest path; matches `49/0` and passed validations.
   - Cons: codifies a likely false completion state; ignores scaffold-only P2/P3 surfaces and shallow tests.
2. **Task-ledger audit + targeted implementation reopen**
   - Pros: matches the strongest live evidence; fixes both acceptance drift and stale close-out artifacts.
   - Cons: more work than audit-only; requires explicit rescoping of wrongly completed tasks.
3. **Downgrade milestone to migration scaffolding**
   - Pros: lowest implementation churn if the real milestone was scaffolding rather than feature-complete transformation.
   - Cons: requires spec/tasks/docs re-baselining and gives up the stronger completion claim.

### Recommended Plan
Choose **Option 2** as the default lane: treat the repo as **not yet safely closable**, run a task-ledger audit, reopen the narrow implementation slices where behavior is still scaffold-only or built-in-only, then finish with close-out reconciliation and final verification. Use **Option 3** only if the team explicitly decides the intended milestone was a smaller migration-scaffolding deliverable.

## Actionable Steps

1. **Acceptance audit against live behavior**
   - Verify the current code, tests, and docs against the four user stories and final polish tasks, with emphasis on transformed web behavior and extension guarantees.
   - Acceptance criteria: every claimed completed task has either matching runtime behavior plus evidence, or is explicitly reopened/downgraded.

2. **Make the contract decision explicit**
  - Decide whether this milestone is:
    - `A`: feature-complete transformed platform per the written spec, or
    - `B`: migration scaffolding milestone that was over-reported as complete.
  - Rule: if any P1-P3 independent-test surface is still scaffold-only, default to `A` plus reopen unless `spec.md`, `tasks.md`, docs, and state are first re-baselined to `B`.
  - If `B`, the downgrade edit set is mandatory:
    - `specs/002-ai-ugc-template-platform/spec.md`
    - `specs/002-ai-ugc-template-platform/tasks.md`
    - `specs/002-ai-ugc-template-platform/quickstart.md`
    - `docs/extensions.md`
    - `packages/provider-core/README.md`
    - `.omx/state/ralph-state.json`
    - a replacement UTC-stamped close-out snapshot under `.omx/context/`
  - Acceptance criteria: one explicit ruling documented before more verification work is counted.

3. **Reopen the narrow implementation slices if `A`**
  - Reopen only the behavior-backed gaps:
    - provider settings and workspace provider-selection surfaces that still assume only built-ins
    - blueprint editor wiring to `POST /workspaces/:workspaceId/blueprints` and retrieval from `GET /blueprints/:blueprintId`
    - session launcher wiring to `POST /projects/:projectId/sessions` and `POST /sessions/:sessionId/run`, with status retrieval from `GET /sessions/:sessionId`
    - corresponding tests that currently assert scaffolds rather than story acceptance
  - Explicit provider UX behavior for this reopen:
    - replace hardcoded provider-only selects with an editable `providerKey` entry model seeded by built-in presets (`laozhang`, `apimart`) so a maintainer can configure a third registered provider without adding new app-layer branches
  - Concrete touchpoints:
    - `apps/web/src/features/providers/ProviderSettingsPage.tsx`
    - `apps/web/src/features/providers/ProviderProfileForm.tsx`
    - `apps/web/src/features/providers/types.ts`
     - `apps/web/src/features/workspace/WorkspaceSetupPage.tsx`
     - `apps/web/src/features/blueprints/BlueprintEditorPage.tsx`
     - `apps/web/src/features/sessions/SessionStartPage.tsx`
     - `apps/web/src/services/api.ts`
    - `apps/web/src/features/workspace/__tests__/workspace-setup.spec.tsx`
    - `apps/web/src/features/blueprints/__tests__/blueprint-editor.spec.tsx`
    - `apps/web/src/features/sessions/__tests__/session-launch.spec.tsx`
  - Acceptance criteria: reopened tasks are enumerated and bounded; no speculative redesign is added.

4. **Reconcile stale close-out artifacts**
   - Update stale context/state/docs/UI copy that still says pending/planned when work is already present, or restate them honestly if the milestone is downgraded.
  - Candidate files:
    - `specs/002-ai-ugc-template-platform/quickstart.md`
    - `docs/extensions.md`
    - `packages/provider-core/README.md`
    - `apps/web/src/features/workspace/WorkspaceSetupPage.tsx`
    - `apps/web/src/features/blueprints/BlueprintEditorPage.tsx`
    - `apps/web/src/features/sessions/SessionStartPage.tsx`
    - `.omx/context/ai-ugc-monorepo-implementation-20260510T211006Z.md` or a superseding snapshot
    - `.omx/context/ai-ugc-remaining-closeout-20260510T223003Z.md` or a superseding snapshot
  - Acceptance criteria: no close-out artifact contradicts the chosen milestone contract.

5. **Rerun final verification and architect check**
   - After the contract decision and any reopen work, repeat the verification suite already marked passed, then complete the timed-out architect verification as a blocking close-out item.
  - Commands:
    - `pnpm typecheck`
    - `pnpm build`
    - `pnpm lint`
    - `pnpm test`
    - `pnpm --filter @ai-ugc/web exec vitest run src/features/workspace/__tests__/workspace-setup.spec.tsx src/features/blueprints/__tests__/blueprint-editor.spec.tsx src/features/sessions/__tests__/session-launch.spec.tsx`
  - Record architect verification in a new UTC-stamped close-out snapshot under `.omx/context/` and mirror the terminal verdict in `.omx/state/ralph-state.json`.
  - Acceptance criteria: architect verification has a recorded terminal result; final state/context artifacts record the outcome and any honest residual risk.

## ADR

**Decision**
- Treat the repo as **acceptance-drifted**: perform a task-ledger audit, reopen narrow implementation where live behavior still misses the written stories, then close out with reconciled artifacts and final verification.

**Drivers**
- The task ledger indicates completion, but transformed UI behavior, sample-extension evidence, and web tests still show scaffold-only or built-in-only behavior.
- Multiple in-repo artifacts contradict the claimed completion and some of those contradictions are behavior-true, not just wording.
- The remaining credible implementation gaps are narrow enough to reopen surgically rather than re-plan the whole platform.

**Alternatives considered**
1. Verification-only close-out without edits.
   - Rejected because it would preserve false completion signals against current executable behavior.
2. Downgrade everything to a scaffolding milestone.
   - Rejected as the default because the repo contains substantial implemented surfaces and the spec/tasks currently claim a stronger milestone.

**Why chosen**
- It preserves momentum while staying honest: reopen only where runtime evidence fails the written acceptance and avoid pretending that stale or scaffold-only surfaces are complete.

**Consequences**
- Most likely outcome: reopen a narrow set of web-flow/provider-UX tasks, then reconcile artifacts and rerun verification.
- Alternate branch: if the team intentionally targeted migration scaffolding, re-baseline the spec/tasks/docs instead of extending implementation.

**Follow-ups**
1. If the team keeps the current spec: hand off to `ralph` or `team` for narrow implementation reopen plus close-out verification.
2. If the team downgrades the milestone: re-baseline spec/tasks/docs/state before claiming completion.

## Available Agent Types

- `planner`: sequencing, acceptance criteria, close-out artifact design
- `architect`: interpret US4 strictness, extension-surface boundaries, final architectural verification
- `critic`: consistency check across ledger, docs, and acceptance claims
- `explore`: fast repo lookup for contradictory state and file references
- `executor`: apply reconciliation edits if execution is approved
- `executor`: implement reopened web/provider slices if the current spec is retained
- `verifier`: rerun tests/checks and confirm evidence
- `writer`: tighten docs/README/quickstart close-out language

## Staffing Guidance

### Ralph path
- Use `ralph` when one owner should do the audit, execute the narrow reopen work, reconcile files, rerun verification, and stop only when the close-out state is coherent.
- Suggested lane order:
  1. `explore`/leader audit
  2. `architect` contract ruling
  3. `executor` reopen implementation
  4. `writer`/`executor` artifact reconciliation
  5. `verifier` final evidence pass

### Team path
- Use `team` only if you want parallel reconciliation:
  - Lane 1: blueprint/session web-flow completion (`executor`)
  - Lane 2: provider UX/sample-extension completion (`executor`)
  - Lane 3: docs/state/task-ledger reconciliation (`writer`)
  - Lane 4: final verification (`verifier`)
- Avoid team mode only if the team explicitly downgrades the milestone to scaffolding and chooses not to reopen implementation.

## Reasoning By Lane

- `explore`: low
- `writer`: medium
- `executor`: high
- `verifier`: medium-high
- `architect`: high
- `critic`: high

## Launch Hints

- **Ralph:** use when you want a single-owner narrow reopen and close-out
  - `$ralph "Audit the 49/0 completion claim in reference/viral2viral against live behavior, apply the reopen-vs-downgrade rule, reopen the missing blueprint/session web flows and provider UX/sample-extension slices if needed, reconcile stale state/docs/UI artifacts, rerun pnpm typecheck/build/lint/test, record architect verification in new .omx/context and .omx/state artifacts, and stop only when the close-out evidence is coherent."`
  - `$ralph "Audit the 49/0 completion claim in reference/viral2viral against live behavior, apply the reopen-vs-downgrade rule, reopen the missing blueprint/session web flows and provider UX slices if needed, using editable providerKey entry seeded by built-in presets rather than new app-layer branching, reconcile stale state/docs/UI artifacts, rerun pnpm typecheck/build/lint/test plus targeted web specs, record architect verification in new .omx/context and .omx/state artifacts, and stop only when the close-out evidence is coherent."`
- **Team:** use when you want concurrent audit lanes
  - `$team "In reference/viral2viral, run parallel lanes for blueprint/session web-flow completion, provider UX completion using editable providerKey entry seeded by built-ins, docs/state/task-ledger reconciliation, and final verification, then return one integrated verdict on whether the platform is truly complete or only scaffold-complete."`

## Verification Path

1. Confirm task ledger and state agreement:
   - `tasks.md`
   - `.omx/state/ralph-state.json`
   - latest `.omx/context/*`
2. Confirm the contract ruling used the explicit reopen-vs-downgrade rule.
3. If the current spec is retained, confirm:
   - blueprint creation uses `POST /workspaces/:workspaceId/blueprints`
   - session creation uses `POST /projects/:projectId/sessions`
   - session launch uses `POST /sessions/:sessionId/run`
4. Confirm provider UX/sample-extension surfaces match the chosen milestone contract.
5. Confirm contradictory pending/planned language is removed or reframed honestly.
6. Re-run project validation commands:
   - `pnpm typecheck`
   - `pnpm build`
   - `pnpm lint`
   - `pnpm test`
   - `pnpm --filter @ai-ugc/web exec vitest run src/features/workspace/__tests__/workspace-setup.spec.tsx src/features/blueprints/__tests__/blueprint-editor.spec.tsx src/features/sessions/__tests__/session-launch.spec.tsx`
7. Run architect verification again and record a terminal result in `.omx/context/` plus `.omx/state/ralph-state.json`.
8. Publish one final close-out note stating either:
   - `Feature-complete transformation verified`
   - `Milestone downgraded to migration scaffolding`
   - `Narrow implementation follow-up still required`

## Available Deliverables

1. Acceptance audit verdict
2. Explicit contract ruling: feature-complete vs migration scaffolding
3. Reopened-task list if needed
4. Reconciled docs/state/UI messaging
5. Final verification evidence including architect result
