import { Injectable } from "@nestjs/common";
import type { ProviderJob } from "@ai-ugc/domain";
import { v4 as uuidv4 } from "uuid";
import { ProviderJobMemoryRepository } from "../../infrastructure/persistence/provider-job.memory-repository";

@Injectable()
export class ProviderJobsService {
  constructor(private readonly repository: ProviderJobMemoryRepository) {}

  async createQueuedJob(
    sessionId: string,
    capabilityType: string,
    modelKey: string,
    requestSummary: Record<string, unknown> = {},
    providerProfileId = "",
  ): Promise<ProviderJob> {
    const job: ProviderJob = {
      id: uuidv4(),
      generationSessionId: sessionId,
      providerProfileId,
      capabilityType,
      modelKey,
      requestSummary,
      status: "queued",
      statusHistory: [
        {
          status: "queued",
          at: new Date().toISOString(),
        },
      ],
      attemptCount: 0,
    };

    return this.repository.save(job);
  }

  async markRunning(
    job: ProviderJob,
    update: Partial<ProviderJob> = {},
  ): Promise<ProviderJob> {
    const runningJob: ProviderJob = {
      ...job,
      ...update,
      status: "running",
      attemptCount: job.attemptCount + 1,
      statusHistory: [
        ...job.statusHistory,
        { status: "running", at: new Date().toISOString() },
      ],
      startedAt: new Date().toISOString(),
    };

    return this.repository.save(runningJob);
  }

  async markSucceeded(
    job: ProviderJob,
    update: Partial<ProviderJob> = {},
  ): Promise<ProviderJob> {
    const succeededJob: ProviderJob = {
      ...job,
      ...update,
      status: "succeeded",
      statusHistory: [
        ...job.statusHistory,
        { status: "succeeded", at: new Date().toISOString() },
      ],
      completedAt: new Date().toISOString(),
    };

    return this.repository.save(succeededJob);
  }

  async markFailed(
    job: ProviderJob,
    errorCode: string,
    errorMessage: string,
  ): Promise<ProviderJob> {
    const failedJob: ProviderJob = {
      ...job,
      status: "failed",
      errorCode,
      errorMessage,
      statusHistory: [
        ...job.statusHistory,
        { status: "failed", at: new Date().toISOString(), errorCode },
      ],
      completedAt: new Date().toISOString(),
    };

    return this.repository.save(failedJob);
  }

  async listBySession(sessionId: string): Promise<ProviderJob[]> {
    return this.repository.findBySession(sessionId);
  }
}
