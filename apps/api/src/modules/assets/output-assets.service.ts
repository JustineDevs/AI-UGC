import { Injectable } from "@nestjs/common";
import type { OutputAsset } from "@ai-ugc/domain";
import { v4 as uuidv4 } from "uuid";
import { OutputAssetMemoryRepository } from "../../infrastructure/persistence/output-asset.memory-repository";

@Injectable()
export class OutputAssetsService {
  constructor(private readonly repository: OutputAssetMemoryRepository) {}

  async createTextAsset(input: {
    sessionId: string;
    providerJobId?: string;
    assetType: string;
    textContent: string;
    metadata?: Record<string, unknown>;
  }): Promise<OutputAsset> {
    const asset: OutputAsset = {
      id: uuidv4(),
      generationSessionId: input.sessionId,
      providerJobId: input.providerJobId,
      assetType: input.assetType,
      textContent: input.textContent,
      metadata: input.metadata || {},
      createdAt: new Date().toISOString(),
    };

    return this.repository.save(asset);
  }

  async listBySession(sessionId: string): Promise<OutputAsset[]> {
    return this.repository.findBySession(sessionId);
  }
}
