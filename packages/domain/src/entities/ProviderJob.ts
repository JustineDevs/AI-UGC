export type ProviderJobStatus =
  | 'queued'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'cancelled';

export interface ProviderJob {
  id: string;
  generationSessionId: string;
  providerProfileId: string;
  capabilityType: string;
  modelKey: string;
  externalTaskId?: string;
  requestSummary: Record<string, unknown>;
  status: ProviderJobStatus;
  statusHistory: Array<Record<string, unknown>>;
  attemptCount: number;
  errorCode?: string;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
}
