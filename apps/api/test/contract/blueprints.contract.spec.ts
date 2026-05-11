import { WorkflowBlueprintMemoryRepository } from "../../src/infrastructure/persistence/workflow-blueprint.memory-repository";
import { BlueprintsService } from "../../src/modules/blueprints/blueprints.service";

describe("blueprints contract", () => {
  it("creates a blueprint contract shape", async () => {
    const service = new BlueprintsService(
      new WorkflowBlueprintMemoryRepository(),
    );

    const blueprint = await service.createBlueprint("workspace-1", {
      name: "Niche Default",
      nichePackKey: "ecommerce-product-ads",
      intakeSchema: { required: ["productName"] },
      stepGraph: { start: "collect-inputs" },
    });

    expect(blueprint).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        workspaceTemplateId: "workspace-1",
        name: "Niche Default",
      }),
    );
  });
});
