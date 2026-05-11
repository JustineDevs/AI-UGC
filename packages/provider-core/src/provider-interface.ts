import type { CapabilityMatrixEntry, CapabilityType, ProviderKey } from './capabilities';

export interface ProviderValidationResult {
  providerKey: ProviderKey;
  status: 'validated' | 'invalid';
  enabledCapabilities: CapabilityType[];
  notes?: string[];
}

export interface ProviderExecutionRequest {
  capabilityType: CapabilityType;
  model: string;
  payload: Record<string, unknown>;
}

export interface ProviderExecutionResult {
  providerKey: ProviderKey;
  externalTaskId?: string;
  output: Record<string, unknown>;
}

export interface ProviderAdapter {
  readonly providerKey: ProviderKey;
  readonly capabilities: CapabilityMatrixEntry[];
  validate(): Promise<ProviderValidationResult>;
  execute(request: ProviderExecutionRequest): Promise<ProviderExecutionResult>;
}
