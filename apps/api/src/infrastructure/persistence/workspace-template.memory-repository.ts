import { Injectable } from "@nestjs/common";
import type { WorkspaceTemplate } from "@ai-ugc/domain";
import type { WorkspaceTemplateRepository } from "@ai-ugc/domain";
import { loadRecord, upsertRecord } from "../database/database";

@Injectable()
export class WorkspaceTemplateMemoryRepository implements WorkspaceTemplateRepository {
  async save(workspace: WorkspaceTemplate): Promise<WorkspaceTemplate> {
    upsertRecord("workspace_templates", workspace.id, workspace, {
      slug: workspace.slug,
      name: workspace.name,
    });
    return workspace;
  }

  async findById(id: string): Promise<WorkspaceTemplate | null> {
    const rows = await loadRecord<WorkspaceTemplate>(
      "workspace_templates",
      "id = ?",
      [id],
    );
    return rows[0] || null;
  }
}
