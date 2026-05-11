import { Injectable } from "@nestjs/common";
import { builtInNichePacks } from "@ai-ugc/niche-packs";
import type { WorkspaceTemplate } from "@ai-ugc/domain";
import { v4 as uuidv4 } from "uuid";
import { WorkspaceTemplateMemoryRepository } from "../../infrastructure/persistence/workspace-template.memory-repository";
import { CreateWorkspaceRequestDto } from "./dto/create-workspace-request.dto";

@Injectable()
export class WorkspacesService {
  constructor(private readonly repository: WorkspaceTemplateMemoryRepository) {}

  async createWorkspace(
    input: CreateWorkspaceRequestDto,
  ): Promise<WorkspaceTemplate> {
    const enabledKeys =
      input.enabledNichePackKeys.length > 0
        ? input.enabledNichePackKeys
        : builtInNichePacks.map((pack: { key: string }) => pack.key);

    const workspace: WorkspaceTemplate = {
      id: uuidv4(),
      name: input.name,
      slug: input.slug,
      defaultProviderProfileId: "",
      storageProfileId: "",
      enabledNichePackKeys: enabledKeys,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.repository.save(workspace);
  }

  async getWorkspace(id: string): Promise<WorkspaceTemplate | null> {
    return this.repository.findById(id);
  }
}
