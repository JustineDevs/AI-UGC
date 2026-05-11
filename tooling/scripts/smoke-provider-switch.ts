const {
  createProviderRegistry,
  resolveProviderForCapability,
  sampleProviderAdapter,
} = require("../../packages/provider-core/src");
const { apimartAdapter } = require("../../packages/provider-apimart/src");
const { laozhangAdapter } = require("../../packages/provider-laozhang/src");

async function main() {
  const registry = createProviderRegistry([
    laozhangAdapter,
    apimartAdapter,
    sampleProviderAdapter,
  ]);

  const videoProviders = resolveProviderForCapability(
    {
      defaultProvider: "laozhang",
      fallbackOrder: ["apimart", "sample-provider"],
      preferredByCapability: {
        video_generation: "apimart",
      },
    },
    "video_generation",
  );

  const validation = await Promise.all(
    registry.list().map(async (adapter: { validate: () => Promise<unknown> }) =>
      adapter.validate(),
    ),
  );

  console.log(
    JSON.stringify(
      {
        registeredProviders: registry
          .list()
          .map((adapter: { providerKey: string }) => adapter.providerKey),
        videoProviders,
        validation,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
