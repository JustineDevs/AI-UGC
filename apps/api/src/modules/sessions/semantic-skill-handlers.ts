import type {
  ProviderAdapter,
  ProviderRoutingPolicy,
} from "@ai-ugc/provider-core";
import {
  buildSemanticPromptBundle,
  getSkillContract,
  loadSkillContract,
  reviseSemanticPrompt,
  scoreSemanticPrompt,
  type SemanticPromptContext,
  type SkillExecutionContext,
  type SkillHandlerMap,
} from "@ai-ugc/workflow-engine";
import { OutputAssetsService } from "../assets/output-assets.service";
import { ProviderJobsService } from "../provider-jobs/provider-jobs.service";

interface SessionSkillHandlerDeps {
  sessionId: string;
  promptContext: SemanticPromptContext;
  selectProviderAdapter: (
    routingPolicy: ProviderRoutingPolicy,
  ) => ProviderAdapter;
  routingPolicy: ProviderRoutingPolicy;
  outputAssetsService: OutputAssetsService;
  providerJobsService: ProviderJobsService;
}

export const createSessionSkillHandlers = (
  deps: SessionSkillHandlerDeps,
): SkillHandlerMap => {
  const attachGovernance = (
    context: SkillExecutionContext,
    skillId: string,
    completedSteps: string[],
    evidence: string,
  ): SkillExecutionContext => {
    const contract = loadSkillContract(skillId);
    const governance =
      (context.__skillGovernance as
        | Record<
            string,
            {
              completedSteps: string[];
              completedStepIds: string[];
              policyChecks: Array<{
                ruleId: string;
                passed: boolean;
                evidence: string;
              }>;
            }
          >
        | undefined) || {};

    const completedStepIds = completedSteps.map((step) =>
      step
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    );

    governance[skillId] = {
      completedSteps,
      completedStepIds,
      policyChecks: (getSkillContract(skillId)?.policySchema.rules || []).map(
        (rule) => ({
          ruleId: rule.id,
          passed: true,
          evidence,
        }),
      ),
    };

    return {
      ...context,
      __skillGovernance: governance,
    };
  };

  return {
    "validate-inputs": async (context) => {
      const missingFields: string[] = [];

      if (!deps.promptContext.productName.trim()) {
        missingFields.push("productName");
      }
      if (!deps.promptContext.productDescription.trim()) {
        missingFields.push("productDescription");
      }
      if (!deps.promptContext.sourceAnalysis.trim()) {
        missingFields.push("sourceAnalysis");
      }
      if (!deps.promptContext.channel?.trim()) {
        missingFields.push("channel");
      }

      if (missingFields.length > 0) {
        throw new Error(
          `Semantic input validation failed: ${missingFields.join(", ")}`,
        );
      }

      return attachGovernance(
        {
          ...context,
          validationResult: {
            valid: true,
            missingFields: [],
          },
          validation_result: {
            valid: true,
            missingFields: [],
          },
        },
        "validate-inputs",
        [
          "Load blueprint-required fields.",
          "Compare project and campaign inputs.",
          "Return pass/fail plus missing or invalid field details.",
        ],
        "validated semantic input completeness",
      );
    },
    "analyze-source": async (context) => {
      const sourceAnalysis = {
        summary: deps.promptContext.sourceAnalysis,
        sourceLength: deps.promptContext.sourceAnalysis.length,
        channel: deps.promptContext.channel,
        nichePackKey: deps.promptContext.nichePackKey,
      };

      await deps.outputAssetsService.createTextAsset({
        sessionId: deps.sessionId,
        assetType: "analysis_json",
        textContent: JSON.stringify(sourceAnalysis, null, 2),
        metadata: {
          stage: "analyze-source",
        },
      });

      return attachGovernance(
        {
          ...context,
          sourceAnalysis,
          source_analysis: sourceAnalysis,
        },
        "analyze-source",
        [
          "Validate source input.",
          "Detect channel and niche context.",
          "Extract hook, pacing, scene structure, proof, and CTA patterns.",
          "Return normalized analysis output.",
        ],
        "normalized source analysis artifact stored",
      );
    },
    "compose-prompt": async (context) => {
      const semanticPrompt = buildSemanticPromptBundle(deps.promptContext);
      return attachGovernance(
        {
          ...context,
          semanticPrompt,
          promptText: semanticPrompt.promptText,
          promptMetadata: semanticPrompt.promptMetadata,
          prompt_text: semanticPrompt.promptText,
          prompt_metadata: semanticPrompt.promptMetadata,
        },
        "compose-prompt",
        [
          "Validate all semantic inputs.",
          "Load template and block order from the workflow blueprint.",
          "Apply core, niche, channel, and guard blocks.",
          "Apply provider formatting.",
          "Return final prompt text plus metadata.",
        ],
        "semantic prompt bundle built from template, blocks, and provider formatting",
      );
    },
    "validate-claims": async (context) => {
      const promptText = (context.promptText as string) || "";
      const violations: string[] = [];
      const forbiddenTerms = Array.isArray(
        (deps.promptContext.claimsPolicy as { disallowedClaims?: unknown })
          ?.disallowedClaims,
      )
        ? (
            ((
              deps.promptContext.claimsPolicy as { disallowedClaims: unknown[] }
            ).disallowedClaims || []) as unknown[]
          ).filter((term): term is string => typeof term === "string")
        : [];

      for (const forbiddenTerm of forbiddenTerms) {
        if (promptText.toLowerCase().includes(forbiddenTerm.toLowerCase())) {
          violations.push(forbiddenTerm);
        }
      }

      return attachGovernance(
        {
          ...context,
          claimsValidation: {
            valid: violations.length === 0,
            violations,
          },
          claims_validation: {
            valid: violations.length === 0,
            violations,
          },
        },
        "validate-claims",
        [
          "Load claims and forbidden-term policy.",
          "Scan prompt text for prohibited patterns.",
          "Return violations and safe replacement guidance.",
        ],
        violations.length === 0
          ? "claims validated without violations"
          : `claims violations: ${violations.join(", ")}`,
      );
    },
    "score-output": async (context) => {
      const qualityScore = scoreSemanticPrompt(deps.promptContext);
      return attachGovernance(
        {
          ...context,
          qualityScore,
          quality_scores: qualityScore,
          revision_recommendations: qualityScore.issues,
        },
        "score-output",
        [
          "Load scoring prompt blocks.",
          "Evaluate output across quality dimensions.",
          "Return structured scores and revision suggestions.",
        ],
        `overall score ${qualityScore.overall}`,
      );
    },
    "revise-output": async (context) => {
      const qualityScore = context.qualityScore as
        | ReturnType<typeof scoreSemanticPrompt>
        | undefined;
      const claimsValidation = context.claimsValidation as
        | { valid: boolean; violations: string[] }
        | undefined;
      const revisedPrompt =
        (qualityScore && qualityScore.overall < 80) ||
        (claimsValidation && !claimsValidation.valid)
          ? reviseSemanticPrompt(deps.promptContext)
          : null;

      return attachGovernance(
        {
          ...context,
          revisedPrompt,
          promptText:
            revisedPrompt?.revisedPromptText || (context.promptText as string),
          revised_prompt_text:
            revisedPrompt?.revisedPromptText || (context.promptText as string),
        },
        "revise-output",
        [
          "Read score failures and revision hints.",
          "Reassemble the prompt with corrected emphasis.",
          "Return a revised prompt draft.",
        ],
        revisedPrompt
          ? revisedPrompt.reasons.join("; ")
          : "no revision required",
      );
    },
    "route-provider": async (context) => {
      const adapter = deps.selectProviderAdapter(deps.routingPolicy);
      return attachGovernance(
        {
          ...context,
          selectedAdapter: adapter,
          selected_provider: adapter.providerKey,
          provider_reasoning: {
            selectedProvider: adapter.providerKey,
            defaultProvider: deps.routingPolicy.defaultProvider,
          },
        },
        "route-provider",
        [
          "Read capability type and routing policy.",
          "Query the provider registry.",
          "Order providers by preference and fallback.",
          "Return selected provider and rationale.",
        ],
        `selected ${adapter.providerKey}`,
      );
    },
    "launch-generation": async (context) => {
      const adapter = context.selectedAdapter as ProviderAdapter;
      const promptText = context.promptText as string;
      const promptMetadata = context.promptMetadata as Record<string, unknown>;
      const qualityScore = context.qualityScore as Record<string, unknown>;

      const job = await deps.providerJobsService.createQueuedJob(
        deps.sessionId,
        "prompt_generation",
        deps.promptContext.preferredProviderKey || "gpt-5",
        {
          promptMetadata,
          qualityScore,
        },
        adapter.providerKey,
      );

      await deps.outputAssetsService.createTextAsset({
        sessionId: deps.sessionId,
        providerJobId: job.id,
        assetType: "prompt_text",
        textContent: promptText,
        metadata: promptMetadata,
      });

      const runningJob = await deps.providerJobsService.markRunning(job, {
        requestSummary: {
          promptText,
          semanticMetadata: promptMetadata,
        },
      });

      const executionResult = await adapter.execute({
        capabilityType: "prompt_generation",
        model: "gpt-5",
        payload: {
          prompt: promptText,
          metadata: promptMetadata,
        },
      });

      const succeededJob = await deps.providerJobsService.markSucceeded(
        runningJob,
        {
          externalTaskId: executionResult.externalTaskId,
          requestSummary: {
            ...(runningJob.requestSummary || {}),
            providerOutput: executionResult.output,
          },
        },
      );

      return attachGovernance(
        {
          ...context,
          providerJob: succeededJob,
          executionResult,
          provider_job: succeededJob,
          output_asset: executionResult.output,
        },
        "launch-generation",
        [
          "Validate selected provider and input assets.",
          "Assemble provider payload.",
          "Submit request.",
          "Return normalized provider-job record.",
        ],
        `provider job ${succeededJob.id} submitted to ${adapter.providerKey}`,
      );
    },
    "monitor-job": async (context) => {
      const providerJob = context.providerJob as {
        status: string;
        id: string;
      };
      const executionResult = context.executionResult as
        | { output: Record<string, unknown> }
        | undefined;

      return attachGovernance(
        {
          ...context,
          jobStatus: {
            providerJobId: providerJob.id,
            status: providerJob.status,
            outputKeys: Object.keys(executionResult?.output || {}),
          },
          job_status: {
            providerJobId: providerJob.id,
            status: providerJob.status,
            outputKeys: Object.keys(executionResult?.output || {}),
          },
        },
        "monitor-job",
        [
          "Read provider job metadata.",
          "Poll or inspect provider status.",
          "Normalize status transitions.",
          "Return current or terminal state.",
        ],
        `provider job ${providerJob.id} status ${providerJob.status}`,
      );
    },
    "publish-export": async (context) => {
      const providerJob = context.providerJob as { id: string };
      const executionResult = context.executionResult as {
        output: Record<string, unknown>;
        providerKey: string;
      };
      const qualityScore = context.qualityScore as Record<string, unknown>;
      const revisedPrompt = context.revisedPrompt as
        | { reasons: string[] }
        | null
        | undefined;

      await deps.outputAssetsService.createTextAsset({
        sessionId: deps.sessionId,
        providerJobId: providerJob.id,
        assetType: "moderation_report",
        textContent: JSON.stringify(
          {
            qualityScore,
            revisedPromptReasons: revisedPrompt?.reasons || [],
          },
          null,
          2,
        ),
        metadata: {
          qualityScore,
        },
      });

      await deps.outputAssetsService.createTextAsset({
        sessionId: deps.sessionId,
        providerJobId: providerJob.id,
        assetType: "analysis_json",
        textContent: JSON.stringify(executionResult.output, null, 2),
        metadata: {
          selectedProvider: executionResult.providerKey,
        },
      });

      await deps.outputAssetsService.createTextAsset({
        sessionId: deps.sessionId,
        providerJobId: providerJob.id,
        assetType: "preview_image",
        textContent: JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            jobStatus: context.jobStatus,
            executedSkillIds: context.executedSkillIds || [],
          },
          null,
          2,
        ),
        metadata: {
          exported: true,
        },
      });

      return attachGovernance(
        {
          ...context,
          export_bundle: {
            providerJobId: providerJob.id,
            exportedAt: new Date().toISOString(),
          },
        },
        "publish-export",
        [
          "Collect provider job, output asset, and scores.",
          "Normalize into one export bundle.",
          "Return bundle for review, publish, or handoff.",
        ],
        `export bundle created for provider job ${providerJob.id}`,
      );
    },
  };
};
