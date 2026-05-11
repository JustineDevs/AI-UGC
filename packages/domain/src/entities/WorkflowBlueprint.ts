export interface WorkflowBlueprint {
  id: string;
  workspaceTemplateId: string;
  nichePackKey?: string;
  name: string;
  version: number;
  status: 'draft' | 'active' | 'archived';
  providerPolicy: Record<string, unknown>;
  intakeSchema: Record<string, unknown>;
  stepGraph: Record<string, unknown>;
  promptAssemblyConfig: Record<string, unknown>;
  moderationPolicy: Record<string, unknown>;
  outputPolicy: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
