export type ProviderKey = string;

export interface ProviderEnvironment {
  provider: ProviderKey;
  apiKey: string;
  baseUrl: string;
  textModel: string;
  videoModel: string;
}

export const loadProviderEnvironments = (): Record<ProviderKey, ProviderEnvironment> => ({
  laozhang: {
    provider: 'laozhang',
    apiKey: process.env.LAOZHANG_API_KEY || '',
    baseUrl: process.env.LAOZHANG_API_BASE_URL || 'https://api.laozhang.ai/v1',
    textModel: process.env.LAOZHANG_TEXT_MODEL || 'gpt-5',
    videoModel: process.env.LAOZHANG_VIDEO_MODEL || 'sora-2',
  },
  apimart: {
    provider: 'apimart',
    apiKey: process.env.APIMART_API_KEY || '',
    baseUrl: process.env.APIMART_API_BASE_URL || 'https://api.apimart.ai/v1',
    textModel: process.env.APIMART_TEXT_MODEL || 'gpt-5',
    videoModel: process.env.APIMART_VIDEO_MODEL || 'sora2',
  },
});
