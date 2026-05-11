import type { ProviderAdapter } from '../provider-interface';

export const sampleProviderAdapter: ProviderAdapter = {
  providerKey: 'sample-provider',
  capabilities: [],
  async validate() {
    return {
      providerKey: 'sample-provider',
      status: 'validated',
      enabledCapabilities: [],
      notes: ['Sample stub only'],
    };
  },
  async execute() {
    return {
      providerKey: 'sample-provider',
      output: {},
    };
  },
};
