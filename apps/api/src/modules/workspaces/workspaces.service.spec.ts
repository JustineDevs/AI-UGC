import { WorkspaceTemplateMemoryRepository } from "../../infrastructure/persistence/workspace-template.memory-repository";
import { WorkspacesService } from "./workspaces.service";

describe("WorkspacesService", () => {
  it("creates a workspace with the provided niche pack keys", async () => {
    const suffix = Date.now().toString();
    const repository = new WorkspaceTemplateMemoryRepository();
    const service = new WorkspacesService(repository);

    const workspace = await service.createWorkspace({
      name: "AI-UGC Workspace",
      slug: `ai-ugc-workspace-${suffix}`,
      enabledNichePackKeys: ["ecommerce-product-ads"],
    });

    expect(workspace.id).toBeDefined();
    expect(workspace.slug).toBe(`ai-ugc-workspace-${suffix}`);
    expect(workspace.enabledNichePackKeys).toEqual(["ecommerce-product-ads"]);
  });
});
