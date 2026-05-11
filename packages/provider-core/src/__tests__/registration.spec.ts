import { ProviderRegistry } from '../provider-registry';

describe('ProviderRegistry', () => {
  it('registers and resolves adapters by key', () => {
    const registry = new ProviderRegistry();

    registry.register({
      providerKey: 'laozhang',
      capabilities: [],
      validate: async () => ({
        providerKey: 'laozhang',
        status: 'validated',
        enabledCapabilities: [],
      }),
      execute: async () => ({
        providerKey: 'laozhang',
        output: {},
      }),
    });

    expect(registry.get('laozhang')?.providerKey).toBe('laozhang');
  });
});
