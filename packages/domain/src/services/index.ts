import type {
  GenerationSession,
  ProjectProfile,
  ProviderProfile,
  WorkflowBlueprint,
  WorkspaceTemplate,
} from '../index';

export interface WorkspaceProvisioningService {
  createWorkspaceTemplate(
    input: Partial<WorkspaceTemplate>,
  ): Promise<WorkspaceTemplate>;
}

export interface ProviderValidationService {
  validateProviderProfile(profile: ProviderProfile): Promise<ProviderProfile>;
}

export interface WorkflowExecutionService {
  executeBlueprint(
    blueprint: WorkflowBlueprint,
    session: GenerationSession,
  ): Promise<GenerationSession>;
}

export interface ProjectConfigurationService {
  saveProjectProfile(input: Partial<ProjectProfile>): Promise<ProjectProfile>;
}
