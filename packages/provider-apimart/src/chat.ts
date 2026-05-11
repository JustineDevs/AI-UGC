import axios from 'axios';
import type { ProviderExecutionRequest, ProviderExecutionResult } from '@ai-ugc/provider-core';

export const executeApimartChat = async (
  apiKey: string,
  baseUrl: string,
  request: ProviderExecutionRequest,
): Promise<ProviderExecutionResult> => {
  const response = await axios.post(
    `${baseUrl}/chat/completions`,
    request.payload,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return {
    providerKey: 'apimart',
    output: response.data as Record<string, unknown>,
  };
};
