import { Injectable } from "@nestjs/common";
import type { SourceAsset } from "@ai-ugc/domain";
import { v4 as uuidv4 } from "uuid";
import { RegisterAssetRequestDto } from "./dto/register-asset-request.dto";

@Injectable()
export class AssetsService {
  private readonly items = new Map<string, SourceAsset[]>();

  async registerAsset(
    sessionId: string,
    input: RegisterAssetRequestDto,
  ): Promise<SourceAsset> {
    const asset: SourceAsset = {
      id: uuidv4(),
      generationSessionId: sessionId,
      assetType: input.assetType,
      storageKey: `sessions/${sessionId}/${input.fileName}`,
      mimeType: input.mimeType,
      fileName: input.fileName,
      fileSizeBytes: input.fileSizeBytes || 0,
      metadata: {},
      createdAt: new Date().toISOString(),
    };

    const assets = this.items.get(sessionId) || [];
    assets.push(asset);
    this.items.set(sessionId, assets);

    return asset;
  }

  async listAssets(sessionId: string): Promise<SourceAsset[]> {
    return this.items.get(sessionId) || [];
  }
}
