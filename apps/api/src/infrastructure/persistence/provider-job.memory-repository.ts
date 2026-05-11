import { Injectable } from "@nestjs/common";
import type { ProviderJob } from "@ai-ugc/domain";
import type { ProviderJobRepository } from "@ai-ugc/domain";
import { loadRecord, upsertRecord } from "../database/database";

@Injectable()
export class ProviderJobMemoryRepository implements ProviderJobRepository {
  async save(job: ProviderJob): Promise<ProviderJob> {
    upsertRecord("provider_jobs", job.id, job, {
      generation_session_id: job.generationSessionId,
      provider_profile_id: job.providerProfileId,
      status: job.status,
      capability_type: job.capabilityType,
      model_key: job.modelKey,
    });
    return job;
  }

  async findBySession(generationSessionId: string): Promise<ProviderJob[]> {
    return loadRecord<ProviderJob>(
      "provider_jobs",
      "generation_session_id = ?",
      [generationSessionId],
    );
  }
}
