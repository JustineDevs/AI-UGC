import { builtInNichePacks, createCustomNichePack } from "@ai-ugc/niche-packs";
import { useState } from "react";
import {
  createBlueprint,
  createProjectProfile,
  createWorkspaceTemplate,
} from "../../services/api";
import { CustomNicheBuilder } from "./CustomNicheBuilder";
import { NichePackSelector } from "./NichePackSelector";
import { ProjectProfileForm } from "./ProjectProfileForm";
import type { BuiltInNichePack, WorkspaceSetupDraft } from "./types";
import { loadWorkspaceDraft, saveWorkspaceDraft } from "./workspace-storage";

const defaultBundledPack = builtInNichePacks[0] as BuiltInNichePack;

function createDefaultDraft(): WorkspaceSetupDraft {
  return {
    workspaceId: defaultBundledPack.key,
    name: "AI-UGC Workspace",
    slug: "ai-ugc-workspace",
    defaultProviderKey: "laozhang",
    nicheMode: "bundled",
    selectedBundledKey: defaultBundledPack.key,
    customNicheInput: {
      label: "",
      channelTargets: ["tiktok"],
      requiredAssetTypes: ["source_video", "product_image"],
      promptModules: ["hook", "offer", "cta"],
    },
    projectProfile: {
      name: "Launch Campaign",
      selectedBlueprint: "niche-default",
      brandVoice: "Specific, credible, creator-native, benefit-led.",
      audience: "Warm prospects who need a clear before/after transformation.",
      offerDetails: "Starter bundle with a limited-time incentive.",
      claimsPolicy: ["Use only supportable product claims"],
      channelTargets: defaultBundledPack.defaultChannelTargets,
      forbiddenTerms: ["guaranteed", "miracle"],
      assetConstraints: {
        aspectRatio: "9:16",
        durationSeconds: "15-30s",
        ctaPolicy: "One direct CTA near the end of the video",
      },
    },
  };
}

function resolveBundledPack(selectedKey: string): BuiltInNichePack {
  return (
    (builtInNichePacks.find((pack) => pack.key === selectedKey) as
      | BuiltInNichePack
      | undefined) ?? defaultBundledPack
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function WorkspaceSetupPage() {
  const [draft, setDraft] = useState<WorkspaceSetupDraft>(() => {
    return loadWorkspaceDraft() ?? createDefaultDraft();
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const selectedBundledPack = resolveBundledPack(draft.selectedBundledKey);
  const selectedNichePack =
    draft.nicheMode === "bundled"
      ? selectedBundledPack
      : createCustomNichePack(draft.customNicheInput);

  const canSave =
    draft.name.trim().length > 0 &&
    draft.slug.trim().length > 0 &&
    draft.projectProfile.name.trim().length > 0 &&
    (draft.nicheMode === "bundled" ||
      draft.customNicheInput.label.trim().length > 0);

  function updateDraft(nextDraft: WorkspaceSetupDraft) {
    setDraft(nextDraft);
    setStatusMessage(null);
  }

  async function handleSave() {
    const normalizedSlug = slugify(draft.slug || draft.name);
    const savedDraft: WorkspaceSetupDraft = {
      ...draft,
      workspaceId: normalizedSlug,
      slug: normalizedSlug,
      projectProfile: {
        ...draft.projectProfile,
        channelTargets:
          draft.projectProfile.channelTargets.length > 0
            ? draft.projectProfile.channelTargets
            : selectedNichePack.defaultChannelTargets,
      },
      savedAt: new Date().toISOString(),
    };

    saveWorkspaceDraft(savedDraft);
    setDraft(savedDraft);

    try {
      const workspace = await createWorkspaceTemplate({
        name: savedDraft.name,
        slug: normalizedSlug,
        enabledNichePackKeys:
          savedDraft.nicheMode === "bundled"
            ? [savedDraft.selectedBundledKey]
            : [selectedNichePack.key],
      });

      const blueprint = await createBlueprint(workspace.id, {
        name: savedDraft.projectProfile.selectedBlueprint,
        nichePackKey:
          savedDraft.nicheMode === "bundled"
            ? savedDraft.selectedBundledKey
            : undefined,
        intakeSchema: {
          requiredAssetTypes: selectedNichePack.requiredAssetTypes,
          channelTargets: selectedNichePack.defaultChannelTargets,
        },
        stepGraph: {
          start: "collect-inputs",
          steps: selectedNichePack.promptModuleRefs,
        },
      });

      const project = await createProjectProfile(workspace.id, {
        name: savedDraft.projectProfile.name,
        workflowBlueprintId: blueprint.id,
        brandVoice: savedDraft.projectProfile.brandVoice,
        audience: savedDraft.projectProfile.audience,
        offerDetails: savedDraft.projectProfile.offerDetails,
        channelTargets: savedDraft.projectProfile.channelTargets,
      });

      const persistedDraft: WorkspaceSetupDraft = {
        ...savedDraft,
        workspaceId: workspace.id,
        projectId: project.id,
        persistedBlueprintId: blueprint.id,
        projectProfile: {
          ...savedDraft.projectProfile,
          selectedBlueprint: blueprint.id,
        },
      };

      saveWorkspaceDraft(persistedDraft);
      setDraft(persistedDraft);
      setStatusMessage(
        `Workspace persisted via API as ${workspace.slug}; project ${project.name} is ready for session launch.`,
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? `Workspace draft saved locally; API persistence fallback triggered: ${error.message}`
          : "Workspace draft saved locally; API persistence fallback triggered.",
      );
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_420px]">
      <div className="space-y-6">
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
              User Story 1
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-semibold">
              Workspace Setup
            </h1>
            <p className="mt-4 text-slate-200 max-w-2xl">
              Create the workspace template, choose a bundled or custom niche,
              and capture project-level brand rules before session execution.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-800">
                Workspace name
              </span>
              <input
                type="text"
                value={draft.name}
                onChange={(event) =>
                  updateDraft({
                    ...draft,
                    name: event.target.value,
                  })
                }
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-800">
                Workspace slug
              </span>
              <input
                type="text"
                value={draft.slug}
                onChange={(event) =>
                  updateDraft({
                    ...draft,
                    slug: slugify(event.target.value),
                  })
                }
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <label className="block mt-4">
            <span className="text-sm font-medium text-gray-800">
              Preferred default provider
            </span>
            <select
              value={draft.defaultProviderKey}
              onChange={(event) =>
                updateDraft({
                  ...draft,
                  defaultProviderKey: event.target.value,
                })
              }
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="laozhang">LaoZhang</option>
              <option value="apimart">APIMart</option>
            </select>
          </label>
        </section>

        <NichePackSelector
          nichePacks={builtInNichePacks as BuiltInNichePack[]}
          selectedMode={draft.nicheMode}
          selectedBundledKey={draft.selectedBundledKey}
          onModeChange={(mode) =>
            updateDraft({
              ...draft,
              nicheMode: mode,
              projectProfile: {
                ...draft.projectProfile,
                channelTargets:
                  mode === "bundled"
                    ? resolveBundledPack(draft.selectedBundledKey)
                        .defaultChannelTargets
                    : draft.projectProfile.channelTargets,
              },
            })
          }
          onBundledSelect={(key) =>
            updateDraft({
              ...draft,
              selectedBundledKey: key,
              projectProfile: {
                ...draft.projectProfile,
                channelTargets: resolveBundledPack(key).defaultChannelTargets,
              },
            })
          }
        />

        {draft.nicheMode === "custom" && (
          <CustomNicheBuilder
            value={draft.customNicheInput}
            onChange={(value) =>
              updateDraft({
                ...draft,
                customNicheInput: value,
              })
            }
          />
        )}

        <ProjectProfileForm
          value={draft.projectProfile}
          onChange={(projectProfile) =>
            updateDraft({
              ...draft,
              projectProfile,
            })
          }
        />

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Save workspace configuration
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Saves locally for recovery and attempts API persistence for the
              workspace, blueprint, and project profile.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            Save Workspace Draft
          </button>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Resolved Setup
          </h2>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-900">Workspace ID:</span>{" "}
              {draft.slug || "pending-slug"}
            </p>
            <p>
              <span className="font-medium text-gray-900">Niche pack:</span>{" "}
              {selectedNichePack.label}
            </p>
            <p>
              <span className="font-medium text-gray-900">Provider:</span>{" "}
              {draft.defaultProviderKey}
            </p>
            <p>
              <span className="font-medium text-gray-900">Channels:</span>{" "}
              {selectedNichePack.defaultChannelTargets.join(", ")}
            </p>
            <p>
              <span className="font-medium text-gray-900">Assets:</span>{" "}
              {selectedNichePack.requiredAssetTypes.join(", ")}
            </p>
            <p>
              <span className="font-medium text-gray-900">Prompt modules:</span>{" "}
              {selectedNichePack.promptModuleRefs.join(", ")}
            </p>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Project Rules</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li>
              Blueprint:{" "}
              <span className="text-gray-900">
                {draft.projectProfile.selectedBlueprint}
              </span>
            </li>
            <li>
              Channel targets:{" "}
              <span className="text-gray-900">
                {draft.projectProfile.channelTargets.join(", ") || "None yet"}
              </span>
            </li>
            <li>
              Forbidden terms:{" "}
              <span className="text-gray-900">
                {draft.projectProfile.forbiddenTerms.join(", ") || "None"}
              </span>
            </li>
            <li>
              Duration:{" "}
              <span className="text-gray-900">
                {draft.projectProfile.assetConstraints.durationSeconds}
              </span>
            </li>
          </ul>
        </section>

        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-emerald-900">
            Persistence Mode
          </h2>
          <p className="mt-2 text-sm text-emerald-800">
            This page stores the draft locally for resilience and also attempts
            to persist the workspace, blueprint, and project through the API. If
            the API is unavailable, the local draft remains usable.
          </p>
        </section>

        {statusMessage && (
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <p className="text-sm text-emerald-800">{statusMessage}</p>
          </section>
        )}
      </aside>
    </div>
  );
}
