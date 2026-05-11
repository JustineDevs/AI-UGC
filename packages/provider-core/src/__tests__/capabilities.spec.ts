import { findCapabilityEntry } from '../capability-matrix';

describe('findCapabilityEntry', () => {
  it('finds a capability entry for a provider', () => {
    const entry = findCapabilityEntry(
      [
        {
          providerKey: 'laozhang',
          capabilityType: 'prompt_generation',
          modelKey: 'gpt-5',
          supportsAsync: false,
          supportsWebhook: false,
          inputModes: ['text'],
          outputModes: ['text'],
        },
      ],
      'laozhang',
      'prompt_generation',
    );

    expect(entry?.modelKey).toBe('gpt-5');
  });
});
