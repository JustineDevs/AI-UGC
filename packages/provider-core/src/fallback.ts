import type { CapabilityType } from './capabilities';
import type { ProviderRegistry } from './provider-registry';
import { resolveProviderForCapability, type ProviderRoutingPolicy } from './routing-policy';

export const resolveAdaptersForCapability = (
  registry: ProviderRegistry,
  policy: ProviderRoutingPolicy,
  capabilityType: CapabilityType,
) =>
  resolveProviderForCapability(policy, capabilityType)
    .map((providerKey) => registry.get(providerKey))
    .filter((adapter): adapter is NonNullable<typeof adapter> => Boolean(adapter));
