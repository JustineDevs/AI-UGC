import { Injectable } from "@nestjs/common";
import type { WorkflowBlueprint } from "@ai-ugc/domain";
import {
  buildModerationPolicy,
  buildOutputPolicy,
  buildPromptAssemblyConfig,
  buildSemanticBlueprintPlan,
} from "@ai-ugc/workflow-engine";
import { v4 as uuidv4 } from "uuid";
import { WorkflowBlueprintMemoryRepository } from "../../infrastructure/persistence/workflow-blueprint.memory-repository";
import { CreateBlueprintRequestDto } from "./dto/create-blueprint-request.dto";

@Injectable()
export class BlueprintsService {
  constructor(private readonly repository: WorkflowBlueprintMemoryRepository) {}

  async createBlueprint(
    workspaceTemplateId: string,
    input: CreateBlueprintRequestDto,
  ): Promise<WorkflowBlueprint> {
    const semanticPlan = buildSemanticBlueprintPlan({
      nichePackKey: input.nichePackKey,
      channelTargets: Array.isArray(input.intakeSchema.channelTargets)
        ? (input.intakeSchema.channelTargets as string[])
        : ["tiktok"],
      preferredProviderKey:
        typeof input.intakeSchema.defaultProviderKey === "string"
          ? (input.intakeSchema.defaultProviderKey as string)
          : "laozhang",
      enabledStepIds: Array.isArray(
        (input.stepGraph as { steps?: unknown }).steps,
      )
        ? ((
            input.stepGraph as {
              steps: Array<{ id: string; enabled?: boolean }>;
            }
          ).steps
            .filter((step) => step.enabled !== false)
            .map((step) => step.id) as string[])
        : undefined,
    });

    const blueprint: WorkflowBlueprint = {
      id: uuidv4(),
      workspaceTemplateId,
      nichePackKey: input.nichePackKey,
      name: input.name,
      version: 1,
      status: "draft",
      providerPolicy: {},
      intakeSchema: input.intakeSchema,
      stepGraph: input.stepGraph,
      promptAssemblyConfig: buildPromptAssemblyConfig(
        semanticPlan.promptBlocks.map((definition) => definition.id),
        {
          templateId: semanticPlan.template.id,
          promptBlockIds: semanticPlan.promptBlocks.map(
            (definition) => definition.id,
          ),
          skillIds: semanticPlan.skillChain.map((definition) => definition.id),
          providerPromptIds: semanticPlan.providerPromptIds,
          guardPromptIds: semanticPlan.guardPromptIds,
        },
      ),
      moderationPolicy: buildModerationPolicy(),
      outputPolicy: buildOutputPolicy(
        Array.isArray(input.intakeSchema.channelTargets)
          ? (input.intakeSchema.channelTargets as string[])
          : [],
      ),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.repository.save(blueprint);
  }

  async getBlueprint(id: string): Promise<WorkflowBlueprint | null> {
    return this.repository.findById(id);
  }
}
