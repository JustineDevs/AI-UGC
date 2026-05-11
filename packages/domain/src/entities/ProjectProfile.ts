export interface ProjectProfile {
  id: string;
  workspaceTemplateId: string;
  workflowBlueprintId: string;
  name: string;
  brandVoice: string;
  audience: string;
  offerDetails: string;
  claimsPolicy: Record<string, unknown>;
  channelTargets: string[];
  forbiddenTerms: string[];
  assetConstraints: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
