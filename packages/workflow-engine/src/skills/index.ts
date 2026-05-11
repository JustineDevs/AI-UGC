import analyzeSource from "../../../../skills/analyze-source/skill.json";
import analyzeSourceInputSchema from "../../../../skills/analyze-source/input.schema.json";
import analyzeSourceOutputSchema from "../../../../skills/analyze-source/output.schema.json";
import analyzeSourcePolicySchema from "../../../../skills/analyze-source/policy.json";
import analyzeSourceStepsSchema from "../../../../skills/analyze-source/steps.json";
import buildBlueprint from "../../../../skills/build-blueprint/skill.json";
import buildBlueprintInputSchema from "../../../../skills/build-blueprint/input.schema.json";
import buildBlueprintOutputSchema from "../../../../skills/build-blueprint/output.schema.json";
import buildBlueprintPolicySchema from "../../../../skills/build-blueprint/policy.json";
import buildBlueprintStepsSchema from "../../../../skills/build-blueprint/steps.json";
import composePrompt from "../../../../skills/compose-prompt/skill.json";
import composePromptInputSchema from "../../../../skills/compose-prompt/input.schema.json";
import composePromptOutputSchema from "../../../../skills/compose-prompt/output.schema.json";
import composePromptPolicySchema from "../../../../skills/compose-prompt/policy.json";
import composePromptStepsSchema from "../../../../skills/compose-prompt/steps.json";
import validateInputs from "../../../../skills/validate-inputs/skill.json";
import validateInputsInputSchema from "../../../../skills/validate-inputs/input.schema.json";
import validateInputsOutputSchema from "../../../../skills/validate-inputs/output.schema.json";
import validateInputsPolicySchema from "../../../../skills/validate-inputs/policy.json";
import validateInputsStepsSchema from "../../../../skills/validate-inputs/steps.json";
import validateClaims from "../../../../skills/validate-claims/skill.json";
import validateClaimsInputSchema from "../../../../skills/validate-claims/input.schema.json";
import validateClaimsOutputSchema from "../../../../skills/validate-claims/output.schema.json";
import validateClaimsPolicySchema from "../../../../skills/validate-claims/policy.json";
import validateClaimsStepsSchema from "../../../../skills/validate-claims/steps.json";
import routeProvider from "../../../../skills/route-provider/skill.json";
import routeProviderInputSchema from "../../../../skills/route-provider/input.schema.json";
import routeProviderOutputSchema from "../../../../skills/route-provider/output.schema.json";
import routeProviderPolicySchema from "../../../../skills/route-provider/policy.json";
import routeProviderStepsSchema from "../../../../skills/route-provider/steps.json";
import launchGeneration from "../../../../skills/launch-generation/skill.json";
import launchGenerationInputSchema from "../../../../skills/launch-generation/input.schema.json";
import launchGenerationOutputSchema from "../../../../skills/launch-generation/output.schema.json";
import launchGenerationPolicySchema from "../../../../skills/launch-generation/policy.json";
import launchGenerationStepsSchema from "../../../../skills/launch-generation/steps.json";
import monitorJob from "../../../../skills/monitor-job/skill.json";
import monitorJobInputSchema from "../../../../skills/monitor-job/input.schema.json";
import monitorJobOutputSchema from "../../../../skills/monitor-job/output.schema.json";
import monitorJobPolicySchema from "../../../../skills/monitor-job/policy.json";
import monitorJobStepsSchema from "../../../../skills/monitor-job/steps.json";
import scoreOutput from "../../../../skills/score-output/skill.json";
import scoreOutputInputSchema from "../../../../skills/score-output/input.schema.json";
import scoreOutputOutputSchema from "../../../../skills/score-output/output.schema.json";
import scoreOutputPolicySchema from "../../../../skills/score-output/policy.json";
import scoreOutputStepsSchema from "../../../../skills/score-output/steps.json";
import reviseOutput from "../../../../skills/revise-output/skill.json";
import reviseOutputInputSchema from "../../../../skills/revise-output/input.schema.json";
import reviseOutputOutputSchema from "../../../../skills/revise-output/output.schema.json";
import reviseOutputPolicySchema from "../../../../skills/revise-output/policy.json";
import reviseOutputStepsSchema from "../../../../skills/revise-output/steps.json";
import publishExport from "../../../../skills/publish-export/skill.json";
import publishExportInputSchema from "../../../../skills/publish-export/input.schema.json";
import publishExportOutputSchema from "../../../../skills/publish-export/output.schema.json";
import publishExportPolicySchema from "../../../../skills/publish-export/policy.json";
import publishExportStepsSchema from "../../../../skills/publish-export/steps.json";

export interface SkillDefinition {
  id: string;
  version: string;
  label: string;
  purpose: string;
  required_inputs: string[];
  produces: string[];
  allowed_prompt_types?: string[];
  depends_on?: string[];
  supported_providers?: string[];
  retry_policy?: Record<string, unknown>;
}

export interface SkillContract {
  definition: SkillDefinition;
  inputSchema: {
    required?: string[];
  };
  outputSchema: {
    required?: string[];
  };
  policySchema: {
    rules?: Array<{
      id: string;
      path: string;
      operator: string;
      value?: unknown;
      comparePath?: string;
      message: string;
    }>;
  };
  policyPath: string;
  policyJsonPath: string;
  stepsPath: string;
  stepsJsonPath: string;
  stepsSchema: {
    steps?: Array<{
      id: string;
      description: string;
    }>;
  };
}

export const skillCatalog: SkillDefinition[] = [
  analyzeSource,
  buildBlueprint,
  composePrompt,
  validateInputs,
  validateClaims,
  routeProvider,
  launchGeneration,
  monitorJob,
  scoreOutput,
  reviseOutput,
  publishExport,
] satisfies SkillDefinition[];

const skillCatalogMap = new Map(
  skillCatalog.map((definition) => [definition.id, definition]),
);

const skillContracts: SkillContract[] = [
  {
    definition: analyzeSource,
    inputSchema: analyzeSourceInputSchema,
    outputSchema: analyzeSourceOutputSchema,
    policySchema: analyzeSourcePolicySchema,
    policyPath: "skills/analyze-source/policy.md",
    policyJsonPath: "skills/analyze-source/policy.json",
    stepsPath: "skills/analyze-source/steps.md",
    stepsJsonPath: "skills/analyze-source/steps.json",
    stepsSchema: analyzeSourceStepsSchema,
  },
  {
    definition: buildBlueprint,
    inputSchema: buildBlueprintInputSchema,
    outputSchema: buildBlueprintOutputSchema,
    policySchema: buildBlueprintPolicySchema,
    policyPath: "skills/build-blueprint/policy.md",
    policyJsonPath: "skills/build-blueprint/policy.json",
    stepsPath: "skills/build-blueprint/steps.md",
    stepsJsonPath: "skills/build-blueprint/steps.json",
    stepsSchema: buildBlueprintStepsSchema,
  },
  {
    definition: composePrompt,
    inputSchema: composePromptInputSchema,
    outputSchema: composePromptOutputSchema,
    policySchema: composePromptPolicySchema,
    policyPath: "skills/compose-prompt/policy.md",
    policyJsonPath: "skills/compose-prompt/policy.json",
    stepsPath: "skills/compose-prompt/steps.md",
    stepsJsonPath: "skills/compose-prompt/steps.json",
    stepsSchema: composePromptStepsSchema,
  },
  {
    definition: validateInputs,
    inputSchema: validateInputsInputSchema,
    outputSchema: validateInputsOutputSchema,
    policySchema: validateInputsPolicySchema,
    policyPath: "skills/validate-inputs/policy.md",
    policyJsonPath: "skills/validate-inputs/policy.json",
    stepsPath: "skills/validate-inputs/steps.md",
    stepsJsonPath: "skills/validate-inputs/steps.json",
    stepsSchema: validateInputsStepsSchema,
  },
  {
    definition: validateClaims,
    inputSchema: validateClaimsInputSchema,
    outputSchema: validateClaimsOutputSchema,
    policySchema: validateClaimsPolicySchema,
    policyPath: "skills/validate-claims/policy.md",
    policyJsonPath: "skills/validate-claims/policy.json",
    stepsPath: "skills/validate-claims/steps.md",
    stepsJsonPath: "skills/validate-claims/steps.json",
    stepsSchema: validateClaimsStepsSchema,
  },
  {
    definition: routeProvider,
    inputSchema: routeProviderInputSchema,
    outputSchema: routeProviderOutputSchema,
    policySchema: routeProviderPolicySchema,
    policyPath: "skills/route-provider/policy.md",
    policyJsonPath: "skills/route-provider/policy.json",
    stepsPath: "skills/route-provider/steps.md",
    stepsJsonPath: "skills/route-provider/steps.json",
    stepsSchema: routeProviderStepsSchema,
  },
  {
    definition: launchGeneration,
    inputSchema: launchGenerationInputSchema,
    outputSchema: launchGenerationOutputSchema,
    policySchema: launchGenerationPolicySchema,
    policyPath: "skills/launch-generation/policy.md",
    policyJsonPath: "skills/launch-generation/policy.json",
    stepsPath: "skills/launch-generation/steps.md",
    stepsJsonPath: "skills/launch-generation/steps.json",
    stepsSchema: launchGenerationStepsSchema,
  },
  {
    definition: monitorJob,
    inputSchema: monitorJobInputSchema,
    outputSchema: monitorJobOutputSchema,
    policySchema: monitorJobPolicySchema,
    policyPath: "skills/monitor-job/policy.md",
    policyJsonPath: "skills/monitor-job/policy.json",
    stepsPath: "skills/monitor-job/steps.md",
    stepsJsonPath: "skills/monitor-job/steps.json",
    stepsSchema: monitorJobStepsSchema,
  },
  {
    definition: scoreOutput,
    inputSchema: scoreOutputInputSchema,
    outputSchema: scoreOutputOutputSchema,
    policySchema: scoreOutputPolicySchema,
    policyPath: "skills/score-output/policy.md",
    policyJsonPath: "skills/score-output/policy.json",
    stepsPath: "skills/score-output/steps.md",
    stepsJsonPath: "skills/score-output/steps.json",
    stepsSchema: scoreOutputStepsSchema,
  },
  {
    definition: reviseOutput,
    inputSchema: reviseOutputInputSchema,
    outputSchema: reviseOutputOutputSchema,
    policySchema: reviseOutputPolicySchema,
    policyPath: "skills/revise-output/policy.md",
    policyJsonPath: "skills/revise-output/policy.json",
    stepsPath: "skills/revise-output/steps.md",
    stepsJsonPath: "skills/revise-output/steps.json",
    stepsSchema: reviseOutputStepsSchema,
  },
  {
    definition: publishExport,
    inputSchema: publishExportInputSchema,
    outputSchema: publishExportOutputSchema,
    policySchema: publishExportPolicySchema,
    policyPath: "skills/publish-export/policy.md",
    policyJsonPath: "skills/publish-export/policy.json",
    stepsPath: "skills/publish-export/steps.md",
    stepsJsonPath: "skills/publish-export/steps.json",
    stepsSchema: publishExportStepsSchema,
  },
];

const skillContractMap = new Map(
  skillContracts.map((contract) => [contract.definition.id, contract]),
);

export const getSkillDefinition = (
  id: string,
): SkillDefinition | undefined => skillCatalogMap.get(id);

export const listSkillDefinitions = (): SkillDefinition[] => skillCatalog;

export const getSkillContract = (
  id: string,
): SkillContract | undefined => skillContractMap.get(id);

export const listSkillContracts = (): SkillContract[] => skillContracts;
