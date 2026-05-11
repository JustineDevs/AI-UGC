import { GenerationSessionMemoryRepository } from "../../src/infrastructure/persistence/generation-session.memory-repository";

describe("sessions contract", () => {
  it("stores and retrieves a generation session", async () => {
    const repository = new GenerationSessionMemoryRepository();
    const session = await repository.save({
      id: "session-1",
      projectProfileId: "project-1",
      workflowBlueprintSnapshot: { workflowBlueprintId: "bp-1" },
      status: "created",
      channelTarget: "tiktok",
      campaignInputs: {},
      providerRoutingTrace: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await expect(repository.findById("session-1")).resolves.toEqual(session);
  });
});
