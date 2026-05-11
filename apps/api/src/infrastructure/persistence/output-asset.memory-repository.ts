import { Injectable } from "@nestjs/common";
import type { OutputAsset } from "@ai-ugc/domain";
import type { OutputAssetRepository } from "@ai-ugc/domain";
import { loadRecord, upsertRecord } from "../database/database";

@Injectable()
export class OutputAssetMemoryRepository implements OutputAssetRepository {
  async save(asset: OutputAsset): Promise<OutputAsset> {
    upsertRecord("output_assets", asset.id, asset, {
      generation_session_id: asset.generationSessionId,
      provider_job_id: asset.providerJobId || "",
      asset_type: asset.assetType,
    });
    return asset;
  }

  async findBySession(generationSessionId: string): Promise<OutputAsset[]> {
    return loadRecord<OutputAsset>(
      "output_assets",
      "generation_session_id = ?",
      [generationSessionId],
    );
  }
}
