import type { ProviderValidationResult } from "./types";

interface ProviderValidationPanelProps {
  result: ProviderValidationResult | null;
  isValidating: boolean;
  onValidate: () => void;
}

export function ProviderValidationPanel({
  result,
  isValidating,
  onValidate,
}: ProviderValidationPanelProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Validation</h2>
          <p className="text-sm text-gray-600 mt-1">
            Uses the current API validate endpoint to confirm provider
            readiness.
          </p>
        </div>
        <button
          type="button"
          onClick={onValidate}
          disabled={isValidating}
          className="rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isValidating ? "Validating..." : "Run Validation"}
        </button>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Validation currently checks the API app environment. The saved secret
        ref is captured for provider profile persistence but is not injected
        into the validation request yet.
      </div>

      {result ? (
        <div
          className={`rounded-xl border p-4 ${
            result.status === "validated"
              ? "border-emerald-200 bg-emerald-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <p className="text-sm font-medium text-gray-900">
            Status: <span className="capitalize">{result.status}</span>
          </p>
          <p className="mt-2 text-sm text-gray-700">
            Capabilities: {result.enabledCapabilities.join(", ") || "None"}
          </p>
          {result.notes && result.notes.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-gray-700">
              {result.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
          No validation run yet.
        </div>
      )}
    </section>
  );
}
