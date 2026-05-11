import Ajv from "ajv";
import { getSkillContract, type SkillContract } from "../skills";

export interface LoadedSkillContract extends SkillContract {
  policyText: string;
  stepsText: string;
  policyRules: Array<{
    id: string;
    path: string;
    operator: string;
    value?: unknown;
    comparePath?: string;
    message: string;
  }>;
  declaredSteps: string[];
  declaredStepIds: string[];
}

const ajv = new Ajv({
  allErrors: true,
  strict: false,
});

export const parsePolicyRules = (markdown: string) =>
  markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line, index) => ({
      id: `derived-rule-${index + 1}`,
      path: "__skillTrace",
      operator: "exists",
      message: line.slice(2).trim(),
    }));

export const parseDeclaredSteps = (markdown: string) =>
  markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^\d+\.\s/.test(line))
    .map((line) => line.replace(/^\d+\.\s*/, "").trim());

export const loadSkillContract = (skillId: string): LoadedSkillContract => {
  const contract = getSkillContract(skillId);
  if (!contract) {
    throw new Error(`Unknown skill contract: ${skillId}`);
  }

  const policyRules = contract.policySchema.rules || [];
  const declaredStepObjects = contract.stepsSchema.steps || [];

  return {
    ...contract,
    policyText: policyRules.map((rule) => `- ${rule.message}`).join("\n"),
    stepsText: declaredStepObjects
      .map((step, index) => `${index + 1}. ${step.description}`)
      .join("\n"),
    policyRules,
    declaredSteps: declaredStepObjects.map((step) => step.description),
    declaredStepIds: declaredStepObjects.map((step) => step.id),
  };
};

export const validateValueAgainstSchema = (
  value: unknown,
  schema: Record<string, unknown>,
  label: string,
): void => {
  const normalizedSchema = normalizeSchema(schema);
  const validator = ajv.compile(normalizedSchema);
  const valid = validator(value);

  if (!valid) {
    throw new Error(
      validator.errors
        ?.map(
          (error: { instancePath?: string; message?: string }) =>
            `${label}${error.instancePath || ""} ${error.message || "is invalid"}`,
        )
        .join("; "),
    );
  }
};

function normalizeSchema(schema: Record<string, unknown>): Record<string, unknown> {
  const cloned = JSON.parse(JSON.stringify(schema)) as Record<string, unknown>;
  delete cloned.$schema;
  return cloned;
}
