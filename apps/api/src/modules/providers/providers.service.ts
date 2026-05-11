import { Injectable } from "@nestjs/common";
import type { ProviderProfile } from "@ai-ugc/domain";
import { ProviderProfileMemoryRepository } from "../../infrastructure/persistence/provider-profile.memory-repository";
import { v4 as uuidv4 } from "uuid";
import { ProviderValidationService } from "./provider-validation.service";
import { UpsertProviderProfileRequestDto } from "./dto/upsert-provider-profile-request.dto";

@Injectable()
export class ProvidersService {
  constructor(
    private readonly repository: ProviderProfileMemoryRepository,
    private readonly validationService: ProviderValidationService,
  ) {}

  async upsertProfile(
    workspaceTemplateId: string,
    input: UpsertProviderProfileRequestDto,
  ): Promise<ProviderProfile> {
    const validation = await this.validationService.validate(input.providerKey);

    const profile: ProviderProfile = {
      id: uuidv4(),
      workspaceTemplateId,
      providerKey: input.providerKey,
      displayName: input.displayName,
      baseUrl: input.baseUrl,
      apiKeySecretRef: input.apiKeySecretRef,
      defaultTextModel: input.defaultTextModel,
      defaultVideoModel: input.defaultVideoModel,
      defaultImageModel: input.defaultImageModel,
      enabledCapabilities: input.enabledCapabilities,
      fallbackPriority: input.fallbackPriority,
      status: validation.status === "validated" ? "validated" : "draft",
      lastValidatedAt:
        validation.status === "validated"
          ? new Date().toISOString()
          : undefined,
    };

    return this.repository.save(profile);
  }

  async listByWorkspace(
    workspaceTemplateId: string,
  ): Promise<ProviderProfile[]> {
    return this.repository.findByWorkspace(workspaceTemplateId);
  }
}
