import { resolveProviderForCapability } from '../routing-policy';

describe('resolveProviderForCapability', () => {
  it('returns preferred provider first and deduplicates order', () => {
    const providers = resolveProviderForCapability(
      {
        defaultProvider: 'laozhang',
        fallbackOrder: ['apimart'],
        preferredByCapability: {
          video_generation: 'apimart',
        },
      },
      'video_generation',
    );

    expect(providers).toEqual(['apimart', 'laozhang']);
  });
});
