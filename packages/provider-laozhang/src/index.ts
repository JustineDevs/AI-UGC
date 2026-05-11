import { loadProviderEnvironments } from '@ai-ugc/config';
import type {
  CapabilityMatrixEntry,
  ProviderAdapter,
  ProviderExecutionRequest,
  ProviderExecutionResult,
  ProviderValidationResult,
} from '@ai-ugc/provider-core';
import { executeLaozhangChat } from './chat';
import { executeLaozhangVideo } from './video';

const providerEnv = loadProviderEnvironments().laozhang;

const capabilities: CapabilityMatrixEntry[] = [
  {
    providerKey: 'laozhang',
    capabilityType: 'prompt_generation',
    modelKey: providerEnv.textModel,
    supportsAsync: false,
    supportsWebhook: false,
    inputModes: ['text'],
    outputModes: ['text'],
  },
  {
    providerKey: 'laozhang',
    capabilityType: 'video_generation',
    modelKey: providerEnv.videoModel,
    supportsAsync: true,
    supportsWebhook: false,
    inputModes: ['text', 'image'],
    outputModes: ['video'],
  },
];

export const laozhangAdapter: ProviderAdapter = {
  providerKey: 'laozhang',
  capabilities,
  async validate(): Promise<ProviderValidationResult> {
    return {
      providerKey: 'laozhang',
      status: providerEnv.apiKey ? 'validated' : 'invalid',
      enabledCapabilities: capabilities.map((entry) => entry.capabilityType),
      notes: providerEnv.apiKey ? [] : ['Missing LAOZHANG_API_KEY'],
    };
  },
  async execute(
    request: ProviderExecutionRequest,
  ): Promise<ProviderExecutionResult> {
    if (request.capabilityType === 'video_generation') {
      return executeLaozhangVideo(
        providerEnv.apiKey,
        providerEnv.baseUrl,
        request,
      );
    }

    return executeLaozhangChat(
      providerEnv.apiKey,
      providerEnv.baseUrl,
      request,
    );
  },
};
