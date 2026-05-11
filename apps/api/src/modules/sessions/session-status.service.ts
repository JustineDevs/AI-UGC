import { Injectable } from "@nestjs/common";
import { GenerationSessionMemoryRepository } from "../../infrastructure/persistence/generation-session.memory-repository";
import { OutputAssetMemoryRepository } from "../../infrastructure/persistence/output-asset.memory-repository";
import { ProviderJobMemoryRepository } from "../../infrastructure/persistence/provider-job.memory-repository";
import { SessionService } from "../../common/session.service";

@Injectable()
export class SessionStatusService {
  constructor(
    private readonly generationSessionRepository: GenerationSessionMemoryRepository,
    private readonly outputAssetRepository: OutputAssetMemoryRepository,
    private readonly providerJobRepository: ProviderJobMemoryRepository,
    private readonly sessionService: SessionService,
  ) {}

  async getSession(sessionId: string) {
    const generationSession =
      await this.generationSessionRepository.findById(sessionId);
    if (generationSession) {
      const providerJobs =
        await this.providerJobRepository.findBySession(sessionId);
      const outputAssets =
        await this.outputAssetRepository.findBySession(sessionId);

      return {
        ...generationSession,
        providerJobs,
        outputAssets,
      };
    }

    return this.sessionService.getSession(sessionId) || null;
  }
}
