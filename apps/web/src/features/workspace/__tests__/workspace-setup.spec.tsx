import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WorkspaceSetupPage } from "../WorkspaceSetupPage";

const apiMocks = vi.hoisted(() => ({
  createWorkspaceTemplate: vi.fn(),
  createBlueprint: vi.fn(),
  createProjectProfile: vi.fn(),
}));

vi.mock("../../../services/api", () => ({
  createWorkspaceTemplate: apiMocks.createWorkspaceTemplate,
  createBlueprint: apiMocks.createBlueprint,
  createProjectProfile: apiMocks.createProjectProfile,
}));

describe("WorkspaceSetupPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();

    apiMocks.createWorkspaceTemplate.mockResolvedValue({
      id: "workspace-1",
      slug: "ai-ugc-workspace",
      name: "AI-UGC Workspace",
    });
    apiMocks.createBlueprint.mockResolvedValue({
      id: "blueprint-1",
      name: "niche-default",
    });
    apiMocks.createProjectProfile.mockResolvedValue({
      id: "project-1",
      name: "Launch Campaign",
    });
  });

  it("persists the workspace, blueprint, and project through the API", async () => {
    render(<WorkspaceSetupPage />);

    expect(screen.getByText("Workspace Setup")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Save Workspace Draft" }),
    );

    await waitFor(() =>
      expect(apiMocks.createWorkspaceTemplate).toHaveBeenCalledWith({
        name: "AI-UGC Workspace",
        slug: "ai-ugc-workspace",
        enabledNichePackKeys: ["ecommerce-product-ads"],
      }),
    );

    expect(apiMocks.createBlueprint).toHaveBeenCalledWith("workspace-1", {
      name: "niche-default",
      nichePackKey: "ecommerce-product-ads",
      intakeSchema: {
        requiredAssetTypes: ["source_video", "product_image"],
        channelTargets: ["tiktok", "meta-ads"],
      },
      stepGraph: {
        start: "collect-inputs",
        steps: ["hook", "offer", "ugc-social-proof", "cta"],
      },
    });

    expect(apiMocks.createProjectProfile).toHaveBeenCalledWith("workspace-1", {
      name: "Launch Campaign",
      workflowBlueprintId: "blueprint-1",
      brandVoice: "Specific, credible, creator-native, benefit-led.",
      audience: "Warm prospects who need a clear before/after transformation.",
      offerDetails: "Starter bundle with a limited-time incentive.",
      channelTargets: ["tiktok", "meta-ads"],
    });

    await waitFor(() =>
      expect(
        screen.getByText(
          "Workspace persisted via API as ai-ugc-workspace; project Launch Campaign is ready for session launch.",
        ),
      ).toBeInTheDocument(),
    );
  });
});
