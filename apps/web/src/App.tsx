import { useState } from "react";
import { BlueprintEditorPage } from "./features/blueprints/BlueprintEditorPage";
import { ProviderSettingsPage } from "./features/providers/ProviderSettingsPage";
import { SessionStartPage } from "./features/sessions/SessionStartPage";
import { WorkflowStudioPage } from "./features/workflow/WorkflowStudioPage";
import { WorkspaceSetupPage } from "./features/workspace/WorkspaceSetupPage";

type AppView =
  | "workspace"
  | "providers"
  | "blueprints"
  | "sessions"
  | "workflow";

const views: Array<{ id: AppView; label: string; description: string }> = [
  {
    id: "workspace",
    label: "Workspace Setup",
    description: "Configure niche packs, brand rules, and project metadata.",
  },
  {
    id: "providers",
    label: "Provider Settings",
    description: "Validate and store LaoZhang / APIMart provider profiles.",
  },
  {
    id: "blueprints",
    label: "Blueprint Editor",
    description:
      "Preview workflow-step customization before runtime persistence.",
  },
  {
    id: "sessions",
    label: "Session Launcher",
    description: "Preview the project and channel selections used for a run.",
  },
  {
    id: "workflow",
    label: "Workflow Studio",
    description:
      "Continue the current generation flow while migration proceeds.",
  },
];

function App() {
  const [activeView, setActiveView] = useState<AppView>("workspace");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
              AI-UGC Monorepo
            </p>
            <div>
              <h1 className="text-3xl font-semibold">AI-UGC</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Configurable AI user-generated content workflows for
                niche-specific campaigns, provider portability, and reusable
                session orchestration.
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-3">
            {views.map((view) => {
              const isActive = view.id === activeView;

              return (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setActiveView(view.id)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700"
                  }`}
                >
                  <div className="text-sm font-semibold">{view.label}</div>
                  <div
                    className={`mt-1 text-xs ${
                      isActive ? "text-blue-100" : "text-slate-500"
                    }`}
                  >
                    {view.description}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeView === "workspace" && <WorkspaceSetupPage />}
        {activeView === "providers" && <ProviderSettingsPage />}
        {activeView === "blueprints" && <BlueprintEditorPage />}
        {activeView === "sessions" && <SessionStartPage />}
        {activeView === "workflow" && <WorkflowStudioPage />}
      </main>
    </div>
  );
}

export default App;
