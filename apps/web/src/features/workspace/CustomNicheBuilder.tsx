import type { CustomNicheInput } from "@ai-ugc/workflow-engine";

const channelOptions = ["tiktok", "meta-ads", "youtube-shorts", "landing-page"];

const assetOptions = [
  "source_video",
  "product_image",
  "brand_guide",
  "ugc_reference",
  "script_reference",
];

const promptModuleOptions = [
  "hook",
  "problem",
  "offer",
  "ugc-social-proof",
  "service-proof",
  "location-cta",
  "cta",
];

interface CustomNicheBuilderProps {
  value: CustomNicheInput;
  onChange: (value: CustomNicheInput) => void;
}

function toggleValue(currentValues: string[], nextValue: string): string[] {
  return currentValues.includes(nextValue)
    ? currentValues.filter((value) => value !== nextValue)
    : [...currentValues, nextValue];
}

export function CustomNicheBuilder({
  value,
  onChange,
}: CustomNicheBuilderProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Custom Niche Builder
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Compose a reusable pack without editing source files.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-gray-800">
          Custom niche label
        </span>
        <input
          type="text"
          value={value.label}
          onChange={(event) =>
            onChange({
              ...value,
              label: event.target.value,
            })
          }
          placeholder="Skincare launch creatives"
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-800">Channel targets</p>
        <div className="flex flex-wrap gap-2">
          {channelOptions.map((option) => {
            const isActive = value.channelTargets.includes(option);

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    channelTargets: toggleValue(value.channelTargets, option),
                  })
                }
                className={`rounded-full px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-800">Required assets</p>
        <div className="flex flex-wrap gap-2">
          {assetOptions.map((option) => {
            const isActive = value.requiredAssetTypes.includes(option);

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    requiredAssetTypes: toggleValue(
                      value.requiredAssetTypes,
                      option,
                    ),
                  })
                }
                className={`rounded-full px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-800">Prompt modules</p>
        <div className="flex flex-wrap gap-2">
          {promptModuleOptions.map((option) => {
            const isActive = value.promptModules.includes(option);

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    promptModules: toggleValue(value.promptModules, option),
                  })
                }
                className={`rounded-full px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
