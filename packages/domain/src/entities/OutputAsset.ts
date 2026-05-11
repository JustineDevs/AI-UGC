export interface OutputAsset {
  id: string;
  generationSessionId: string;
  providerJobId?: string;
  assetType: string;
  storageKey?: string;
  textContent?: string;
  mimeType?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}
