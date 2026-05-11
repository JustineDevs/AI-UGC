import type { BuiltInNichePack } from "./types";

interface NichePackSelectorProps {
  nichePacks: BuiltInNichePack[];
  selectedMode: "bundled" | "custom";
  selectedBundledKey: string;
  onModeChange: (mode: "bundled" | "custom") => void;
  onBundledSelect: (key: string) => void;
}

export function NichePackSelector({
  nichePacks,
  selectedMode,
  selectedBundledKey,
  onModeChange,
  onBundledSelect,
}: NichePackSelectorProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Niche Pack</h2>
          <p className="text-sm text-gray-600 mt-1">
            Start from a shipped template or compose your own workflow shape.
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
          <button
            type="button"
            onClick={() => onModeChange("bundled")}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedMode === "bundled"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Bundled
          </button>
          <button
            type="button"
            onClick={() => onModeChange("custom")}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedMode === "custom"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {nichePacks.map((pack) => {
          const isSelected =
            selectedMode === "bundled" && selectedBundledKey === pack.key;

          return (
            <button
              key={pack.key}
              type="button"
              onClick={() => {
                onModeChange("bundled");
                onBundledSelect(pack.key);
              }}
              className={`text-left rounded-xl border p-4 transition-all ${
                isSelected
                  ? "border-blue-600 ring-2 ring-blue-100 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{pack.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {pack.description}
                  </p>
                </div>
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  {pack.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-900">Channels:</span>{" "}
                  {pack.defaultChannelTargets.join(", ")}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Assets:</span>{" "}
                  {pack.requiredAssetTypes.join(", ")}
                </p>
                <p>
                  <span className="font-medium text-gray-900">
                    Prompt blocks:
                  </span>{" "}
                  {pack.promptModuleRefs.join(", ")}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
