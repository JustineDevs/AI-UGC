import type { ProviderAdapter } from './provider-interface';
import type { ProviderKey } from './capabilities';

export class ProviderRegistry {
  private readonly adapters = new Map<ProviderKey, ProviderAdapter>();

  register(adapter: ProviderAdapter): void {
    this.adapters.set(adapter.providerKey, adapter);
  }

  get(providerKey: ProviderKey): ProviderAdapter | undefined {
    return this.adapters.get(providerKey);
  }

  list(): ProviderAdapter[] {
    return [...this.adapters.values()];
  }
}

export const createProviderRegistry = (
  adapters: ProviderAdapter[],
): ProviderRegistry => {
  const registry = new ProviderRegistry();
  adapters.forEach((adapter) => registry.register(adapter));
  return registry;
};
