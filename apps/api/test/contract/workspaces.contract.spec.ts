import { WorkspaceTemplateMemoryRepository } from "../../src/infrastructure/persistence/workspace-template.memory-repository";
import { WorkspacesService } from "../../src/modules/workspaces/workspaces.service";

describe("workspaces contract", () => {
  it("creates a workspace contract shape", async () => {
    const suffix = Date.now().toString();
    const service = new WorkspacesService(
      new WorkspaceTemplateMemoryRepository(),
    );

    const workspace = await service.createWorkspace({
      name: "Workspace",
      slug: `workspace-${suffix}`,
      enabledNichePackKeys: ["ecommerce-product-ads"],
    });

    expect(workspace).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "Workspace",
        slug: `workspace-${suffix}`,
        enabledNichePackKeys: ["ecommerce-product-ads"],
      }),
    );
  });
});
