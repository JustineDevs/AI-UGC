import type { CapabilityType, ProviderKey } from './capabilities';

export interface ProviderRoutingPolicy {
  defaultProvider: ProviderKey;
  fallbackOrder: ProviderKey[];
  preferredByCapability?: Partial<Record<CapabilityType, ProviderKey>>;
}

export const resolveProviderForCapability = (
  policy: ProviderRoutingPolicy,
  capabilityType: CapabilityType,
): ProviderKey[] => {
  const preferred = policy.preferredByCapability?.[capabilityType];
  const ordered = preferred
    ? [preferred, policy.defaultProvider, ...policy.fallbackOrder]
    : [policy.defaultProvider, ...policy.fallbackOrder];

  return [...new Set(ordered)];
};
