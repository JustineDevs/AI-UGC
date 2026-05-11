import { loadProviderEnvironments } from '@ai-ugc/config';
import type {
  CapabilityMatrixEntry,
  ProviderAdapter,
  ProviderExecutionRequest,
  ProviderExecutionResult,
  ProviderValidationResult,
} from '@ai-ugc/provider-core';
import { executeApimartChat } from './chat';
import { executeApimartVideo } from './video';

const providerEnv = loadProviderEnvironments().apimart;

const capabilities: CapabilityMatrixEntry[] = [
  {
    providerKey: 'apimart',
    capabilityType: 'prompt_generation',
    modelKey: providerEnv.textModel,
    supportsAsync: false,
    supportsWebhook: false,
    inputModes: ['text'],
    outputModes: ['text'],
  },
  {
    providerKey: 'apimart',
    capabilityType: 'video_generation',
    modelKey: providerEnv.videoModel,
    supportsAsync: true,
    supportsWebhook: true,
    inputModes: ['text', 'image'],
    outputModes: ['video'],
  },
];

export const apimartAdapter: ProviderAdapter = {
  providerKey: 'apimart',
  capabilities,
  async validate(): Promise<ProviderValidationResult> {
    return {
      providerKey: 'apimart',
      status: providerEnv.apiKey ? 'validated' : 'invalid',
      enabledCapabilities: capabilities.map((entry) => entry.capabilityType),
      notes: providerEnv.apiKey ? [] : ['Missing APIMART_API_KEY'],
    };
  },
  async execute(
    request: ProviderExecutionRequest,
  ): Promise<ProviderExecutionResult> {
    if (request.capabilityType === 'video_generation') {
      return executeApimartVideo(
        providerEnv.apiKey,
        providerEnv.baseUrl,
        request,
      );
    }

    return executeApimartChat(
      providerEnv.apiKey,
      providerEnv.baseUrl,
      request,
    );
  },
};
