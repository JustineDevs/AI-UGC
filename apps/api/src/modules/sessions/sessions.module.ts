/**
 * SessionsModule
 *
 * Handles session creation and retrieval endpoints.
 */

import { Module } from "@nestjs/common";
import { GenerationSessionMemoryRepository } from "../../infrastructure/persistence/generation-session.memory-repository";
import { OutputAssetMemoryRepository } from "../../infrastructure/persistence/output-asset.memory-repository";
import { ProjectProfileMemoryRepository } from "../../infrastructure/persistence/project-profile.memory-repository";
import { ProviderJobMemoryRepository } from "../../infrastructure/persistence/provider-job.memory-repository";
import { OutputAssetsService } from "../assets/output-assets.service";
import { ProviderJobsService } from "../provider-jobs/provider-jobs.service";
import { SessionRunService } from "./session-run.service";
import { SessionStatusService } from "./session-status.service";
import { SessionsController } from "./sessions.controller";

@Module({
  controllers: [SessionsController],
  providers: [
    GenerationSessionMemoryRepository,
    OutputAssetMemoryRepository,
    ProjectProfileMemoryRepository,
    ProviderJobMemoryRepository,
    OutputAssetsService,
    ProviderJobsService,
    SessionRunService,
    SessionStatusService,
  ],
  exports: [
    GenerationSessionMemoryRepository,
    OutputAssetMemoryRepository,
    ProjectProfileMemoryRepository,
    ProviderJobMemoryRepository,
    OutputAssetsService,
    SessionRunService,
    SessionStatusService,
  ],
})
export class SessionsModule {}
