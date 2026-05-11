import type {
  ProviderCapability,
  ProviderProfileDraft,
  ProviderKey,
} from "./types";

const capabilityOptions: ProviderCapability[] = [
  "prompt_generation",
  "video_generation",
  "image_generation",
  "status_polling",
  "moderation",
];

interface ProviderProfileFormProps {
  value: ProviderProfileDraft;
  onChange: (value: ProviderProfileDraft) => void;
  onProviderChange: (providerKey: ProviderKey) => void;
}

function toggleCapability(
  capabilities: ProviderCapability[],
  capability: ProviderCapability,
): ProviderCapability[] {
  return capabilities.includes(capability)
    ? capabilities.filter((value) => value !== capability)
    : [...capabilities, capability];
}

export function ProviderProfileForm({
  value,
  onChange,
  onProviderChange,
}: ProviderProfileFormProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Provider Profile
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Configure runtime defaults and routing inputs for one gateway.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-gray-800">Provider</span>
          <select
            value={value.providerKey}
            onChange={(event) =>
              onProviderChange(event.target.value as ProviderKey)
            }
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="laozhang">LaoZhang</option>
            <option value="apimart">APIMart</option>
            <option value="sample-provider">Sample Provider</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-800">
            Provider key
          </span>
          <input
            type="text"
            value={value.providerKey}
            onChange={(event) =>
              onChange({
                ...value,
                providerKey: event.target.value,
              })
            }
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-800">
            Display name
          </span>
          <input
            type="text"
            value={value.displayName}
            onChange={(event) =>
              onChange({
                ...value,
                displayName: event.target.value,
              })
            }
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-gray-800">Base URL</span>
          <input
            type="url"
            value={value.baseUrl}
            onChange={(event) =>
              onChange({
                ...value,
                baseUrl: event.target.value,
              })
            }
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-800">
            API key env var / secret ref
          </span>
          <input
            type="text"
            value={value.apiKeySecretRef}
            onChange={(event) =>
              onChange({
                ...value,
                apiKeySecretRef: event.target.value,
              })
            }
            placeholder="LAOZHANG_API_KEY"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-gray-800">Text model</span>
          <input
            type="text"
            value={value.defaultTextModel}
            onChange={(event) =>
              onChange({
                ...value,
                defaultTextModel: event.target.value,
              })
            }
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-800">Video model</span>
          <input
            type="text"
            value={value.defaultVideoModel}
            onChange={(event) =>
              onChange({
                ...value,
                defaultVideoModel: event.target.value,
              })
            }
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-800">Image model</span>
          <input
            type="text"
            value={value.defaultImageModel}
            onChange={(event) =>
              onChange({
                ...value,
                defaultImageModel: event.target.value,
              })
            }
            placeholder="optional"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-800">
          Enabled capabilities
        </p>
        <div className="flex flex-wrap gap-2">
          {capabilityOptions.map((capability) => {
            const isSelected = value.enabledCapabilities.includes(capability);

            return (
              <button
                key={capability}
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    enabledCapabilities: toggleCapability(
                      value.enabledCapabilities,
                      capability,
                    ),
                  })
                }
                className={`rounded-full px-3 py-2 text-sm transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {capability}
              </button>
            );
          })}
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-gray-800">
          Fallback priority
        </span>
        <input
          type="number"
          min="1"
          value={value.fallbackPriority}
          onChange={(event) =>
            onChange({
              ...value,
              fallbackPriority: event.target.value,
            })
          }
          placeholder="1"
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </label>
    </section>
  );
}
