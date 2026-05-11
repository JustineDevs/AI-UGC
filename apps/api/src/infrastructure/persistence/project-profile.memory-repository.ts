import { Injectable } from "@nestjs/common";
import type { ProjectProfile } from "@ai-ugc/domain";
import type { ProjectProfileRepository } from "@ai-ugc/domain";
import { loadRecord, upsertRecord } from "../database/database";

@Injectable()
export class ProjectProfileMemoryRepository implements ProjectProfileRepository {
  async save(project: ProjectProfile): Promise<ProjectProfile> {
    upsertRecord("project_profiles", project.id, project, {
      workspace_template_id: project.workspaceTemplateId,
      workflow_blueprint_id: project.workflowBlueprintId,
      name: project.name,
    });
    return project;
  }

  async findById(id: string): Promise<ProjectProfile | null> {
    const rows = await loadRecord<ProjectProfile>(
      "project_profiles",
      "id = ?",
      [id],
    );
    return rows[0] || null;
  }
}
