import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SessionStartPage } from "../SessionStartPage";

const apiMocks = vi.hoisted(() => ({
  createGenerationSession: vi.fn(),
  runGenerationSession: vi.fn(),
}));

vi.mock("../../../services/api", () => ({
  createGenerationSession: apiMocks.createGenerationSession,
  runGenerationSession: apiMocks.runGenerationSession,
}));

describe("SessionStartPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();

    window.localStorage.setItem(
      "ai-ugc.workspace-setup-draft",
      JSON.stringify({
        workspaceId: "workspace-1",
        projectId: "project-1",
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
          selectedBlueprint: "blueprint-1",
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

    apiMocks.createGenerationSession.mockResolvedValue({
      id: "session-1",
      status: "created",
    });
    apiMocks.runGenerationSession.mockResolvedValue({
      id: "session-1",
      status: "running",
    });
  });

  it("creates and runs a generation session through the API", async () => {
    render(<SessionStartPage />);

    fireEvent.click(screen.getByRole("button", { name: "Launch Session" }));

    await waitFor(() =>
      expect(apiMocks.createGenerationSession).toHaveBeenCalledWith(
        "project-1",
        {
          channelTarget: "tiktok",
          campaignInputs: {
            workspaceId: "workspace-1",
          },
        },
      ),
    );

    expect(apiMocks.runGenerationSession).toHaveBeenCalledWith("session-1");

    await waitFor(() =>
      expect(
        screen.getByText(
          "Generation session session-1 launched with status running.",
        ),
      ).toBeInTheDocument(),
    );
  });
});
