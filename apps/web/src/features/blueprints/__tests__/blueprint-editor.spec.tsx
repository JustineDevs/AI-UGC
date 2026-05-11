import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BlueprintEditorPage } from "../BlueprintEditorPage";

const apiMocks = vi.hoisted(() => ({
  createBlueprint: vi.fn(),
}));

vi.mock("../../../services/api", () => ({
  createBlueprint: apiMocks.createBlueprint,
}));

describe("BlueprintEditorPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();

    window.localStorage.setItem(
      "ai-ugc.workspace-setup-draft",
      JSON.stringify({
        workspaceId: "workspace-1",
        name: "AI-UGC Workspace",
        slug: "ai-ugc-workspace",
        defaultProviderKey: "laozhang",
        nicheMode: "bundled",
        selectedBundledKey: "ecommerce-product-ads",
        customNicheInput: {
          label: "Custom",
          channelTargets: ["tiktok"],
          requiredAssetTypes: ["source_video", "product_image"],
          promptModules: ["hook", "offer", "cta"],
        },
        projectProfile: {
          name: "Launch Campaign",
          selectedBlueprint: "niche-default",
          brandVoice: "Specific, credible, creator-native, benefit-led.",
          audience: "Warm prospects",
          offerDetails: "Starter bundle",
          claimsPolicy: ["Use only supportable product claims"],
          channelTargets: ["tiktok", "meta-ads"],
          forbiddenTerms: ["guaranteed", "miracle"],
          assetConstraints: {
            aspectRatio: "9:16",
            durationSeconds: "15-30s",
            ctaPolicy: "One direct CTA near the end of the video",
          },
        },
      }),
    );

    apiMocks.createBlueprint.mockResolvedValue({
      id: "blueprint-1",
    });
  });

  it("persists the edited blueprint through the API", async () => {
    render(<BlueprintEditorPage />);

    fireEvent.click(screen.getByRole("button", { name: "Persist Blueprint" }));

    await waitFor(() =>
      expect(apiMocks.createBlueprint).toHaveBeenCalledTimes(1),
    );

    expect(apiMocks.createBlueprint).toHaveBeenCalledWith("workspace-1", {
      name: "interactive-blueprint",
      nichePackKey: "ecommerce-product-ads",
      intakeSchema: {
        requiredAssetTypes: ["source_video", "product_image"],
        channelTargets: ["tiktok", "meta-ads"],
        defaultProviderKey: "laozhang",
      },
      stepGraph: expect.objectContaining({
        start: "collect-inputs",
        steps: expect.any(Array),
      }),
    });

    await waitFor(() =>
      expect(
        screen.getByText("Blueprint persisted as blueprint-1."),
      ).toBeInTheDocument(),
    );
  });
});
