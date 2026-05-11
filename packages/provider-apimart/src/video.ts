import axios from 'axios';
import type { ProviderExecutionRequest, ProviderExecutionResult } from '@ai-ugc/provider-core';

export const executeApimartVideo = async (
  apiKey: string,
  baseUrl: string,
  request: ProviderExecutionRequest,
): Promise<ProviderExecutionResult> => {
  const response = await axios.post(
    `${baseUrl}/videos`,
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
    externalTaskId: response.data?.id as string | undefined,
    output: response.data as Record<string, unknown>,
  };
};
