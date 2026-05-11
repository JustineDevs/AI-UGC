import type { CapabilityMatrixEntry, CapabilityType, ProviderKey } from './capabilities';

export const findCapabilityEntry = (
  matrix: CapabilityMatrixEntry[],
  providerKey: ProviderKey,
  capabilityType: CapabilityType,
): CapabilityMatrixEntry | undefined =>
  matrix.find(
    (entry) =>
      entry.providerKey === providerKey &&
      entry.capabilityType === capabilityType,
  );
