export interface WorkflowStepDefinition {
  id: string;
  label: string;
  enabled: boolean;
}

export const defaultBlueprintSteps: WorkflowStepDefinition[] = [
  { id: 'collect-inputs', label: 'Collect Inputs', enabled: true },
  { id: 'analyze-source', label: 'Analyze Source', enabled: true },
  { id: 'assemble-prompt', label: 'Assemble Prompt', enabled: true },
  { id: 'moderate-prompt', label: 'Moderate Prompt', enabled: true },
  { id: 'generate-output', label: 'Generate Output', enabled: true },
];
