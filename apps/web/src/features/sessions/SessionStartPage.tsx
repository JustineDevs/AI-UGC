import { useState } from "react";
import {
  createGenerationSession,
  runGenerationSession,
} from "../../services/api";
import { loadWorkspaceDraft } from "../workspace/workspace-storage";

export function SessionStartPage() {
  const workspaceDraft = loadWorkspaceDraft();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function handleLaunchSession() {
    if (!workspaceDraft?.projectId) {
      setStatusMessage(
        "Save the workspace and project through the API before launching a generation session.",
      );
      return;
    }

    try {
      const session = await createGenerationSession(workspaceDraft.projectId, {
        channelTarget:
          workspaceDraft.projectProfile.channelTargets[0] || "tiktok",
        campaignInputs: {
          workspaceId: workspaceDraft.workspaceId,
        },
      });

      const runningSession = await runGenerationSession(session.id);
      setStatusMessage(
        `Generation session ${runningSession.id} launched with status ${runningSession.status}.`,
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Unable to launch a generation session.",
      );
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-600">
          Session Launcher
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">
          Generation Session Launcher
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          This view previews the workspace and project selections and attempts
          to create and run a generation session through the API.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
        <p>
          <span className="font-medium text-slate-900">Workspace:</span>{" "}
          {workspaceDraft?.name || "No saved workspace draft"}
        </p>
        <p className="mt-2">
          <span className="font-medium text-slate-900">Project:</span>{" "}
          {workspaceDraft?.projectProfile.name || "No saved project profile"}
        </p>
        <p className="mt-2">
          <span className="font-medium text-slate-900">Channels:</span>{" "}
          {workspaceDraft?.projectProfile.channelTargets.join(", ") || "None"}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void handleLaunchSession()}
          className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Launch Session
        </button>
        {statusMessage && (
          <p className="self-center text-sm text-slate-600">{statusMessage}</p>
        )}
      </div>
    </section>
  );
}
