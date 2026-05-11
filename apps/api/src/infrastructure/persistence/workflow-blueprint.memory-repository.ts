import { Injectable } from "@nestjs/common";
import type { WorkflowBlueprint } from "@ai-ugc/domain";
import type { WorkflowBlueprintRepository } from "@ai-ugc/domain";
import { loadRecord, upsertRecord } from "../database/database";

@Injectable()
export class WorkflowBlueprintMemoryRepository implements WorkflowBlueprintRepository {
  async save(blueprint: WorkflowBlueprint): Promise<WorkflowBlueprint> {
    upsertRecord("workflow_blueprints", blueprint.id, blueprint, {
      workspace_template_id: blueprint.workspaceTemplateId,
      name: blueprint.name,
    });
    return blueprint;
  }

  async findById(id: string): Promise<WorkflowBlueprint | null> {
    const rows = await loadRecord<WorkflowBlueprint>(
      "workflow_blueprints",
      "id = ?",
      [id],
    );
    return rows[0] || null;
  }
}
