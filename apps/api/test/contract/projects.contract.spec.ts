import { ProjectProfileMemoryRepository } from "../../src/infrastructure/persistence/project-profile.memory-repository";
import { ProjectsService } from "../../src/modules/projects/projects.service";

describe("projects contract", () => {
  it("creates a project contract shape", async () => {
    const service = new ProjectsService(new ProjectProfileMemoryRepository());

    const project = await service.createProject("workspace-1", {
      name: "Launch Campaign",
      workflowBlueprintId: "blueprint-1",
      brandVoice: "Credible",
      audience: "Prospects",
      offerDetails: "Starter bundle",
      channelTargets: ["tiktok"],
    });

    expect(project).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        workspaceTemplateId: "workspace-1",
        workflowBlueprintId: "blueprint-1",
        channelTargets: ["tiktok"],
      }),
    );
  });
});
