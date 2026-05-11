export type CapabilityType =
  | 'chat'
  | 'prompt_generation'
  | 'image_generation'
  | 'video_generation'
  | 'status_polling'
  | 'moderation';

export type ProviderKey = string;

export interface CapabilityMatrixEntry {
  providerKey: ProviderKey;
  capabilityType: CapabilityType;
  modelKey: string;
  supportsAsync: boolean;
  supportsWebhook: boolean;
  inputModes: string[];
  outputModes: string[];
  notes?: string;
}
