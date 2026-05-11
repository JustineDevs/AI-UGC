import { Injectable } from "@nestjs/common";
import type { ProviderProfile } from "@ai-ugc/domain";
import type { ProviderProfileRepository } from "@ai-ugc/domain";
import { loadRecord, upsertRecord } from "../database/database";

@Injectable()
export class ProviderProfileMemoryRepository implements ProviderProfileRepository {
  async save(profile: ProviderProfile): Promise<ProviderProfile> {
    upsertRecord("provider_profiles", profile.id, profile, {
      workspace_template_id: profile.workspaceTemplateId,
      provider_key: profile.providerKey,
    });
    return profile;
  }

  async findByWorkspace(
    workspaceTemplateId: string,
  ): Promise<ProviderProfile[]> {
    return loadRecord<ProviderProfile>(
      "provider_profiles",
      "workspace_template_id = ?",
      [workspaceTemplateId],
    );
  }
}
