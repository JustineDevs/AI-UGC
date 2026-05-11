import { createProviderRegistry } from "@ai-ugc/provider-core";
import { apimartAdapter } from "@ai-ugc/provider-apimart";
import { laozhangAdapter } from "@ai-ugc/provider-laozhang";
import { sampleProviderAdapter } from "@ai-ugc/provider-core/src/stubs/sample-provider";
import { ProviderValidationService } from "./provider-validation.service";

describe("ProviderValidationService", () => {
  it("returns a validation result for LaoZhang", async () => {
    const service = new ProviderValidationService(
      createProviderRegistry([
        laozhangAdapter,
        apimartAdapter,
        sampleProviderAdapter,
      ]),
    );

    const result = await service.validate("laozhang");

    expect(result.providerKey).toBe("laozhang");
    expect(Array.isArray(result.enabledCapabilities)).toBe(true);
  });

  it("returns a validation result for APIMart", async () => {
    const service = new ProviderValidationService(
      createProviderRegistry([
        laozhangAdapter,
        apimartAdapter,
        sampleProviderAdapter,
      ]),
    );

    const result = await service.validate("apimart");

    expect(result.providerKey).toBe("apimart");
    expect(Array.isArray(result.enabledCapabilities)).toBe(true);
  });

  it("returns a validation result for a sample provider", async () => {
    const service = new ProviderValidationService(
      createProviderRegistry([
        laozhangAdapter,
        apimartAdapter,
        sampleProviderAdapter,
      ]),
    );

    const result = await service.validate("sample-provider");

    expect(result.providerKey).toBe("sample-provider");
  });
});
