import { Inject, Injectable } from "@nestjs/common";
import type { GenerationSession } from "@ai-ugc/domain";
import {
  buildModerationPolicy,
  buildSemanticBlueprintPlan,
  buildSemanticPromptBundle,
  createSkillHandlerRegistry,
  executeSemanticSkillChain,
  reviseSemanticPrompt,
  scoreSemanticPrompt,
  type SkillExecutionContext,
  type SkillHandlerMap,
} from "@ai-ugc/workflow-engine";
import {
  ProviderRegistry,
  resolveAdaptersForCapability,
  type ProviderAdapter,
  type ProviderRoutingPolicy,
} from "@ai-ugc/provider-core";
import { GenerationSessionMemoryRepository } from "../../infrastructure/persistence/generation-session.memory-repository";
import { OutputAssetsService } from "../assets/output-assets.service";
import { AuditLogService } from "../../common/observability/audit-log.service";
import { ProviderJobsService } from "../provider-jobs/provider-jobs.service";
import { createSessionSkillHandlers } from "./semantic-skill-handlers";

@Injectable()
export class SessionRunService {
  constructor(
    private readonly generationSessionRepository: GenerationSessionMemoryRepository,
    private readonly outputAssetsService: OutputAssetsService,
    private readonly auditLogService: AuditLogService,
    private readonly providerJobsService: ProviderJobsService,
    @Inject(ProviderRegistry)
    private readonly providerRegistry: ProviderRegistry,
  ) {}

  async run(sessionId: string): Promise<GenerationSession | null> {
    const session = await this.generationSessionRepository.findById(sessionId);
    if (!session) {
      return null;
    }

    const semanticPlan = buildSemanticBlueprintPlan({
      nichePackKey:
        typeof session.workflowBlueprintSnapshot.nichePackKey === "string"
          ? (session.workflowBlueprintSnapshot.nichePackKey as string)
          : undefined,
      channelTargets: [session.channelTarget],
      preferredProviderKey:
        typeof session.workflowBlueprintSnapshot.defaultProviderKey === "string"
          ? (session.workflowBlueprintSnapshot.defaultProviderKey as string)
          : "laozhang",
    });

    const promptContext = {
      sourceAnalysis:
        typeof session.analysisSummary?.summary === "string"
          ? (session.analysisSummary.summary as string)
          : JSON.stringify(session.analysisSummary || {}),
      productName:
        typeof session.campaignInputs.productName === "string"
          ? (session.campaignInputs.productName as string)
          : "AI-UGC Offer",
      productDescription:
        typeof session.campaignInputs.productDescription === "string"
          ? (session.campaignInputs.productDescription as string)
          : "Niche-specific AI-UGC workflow output",
      brandVoice:
        typeof session.campaignInputs.brandVoice === "string"
          ? (session.campaignInputs.brandVoice as string)
          : "specific, credible, creator-native",
      audience:
        typeof session.campaignInputs.audience === "string"
          ? (session.campaignInputs.audience as string)
          : "high-intent prospects",
      offerDetails:
        typeof session.campaignInputs.offerDetails === "string"
          ? (session.campaignInputs.offerDetails as string)
          : "clear offer with one direct CTA",
      claimsPolicy:
        typeof session.campaignInputs.claimsPolicy === "object" &&
        session.campaignInputs.claimsPolicy !== null
          ? (session.campaignInputs.claimsPolicy as Record<string, unknown>)
          : {},
      channel: session.channelTarget,
      nichePackKey:
        typeof session.workflowBlueprintSnapshot.nichePackKey === "string"
          ? (session.workflowBlueprintSnapshot.nichePackKey as string)
          : "ecommerce-product-ads",
      preferredProviderKey:
        typeof session.workflowBlueprintSnapshot.defaultProviderKey === "string"
          ? (session.workflowBlueprintSnapshot.defaultProviderKey as string)
          : "laozhang",
    };

    const routingPolicy: ProviderRoutingPolicy = {
      defaultProvider: promptContext.preferredProviderKey || "laozhang",
      fallbackOrder: ["apimart", "sample-provider"].filter(
        (providerKey) => providerKey !== promptContext.preferredProviderKey,
      ),
      preferredByCapability: {
        prompt_generation: promptContext.preferredProviderKey || "laozhang",
      },
    };

    const availableHandlers: SkillHandlerMap = createSessionSkillHandlers({
      sessionId,
      promptContext,
      selectProviderAdapter: (policy) => this.selectProviderAdapter(policy),
      routingPolicy,
      outputAssetsService: this.outputAssetsService,
      providerJobsService: this.providerJobsService,
    });

    const executionContext: SkillExecutionContext = {
      sessionId,
      promptContext,
      routingPolicy,
      workflow_blueprint: session.workflowBlueprintSnapshot,
      project_profile: {
        brandVoice: promptContext.brandVoice,
        audience: promptContext.audience,
        offerDetails: promptContext.offerDetails,
      },
      campaign_inputs: session.campaignInputs,
      source_asset: session.analysisSummary || {},
      niche: promptContext.nichePackKey,
      channel: promptContext.channel,
      provider: promptContext.preferredProviderKey,
      provider_registry: this.providerRegistry,
      capability_type: "prompt_generation",
      claims_policy: promptContext.claimsPolicy,
      assets: [],
    };

    this.auditLogService.write({
      scope: "session-run",
      event: "semantic-run-started",
      at: new Date().toISOString(),
      metadata: {
        sessionId,
        preferredProvider: promptContext.preferredProviderKey,
        channel: promptContext.channel,
      },
    });

    const handlers = createSkillHandlerRegistry(
      semanticPlan.skillChain,
      availableHandlers,
    );

    const skillResult = await executeSemanticSkillChain(
      semanticPlan.skillChain,
      executionContext,
      handlers,
    );

    const qualityScore = skillResult.context.qualityScore as Record<
      string,
      unknown
    >;
    const revisedPrompt = skillResult.context.revisedPrompt as
      | { reasons: string[] }
      | null
      | undefined;
    const selectedAdapter = skillResult.context.selectedAdapter as
      | ProviderAdapter
      | undefined;
    const executionResult = skillResult.context.executionResult as
      | { output: Record<string, unknown> }
      | undefined;

    const updatedSession: GenerationSession = {
      ...session,
      status: "prompting",
      providerRoutingTrace: {
        ...session.providerRoutingTrace,
        semanticPlan,
        moderationPolicy: buildModerationPolicy(),
        qualityScore,
        revisedPromptReasons: revisedPrompt?.reasons || [],
        claimsValidation: skillResult.context.claimsValidation as Record<
          string,
          unknown
        >,
        selectedProvider: selectedAdapter?.providerKey,
        providerOutput: executionResult?.output,
        executedSkillIds: skillResult.executedSkillIds,
        runTriggeredAt: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    };

    await this.generationSessionRepository.save(updatedSession);

    this.auditLogService.write({
      scope: "session-run",
      event: "semantic-run-completed",
      at: new Date().toISOString(),
      metadata: {
        sessionId,
        selectedProvider: selectedAdapter?.providerKey,
        executedSkillIds: skillResult.executedSkillIds,
      },
    });
    return updatedSession;
  }

  private selectProviderAdapter(
    routingPolicy: ProviderRoutingPolicy,
  ): ProviderAdapter {
    const adapters = resolveAdaptersForCapability(
      this.providerRegistry,
      routingPolicy,
      "prompt_generation",
    );

    if (adapters.length === 0) {
      throw new Error("No provider adapter available for prompt_generation");
    }

    return adapters[0];
  }
}
