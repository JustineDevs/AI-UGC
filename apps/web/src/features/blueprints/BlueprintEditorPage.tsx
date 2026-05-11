import { useState } from "react";
import {
  buildSemanticBlueprintPlan,
  defaultBlueprintSteps,
  listPromptBlocksByType,
  listSkillDefinitions,
} from "@ai-ugc/workflow-engine";
import { createBlueprint } from "../../services/api";
import {
  loadBlueprintStepDraft,
  loadWorkspaceDraft,
  saveBlueprintStepDraft,
  saveWorkspaceDraft,
} from "../workspace/workspace-storage";

export function BlueprintEditorPage() {
  const workspaceDraft = loadWorkspaceDraft();
  const [steps, setSteps] = useState(
    loadBlueprintStepDraft() ?? defaultBlueprintSteps,
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const semanticPlan = buildSemanticBlueprintPlan({
    nichePackKey: workspaceDraft?.selectedBundledKey,
    channelTargets: workspaceDraft?.projectProfile.channelTargets,
    preferredProviderKey: workspaceDraft?.defaultProviderKey,
    enabledStepIds: steps.filter((step) => step.enabled).map((step) => step.id),
  });

  function toggleStep(stepId: string) {
    setSteps((currentSteps) =>
      currentSteps.map((step) =>
        step.id === stepId ? { ...step, enabled: !step.enabled } : step,
      ),
    );
  }

  async function persistBlueprint() {
    saveBlueprintStepDraft(steps);

    if (!workspaceDraft?.workspaceId) {
      setStatusMessage(
        "Blueprint draft saved locally. Save a workspace first to persist through the API.",
      );
      return;
    }

    try {
      const blueprint = await createBlueprint(workspaceDraft.workspaceId, {
        name: "interactive-blueprint",
        nichePackKey: workspaceDraft.selectedBundledKey,
        intakeSchema: {
          requiredAssetTypes:
            workspaceDraft.customNicheInput.requiredAssetTypes,
          channelTargets: workspaceDraft.projectProfile.channelTargets,
          defaultProviderKey: workspaceDraft.defaultProviderKey,
        },
        stepGraph: {
          start: "collect-inputs",
          steps,
        },
      });

      saveWorkspaceDraft({
        ...workspaceDraft,
        persistedBlueprintId: blueprint.id,
        projectProfile: {
          ...workspaceDraft.projectProfile,
          selectedBlueprint: blueprint.id,
        },
      });
      setStatusMessage(`Blueprint persisted as ${blueprint.id}.`);
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? `Blueprint draft saved locally; API persistence fallback triggered: ${error.message}`
          : "Blueprint draft saved locally; API persistence fallback triggered.",
      );
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-600">
          User Story 3
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">
          Blueprint Editor
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Toggle workflow steps, persist the draft locally, and attempt to
          create a blueprint through the API for the current workspace.
        </p>
      </div>

      <div className="mt-6 grid gap-3">
        {steps.map((step) => (
          <label
            key={step.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
          >
            <div>
              <p className="font-medium text-slate-900">{step.label}</p>
              <p className="text-xs text-slate-500">{step.id}</p>
            </div>
            <input
              type="checkbox"
              checked={step.enabled}
              onChange={() => toggleStep(step.id)}
              className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Prompt Template
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            {semanticPlan.template.id}
          </p>
          <ul className="mt-3 space-y-2 text-xs text-slate-500">
            {semanticPlan.promptBlocks.map((definition) => (
              <li key={definition.id}>{definition.id}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Skill Chain</h3>
          <ul className="mt-3 space-y-2 text-xs text-slate-500">
            {semanticPlan.skillChain.map((definition) => (
              <li key={definition.id}>{definition.id}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Semantic Catalog
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Core prompts: {listPromptBlocksByType("core").length}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Niche prompts: {listPromptBlocksByType("niche").length}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Skills: {listSkillDefinitions().length}
          </p>
        </section>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void persistBlueprint()}
          className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Persist Blueprint
        </button>
        {statusMessage && (
          <p className="self-center text-sm text-slate-600">{statusMessage}</p>
        )}
      </div>
    </section>
  );
}
