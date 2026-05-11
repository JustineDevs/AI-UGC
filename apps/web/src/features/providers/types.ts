export type ProviderKey = string;

export type ProviderCapability =
  | "chat"
  | "prompt_generation"
  | "image_generation"
  | "video_generation"
  | "status_polling"
  | "moderation";

export interface ProviderProfileDraft {
  providerKey: ProviderKey;
  displayName: string;
  baseUrl: string;
  apiKeySecretRef: string;
  defaultTextModel: string;
  defaultVideoModel: string;
  defaultImageModel: string;
  enabledCapabilities: ProviderCapability[];
  fallbackPriority: string;
}

export interface ProviderValidationResult {
  providerKey: ProviderKey;
  status: "validated" | "invalid";
  enabledCapabilities: ProviderCapability[];
  notes?: string[];
}

export interface SavedProviderProfile {
  id: string;
  workspaceTemplateId: string;
  providerKey: ProviderKey;
  displayName: string;
  baseUrl: string;
  apiKeySecretRef: string;
  defaultTextModel: string;
  defaultVideoModel: string;
  defaultImageModel?: string;
  enabledCapabilities: ProviderCapability[];
  fallbackPriority?: number;
  status: "draft" | "validated" | "disabled";
  lastValidatedAt?: string;
}
