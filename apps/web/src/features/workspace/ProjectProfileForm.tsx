import type { ProjectProfileDraft } from "./types";

const channelOptions = ["tiktok", "meta-ads", "youtube-shorts", "landing-page"];

interface ProjectProfileFormProps {
  value: ProjectProfileDraft;
  onChange: (value: ProjectProfileDraft) => void;
}

function toggleValue(currentValues: string[], nextValue: string): string[] {
  return currentValues.includes(nextValue)
    ? currentValues.filter((value) => value !== nextValue)
    : [...currentValues, nextValue];
}

function parseMultiLineValues(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function ProjectProfileForm({
  value,
  onChange,
}: ProjectProfileFormProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Project Profile</h2>
        <p className="text-sm text-gray-600 mt-1">
          Capture reusable campaign rules that future sessions inherit.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-gray-800">
            Project name
          </span>
          <input
            type="text"
            value={value.name}
            onChange={(event) =>
              onChange({
                ...value,
                name: event.target.value,
              })
            }
            placeholder="Spring launch campaign"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-800">
            Selected blueprint
          </span>
          <select
            value={value.selectedBlueprint}
            onChange={(event) =>
              onChange({
                ...value,
                selectedBlueprint: event.target.value,
              })
            }
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="niche-default">Niche default blueprint</option>
            <option value="direct-response">Direct response ads</option>
            <option value="founder-story">Founder story organic</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-gray-800">Brand voice</span>
        <textarea
          value={value.brandVoice}
          onChange={(event) =>
            onChange({
              ...value,
              brandVoice: event.target.value,
            })
          }
          rows={3}
          placeholder="Confident, evidence-led, conversational without hype."
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-gray-800">Audience</span>
          <textarea
            value={value.audience}
            onChange={(event) =>
              onChange({
                ...value,
                audience: event.target.value,
              })
            }
            rows={4}
            placeholder="Busy DTC buyers comparing hydration serums."
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-800">
            Offer details
          </span>
          <textarea
            value={value.offerDetails}
            onChange={(event) =>
              onChange({
                ...value,
                offerDetails: event.target.value,
              })
            }
            rows={4}
            placeholder="Starter bundle, 15% off, free shipping this week."
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

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
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-gray-800">
            Claims policy
          </span>
          <textarea
            value={value.claimsPolicy.join("\n")}
            onChange={(event) =>
              onChange({
                ...value,
                claimsPolicy: parseMultiLineValues(event.target.value),
              })
            }
            rows={4}
            placeholder={"Avoid medical claims\nRequire proof-backed benefits"}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-800">
            Forbidden terms
          </span>
          <textarea
            value={value.forbiddenTerms.join("\n")}
            onChange={(event) =>
              onChange({
                ...value,
                forbiddenTerms: parseMultiLineValues(event.target.value),
              })
            }
            rows={4}
            placeholder={"cure\nmiracle\ninstant results"}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-gray-800">
            Aspect ratio
          </span>
          <input
            type="text"
            value={value.assetConstraints.aspectRatio}
            onChange={(event) =>
              onChange({
                ...value,
                assetConstraints: {
                  ...value.assetConstraints,
                  aspectRatio: event.target.value,
                },
              })
            }
            placeholder="9:16"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-800">
            Duration target
          </span>
          <input
            type="text"
            value={value.assetConstraints.durationSeconds}
            onChange={(event) =>
              onChange({
                ...value,
                assetConstraints: {
                  ...value.assetConstraints,
                  durationSeconds: event.target.value,
                },
              })
            }
            placeholder="15-30s"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-800">CTA policy</span>
          <input
            type="text"
            value={value.assetConstraints.ctaPolicy}
            onChange={(event) =>
              onChange({
                ...value,
                assetConstraints: {
                  ...value.assetConstraints,
                  ctaPolicy: event.target.value,
                },
              })
            }
            placeholder="Single CTA in final 3 seconds"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>
    </section>
  );
}
