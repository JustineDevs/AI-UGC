import { Module } from "@nestjs/common";
import { OutputAssetMemoryRepository } from "../../infrastructure/persistence/output-asset.memory-repository";
import { AssetsController } from "./assets.controller";
import { AssetsService } from "./assets.service";
import { OutputAssetsService } from "./output-assets.service";

@Module({
  controllers: [AssetsController],
  providers: [AssetsService, OutputAssetMemoryRepository, OutputAssetsService],
  exports: [AssetsService, OutputAssetMemoryRepository, OutputAssetsService],
})
export class AssetsModule {}
