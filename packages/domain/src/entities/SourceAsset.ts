export interface SourceAsset {
  id: string;
  generationSessionId: string;
  assetType: string;
  storageKey: string;
  mimeType: string;
  fileName: string;
  fileSizeBytes: number;
  metadata: Record<string, unknown>;
  createdAt: string;
}
