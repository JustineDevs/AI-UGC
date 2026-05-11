import { buildSemanticPromptBundle, type SemanticPromptContext } from "../compose";
export * from "./executor";
export * from "./registry";
export * from "./contracts";

export interface SemanticPromptScore {
  realism: number;
  specificity: number;
  compliance: number;
  overall: number;
  issues: string[];
}

export interface SemanticPromptRevision {
  revisedPromptText: string;
  reasons: string[];
}

export const scoreSemanticPrompt = (
  context: SemanticPromptContext,
): SemanticPromptScore => {
  const issues: string[] = [];
  let realism = 80;
  let specificity = 80;
  let compliance = 90;

  if (context.productDescription.trim().length < 20) {
    specificity -= 15;
    issues.push("product description is too short");
  }

  if (!context.offerDetails || context.offerDetails.trim().length < 10) {
    specificity -= 10;
    issues.push("offer details are underspecified");
  }

  if (!context.brandVoice || context.brandVoice.trim().length < 10) {
    realism -= 5;
    issues.push("brand voice is underspecified");
  }

  if (JSON.stringify(context.claimsPolicy || {}).includes("disallowed")) {
    compliance += 0;
  } else {
    compliance -= 5;
    issues.push("claims policy detail is light");
  }

  const overall = Math.max(
    0,
    Math.round((realism + specificity + compliance) / 3),
  );

  return {
    realism,
    specificity,
    compliance,
    overall,
    issues,
  };
};

export const reviseSemanticPrompt = (
  context: SemanticPromptContext,
): SemanticPromptRevision => {
  const bundle = buildSemanticPromptBundle(context);
  const reasons: string[] = [];

  let revisedPromptText = bundle.promptText;

  if (!context.offerDetails || context.offerDetails.trim().length < 10) {
    revisedPromptText +=
      "\n\nRevision Instruction: Make the offer concrete with a direct incentive and one believable CTA.";
    reasons.push("added offer-specific revision guidance");
  }

  if (context.productDescription.trim().length < 20) {
    revisedPromptText +=
      "\n\nRevision Instruction: Add concrete product details, use-case specificity, and one proof mechanism.";
    reasons.push("added specificity revision guidance");
  }

  if (reasons.length === 0) {
    revisedPromptText +=
      "\n\nRevision Instruction: Tighten specificity, preserve realism, and keep the output native to the selected channel.";
    reasons.push("added generic refinement guidance");
  }

  return {
    revisedPromptText,
    reasons,
  };
};
