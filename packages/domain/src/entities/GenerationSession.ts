export type GenerationSessionStatus =
  | 'created'
  | 'collecting_inputs'
  | 'analyzing'
  | 'prompting'
  | 'generating'
  | 'review_ready'
  | 'failed'
  | 'completed';

export interface GenerationSession {
  id: string;
  projectProfileId: string;
  workflowBlueprintSnapshot: Record<string, unknown>;
  status: GenerationSessionStatus;
  channelTarget: string;
  campaignInputs: Record<string, unknown>;
  analysisSummary?: Record<string, unknown>;
  promptDraft?: string;
  promptApprovedAt?: string;
  providerRoutingTrace: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
