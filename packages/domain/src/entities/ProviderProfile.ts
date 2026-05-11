export type ProviderStatus = 'draft' | 'validated' | 'disabled';
export type ProviderKey = string;

export interface ProviderProfile {
  id: string;
  workspaceTemplateId: string;
  providerKey: ProviderKey;
  displayName: string;
  baseUrl: string;
  apiKeySecretRef: string;
  defaultTextModel: string;
  defaultVideoModel: string;
  defaultImageModel?: string;
  enabledCapabilities: string[];
  fallbackPriority?: number;
  status: ProviderStatus;
  lastValidatedAt?: string;
}
