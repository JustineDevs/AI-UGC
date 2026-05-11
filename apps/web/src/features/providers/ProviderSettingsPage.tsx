import { useEffect, useState } from "react";
import {
  listProviderProfiles,
  upsertProviderProfile,
  validateProvider,
} from "../../services/api";
import { loadWorkspaceDraft } from "../workspace/workspace-storage";
import { ProviderProfileForm } from "./ProviderProfileForm";
import { ProviderValidationPanel } from "./ProviderValidationPanel";
import type {
  ProviderCapability,
  ProviderProfileDraft,
  ProviderValidationResult,
  ProviderKey,
  SavedProviderProfile,
} from "./types";

const providerDefaults: Record<ProviderKey, ProviderProfileDraft> = {
  laozhang: {
    providerKey: "laozhang",
    displayName: "LaoZhang Primary",
    baseUrl: "https://api.laozhang.ai/v1",
    apiKeySecretRef: "LAOZHANG_API_KEY",
    defaultTextModel: "gpt-5",
    defaultVideoModel: "sora-2",
    defaultImageModel: "",
    enabledCapabilities: ["prompt_generation", "video_generation"],
    fallbackPriority: "1",
  },
  apimart: {
    providerKey: "apimart",
    displayName: "APIMart Primary",
    baseUrl: "https://api.apimart.ai/v1",
    apiKeySecretRef: "APIMART_API_KEY",
    defaultTextModel: "gpt-5",
    defaultVideoModel: "sora2",
    defaultImageModel: "",
    enabledCapabilities: [
      "prompt_generation",
      "video_generation",
      "status_polling",
    ],
    fallbackPriority: "2",
  },
  "sample-provider": {
    providerKey: "sample-provider",
    displayName: "Sample Provider",
    baseUrl: "https://example.invalid/provider",
    apiKeySecretRef: "SAMPLE_PROVIDER_API_KEY",
    defaultTextModel: "sample-text-model",
    defaultVideoModel: "sample-video-model",
    defaultImageModel: "",
    enabledCapabilities: ["prompt_generation"],
    fallbackPriority: "3",
  },
};

function coerceCapabilities(
  capabilities: ProviderCapability[],
): ProviderCapability[] {
  return capabilities.length > 0 ? capabilities : ["prompt_generation"];
}

function buildCustomProviderDraft(providerKey: string): ProviderProfileDraft {
  return {
    providerKey,
    displayName: providerKey,
    baseUrl: "",
    apiKeySecretRef: "",
    defaultTextModel: "",
    defaultVideoModel: "",
    defaultImageModel: "",
    enabledCapabilities: ["prompt_generation"],
    fallbackPriority: "3",
  };
}

export function ProviderSettingsPage() {
  const workspaceDraft = loadWorkspaceDraft();
  const [workspaceId, setWorkspaceId] = useState<string>(
    workspaceDraft?.workspaceId ?? workspaceDraft?.slug ?? "ai-ugc-workspace",
  );
  const [form, setForm] = useState<ProviderProfileDraft>(
    providerDefaults[workspaceDraft?.defaultProviderKey ?? "laozhang"],
  );
  const [validationResult, setValidationResult] =
    useState<ProviderValidationResult | null>(null);
  const [savedProfiles, setSavedProfiles] = useState<SavedProviderProfile[]>(
    [],
  );
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function loadProfiles(targetWorkspaceId: string) {
    if (!targetWorkspaceId.trim()) {
      setSavedProfiles([]);
      return;
    }

    setIsLoadingProfiles(true);

    try {
      const profiles = await listProviderProfiles(targetWorkspaceId);
      setSavedProfiles(profiles);
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Unable to load provider profiles.",
      );
    } finally {
      setIsLoadingProfiles(false);
    }
  }

  useEffect(() => {
    let isSubscribed = true;

    async function run() {
      if (!workspaceId.trim()) {
        if (isSubscribed) {
          setSavedProfiles([]);
        }
        return;
      }

      setIsLoadingProfiles(true);

      try {
        const profiles = await listProviderProfiles(workspaceId);
        if (isSubscribed) {
          setSavedProfiles(profiles);
        }
      } catch (error) {
        if (isSubscribed) {
          setStatusMessage(
            error instanceof Error
              ? error.message
              : "Unable to load provider profiles.",
          );
        }
      } finally {
        if (isSubscribed) {
          setIsLoadingProfiles(false);
        }
      }
    }

    void run();

    return () => {
      isSubscribed = false;
    };
  }, [workspaceId]);

  function handleProviderChange(providerKey: ProviderKey) {
    setForm(
      providerDefaults[providerKey] ?? buildCustomProviderDraft(providerKey),
    );
    setValidationResult(null);
    setStatusMessage(null);
  }

  async function handleValidate() {
    setIsValidating(true);
    setStatusMessage(null);

    try {
      const result = await validateProvider({
        providerKey: form.providerKey,
        apiKey: form.apiKeySecretRef,
        baseUrl: form.baseUrl,
        textModel: form.defaultTextModel,
        videoModel: form.defaultVideoModel,
      });

      setValidationResult(result);
      setForm((currentForm) => ({
        ...currentForm,
        enabledCapabilities: coerceCapabilities(result.enabledCapabilities),
      }));
      setStatusMessage(`Validation completed for ${result.providerKey}.`);
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Provider validation failed.",
      );
    } finally {
      setIsValidating(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const profile = await upsertProviderProfile(workspaceId, {
        providerKey: form.providerKey,
        displayName: form.displayName,
        baseUrl: form.baseUrl,
        apiKeySecretRef: form.apiKeySecretRef,
        defaultTextModel: form.defaultTextModel,
        defaultVideoModel: form.defaultVideoModel,
        defaultImageModel: form.defaultImageModel || undefined,
        enabledCapabilities: coerceCapabilities(form.enabledCapabilities),
        fallbackPriority: form.fallbackPriority
          ? Number(form.fallbackPriority)
          : undefined,
      });

      setSavedProfiles((currentProfiles) => {
        const remainingProfiles = currentProfiles.filter(
          (item) => item.id !== profile.id,
        );
        return [profile, ...remainingProfiles];
      });
      setStatusMessage(
        `Saved ${profile.displayName} for workspace ${workspaceId}.`,
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Unable to save provider profile.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_420px]">
      <div className="space-y-6">
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
            User Story 2
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold">
            Provider Settings
          </h1>
          <p className="mt-4 max-w-2xl text-slate-200">
            Configure built-in or custom registry-backed providers, validate
            connectivity through the API, and store provider profile defaults
            per workspace.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <label className="block">
            <span className="text-sm font-medium text-gray-800">
              Workspace template ID
            </span>
            <input
              type="text"
              value={workspaceId}
              onChange={(event) => setWorkspaceId(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <p className="mt-3 text-sm text-gray-600">
            Prefilled from the local workspace setup draft when available.
          </p>
        </section>

        <ProviderProfileForm
          value={form}
          onChange={setForm}
          onProviderChange={handleProviderChange}
        />

        <ProviderValidationPanel
          result={validationResult}
          isValidating={isValidating}
          onValidate={handleValidate}
        />

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Persist profile
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Uses the existing provider endpoints under `apps/api`.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={!workspaceId.trim() || isSaving}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSaving ? "Saving..." : "Save Provider Profile"}
          </button>
        </section>

        {statusMessage && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-700">{statusMessage}</p>
          </section>
        )}
      </div>

      <aside className="space-y-6">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Saved Profiles
            </h2>
            <button
              type="button"
              onClick={() => void loadProfiles(workspaceId)}
              disabled={isLoadingProfiles}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-blue-300"
            >
              {isLoadingProfiles ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {savedProfiles.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                No provider profiles saved for this workspace yet.
              </div>
            ) : (
              savedProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {profile.displayName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {profile.providerKey}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-wide text-gray-500">
                      {profile.status}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    <p>Base URL: {profile.baseUrl}</p>
                    <p>Text model: {profile.defaultTextModel}</p>
                    <p>Video model: {profile.defaultVideoModel}</p>
                    <p>
                      Capabilities: {profile.enabledCapabilities.join(", ")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-amber-900">
            Current Limitation
          </h2>
          <p className="mt-2 text-sm text-amber-800">
            Validation is wired, but it is environment-based today. Full secret
            management and workspace isolation remain outside this lane.
          </p>
        </section>
      </aside>
    </div>
  );
}
