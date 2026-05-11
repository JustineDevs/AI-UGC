import {
  loadProviderEnvironments,
  type ProviderEnvironment,
  type ProviderKey,
} from './providers';
import {
  loadStorageEnvironment,
  type StorageEnvironment,
} from './storage';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  defaultProvider: ProviderKey;
  corsOrigin: string;
  cors: {
    origin: string;
  };
  gemini: {
    apiKey: string;
    model: string;
  };
  providers: Record<ProviderKey, ProviderEnvironment>;
  openai: {
    apiKey: string;
    baseUrl: string;
    gptModel: string;
    soraModel: string;
  };
  aws: StorageEnvironment;
}

export const loadAppConfig = (): AppConfig => {
  const providers = loadProviderEnvironments();
  const defaultProvider =
    (process.env.DEFAULT_PROVIDER as ProviderKey) || 'laozhang';
  const selectedProvider = providers[defaultProvider];

  return {
    port: Number.parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl:
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/ai_ugc_template',
    defaultProvider,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    },
    gemini: {
      apiKey:
        process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '',
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    },
    providers,
    openai: {
      apiKey: selectedProvider.apiKey,
      baseUrl: selectedProvider.baseUrl,
      gptModel: selectedProvider.textModel,
      soraModel: selectedProvider.videoModel,
    },
    aws: loadStorageEnvironment(),
  };
};

export const validateAppConfig = (config: AppConfig): void => {
  const requiredFields = [
    ['AWS_ACCESS_KEY_ID', config.aws.accessKeyId],
    ['AWS_SECRET_ACCESS_KEY', config.aws.secretAccessKey],
    ['AWS_S3_BUCKET', config.aws.bucket],
    ['GEMINI_API_KEY', config.gemini.apiKey],
  ].filter(([, value]) => !value);

  if (requiredFields.length > 0) {
    throw new Error(
      `Missing required environment variables: ${requiredFields
        .map(([key]) => key)
        .join(', ')}`,
    );
  }
};

export type { ProviderEnvironment, ProviderKey, StorageEnvironment };
export { loadProviderEnvironments, loadStorageEnvironment };
