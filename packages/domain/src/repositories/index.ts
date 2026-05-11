import type {
  GenerationSession,
  OutputAsset,
  ProjectProfile,
  ProviderJob,
  ProviderProfile,
  WorkflowBlueprint,
  WorkspaceTemplate,
} from '../index';

export interface WorkspaceTemplateRepository {
  save(workspace: WorkspaceTemplate): Promise<WorkspaceTemplate>;
  findById(id: string): Promise<WorkspaceTemplate | null>;
}

export interface ProviderProfileRepository {
  save(profile: ProviderProfile): Promise<ProviderProfile>;
  findByWorkspace(workspaceTemplateId: string): Promise<ProviderProfile[]>;
}

export interface WorkflowBlueprintRepository {
  save(blueprint: WorkflowBlueprint): Promise<WorkflowBlueprint>;
  findById(id: string): Promise<WorkflowBlueprint | null>;
}

export interface ProjectProfileRepository {
  save(project: ProjectProfile): Promise<ProjectProfile>;
  findById(id: string): Promise<ProjectProfile | null>;
}

export interface GenerationSessionRepository {
  save(session: GenerationSession): Promise<GenerationSession>;
  findById(id: string): Promise<GenerationSession | null>;
}

export interface ProviderJobRepository {
  save(job: ProviderJob): Promise<ProviderJob>;
  findBySession(generationSessionId: string): Promise<ProviderJob[]>;
}

export interface OutputAssetRepository {
  save(asset: OutputAsset): Promise<OutputAsset>;
  findBySession(generationSessionId: string): Promise<OutputAsset[]>;
}
