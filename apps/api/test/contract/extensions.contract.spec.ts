import { ProviderRegistry } from "../../src/../../../packages/provider-core/src/provider-registry";
import { apimartAdapter } from "../../src/../../../packages/provider-apimart/src/index";
import { laozhangAdapter } from "../../src/../../../packages/provider-laozhang/src/index";

describe("extensions contract", () => {
  it("registers supported provider adapters", () => {
    const registry = new ProviderRegistry();

    registry.register(laozhangAdapter);
    registry.register(apimartAdapter);

    expect(registry.list()).toHaveLength(2);
  });
});
