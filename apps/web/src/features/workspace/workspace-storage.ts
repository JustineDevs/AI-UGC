import type { WorkspaceSetupDraft } from "./types";

const WORKSPACE_DRAFT_STORAGE_KEY = "ai-ugc.workspace-setup-draft";
const BLUEPRINT_EDITOR_STORAGE_KEY = "ai-ugc.blueprint-editor-draft";

export function loadWorkspaceDraft(): WorkspaceSetupDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(WORKSPACE_DRAFT_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as WorkspaceSetupDraft;
  } catch {
    window.localStorage.removeItem(WORKSPACE_DRAFT_STORAGE_KEY);
    return null;
  }
}

export function saveWorkspaceDraft(draft: WorkspaceSetupDraft): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    WORKSPACE_DRAFT_STORAGE_KEY,
    JSON.stringify(draft),
  );
}

export function loadBlueprintStepDraft(): Array<{
  id: string;
  label: string;
  enabled: boolean;
}> | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(BLUEPRINT_EDITOR_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as Array<{
      id: string;
      label: string;
      enabled: boolean;
    }>;
  } catch {
    window.localStorage.removeItem(BLUEPRINT_EDITOR_STORAGE_KEY);
    return null;
  }
}

export function saveBlueprintStepDraft(
  steps: Array<{ id: string; label: string; enabled: boolean }>,
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    BLUEPRINT_EDITOR_STORAGE_KEY,
    JSON.stringify(steps),
  );
}
