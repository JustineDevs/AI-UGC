import { apimartAdapter } from "@ai-ugc/provider-apimart";
import {
  createProviderRegistry,
  sampleProviderAdapter,
} from "@ai-ugc/provider-core";
import { laozhangAdapter } from "@ai-ugc/provider-laozhang";
import { ProviderProfileMemoryRepository } from "../../src/infrastructure/persistence/provider-profile.memory-repository";
import { ProviderValidationService } from "../../src/modules/providers/provider-validation.service";
import { ProvidersService } from "../../src/modules/providers/providers.service";

describe("providers contract", () => {
  it("validates a provider key", async () => {
    const service = new ProviderValidationService(
      createProviderRegistry([
        laozhangAdapter,
        apimartAdapter,
        sampleProviderAdapter,
      ]),
    );

    await expect(service.validate("laozhang")).resolves.toEqual(
      expect.objectContaining({
        providerKey: "laozhang",
      }),
    );
  });

  it("persists a provider profile shape", async () => {
    const validationService = new ProviderValidationService(
      createProviderRegistry([
        laozhangAdapter,
        apimartAdapter,
        sampleProviderAdapter,
      ]),
    );
    const service = new ProvidersService(
      new ProviderProfileMemoryRepository(),
      validationService,
    );

    const profile = await service.upsertProfile("workspace-1", {
      providerKey: "apimart",
      displayName: "APIMart",
      baseUrl: "https://api.apimart.ai/v1",
      apiKeySecretRef: "APIMART_API_KEY",
      defaultTextModel: "gpt-5",
      defaultVideoModel: "sora2",
      defaultImageModel: undefined,
      enabledCapabilities: ["prompt_generation", "video_generation"],
      fallbackPriority: 2,
    });

    expect(profile).toEqual(
      expect.objectContaining({
        workspaceTemplateId: "workspace-1",
        providerKey: "apimart",
        baseUrl: "https://api.apimart.ai/v1",
      }),
    );
  });
});
