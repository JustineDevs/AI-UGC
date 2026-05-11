import { type SkillDefinition } from "../skills";
import {
  loadSkillContract,
  validateValueAgainstSchema,
} from "./contracts";

export interface SkillExecutionContext {
  [key: string]: unknown;
}

export type SkillHandler = (
  context: SkillExecutionContext,
  skill: SkillDefinition,
) => Promise<SkillExecutionContext>;

export type SkillHandlerMap = Record<string, SkillHandler>;

export interface SkillExecutionResult {
  context: SkillExecutionContext;
  executedSkillIds: string[];
}

export const executeSemanticSkillChain = async (
  skills: SkillDefinition[],
  initialContext: SkillExecutionContext,
  handlers: SkillHandlerMap,
): Promise<SkillExecutionResult> => {
  let context = { ...initialContext };
  const executedSkillIds: string[] = [];

  for (const skill of skills) {
    const handler = handlers[skill.id];
    if (!handler) {
      continue;
    }

    const contract = loadSkillContract(skill.id);
    validateValueAgainstSchema(context, contract.inputSchema as Record<string, unknown>, `${skill.id} input`);

    context = await handler(context, skill);

    validateValueAgainstSchema(context, contract.outputSchema as Record<string, unknown>, `${skill.id} output`);
    validateSkillGovernance(
      context,
      skill.id,
      contract.declaredSteps,
      contract.declaredStepIds,
      contract.policyRules,
    );

    const executionTrace = (context.__skillTrace as Array<Record<string, unknown>> | undefined) || [];
    executionTrace.push({
      skillId: skill.id,
      policyText: contract.policyText,
      stepsText: contract.stepsText,
      policyRules: contract.policyRules,
      declaredSteps: contract.declaredSteps,
      declaredStepIds: contract.declaredStepIds,
      declaredOutputs: contract.definition.produces,
    });
    context.__skillTrace = executionTrace;

    executedSkillIds.push(skill.id);
  }

  return {
    context,
    executedSkillIds,
  };
};

function validateSkillGovernance(
  context: SkillExecutionContext,
  skillId: string,
  declaredSteps: string[],
  declaredStepIds: string[],
  policyRules: Array<{
    id: string;
    path: string;
    operator: string;
    value?: unknown;
    comparePath?: string;
    message: string;
  }>,
) {
  const governance = (context.__skillGovernance as
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
    | undefined)?.[skillId];

  if (!governance) {
    throw new Error(`${skillId} governance metadata is missing`);
  }

  if (governance.completedSteps.length < declaredSteps.length) {
    throw new Error(
      `${skillId} completed ${governance.completedSteps.length}/${declaredSteps.length} declared steps`,
    );
  }

  for (const stepId of declaredStepIds) {
    if (!governance.completedStepIds.includes(stepId)) {
      throw new Error(`${skillId} missing declared step id: ${stepId}`);
    }
  }

  for (const rule of policyRules) {
    const check = governance.policyChecks.find(
      (entry) => entry.ruleId === rule.id,
    );
    if (!check) {
      throw new Error(`${skillId} missing policy check for rule: ${rule.id}`);
    }
    if (!check.passed) {
      throw new Error(`${skillId} failed policy rule: ${rule.id}`);
    }
  }
}
