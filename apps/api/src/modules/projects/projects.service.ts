import { Injectable } from "@nestjs/common";
import type { ProjectProfile } from "@ai-ugc/domain";
import { v4 as uuidv4 } from "uuid";
import { ProjectProfileMemoryRepository } from "../../infrastructure/persistence/project-profile.memory-repository";
import { CreateProjectRequestDto } from "./dto/create-project-request.dto";

@Injectable()
export class ProjectsService {
  constructor(private readonly repository: ProjectProfileMemoryRepository) {}

  async createProject(
    workspaceTemplateId: string,
    input: CreateProjectRequestDto,
  ): Promise<ProjectProfile> {
    const project: ProjectProfile = {
      id: uuidv4(),
      workspaceTemplateId,
      workflowBlueprintId: input.workflowBlueprintId,
      name: input.name,
      brandVoice: input.brandVoice,
      audience: input.audience,
      offerDetails: input.offerDetails,
      claimsPolicy: {},
      channelTargets: input.channelTargets,
      forbiddenTerms: [],
      assetConstraints: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.repository.save(project);
  }

  async getProject(id: string): Promise<ProjectProfile | null> {
    return this.repository.findById(id);
  }
}
