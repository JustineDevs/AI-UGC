import type { VideoAnalysis } from "../../../../apps/api/src/common/types/analysis.types";
import {
  buildSemanticBlueprintPlan,
  type SemanticBlueprintPlan,
} from "../semantic";
import {
  getPromptBlock,
  type PromptBlockDefinition,
} from "../prompts";

export interface SemanticPromptContext {
  sourceAnalysis: string;
  productName: string;
  productDescription: string;
  brandVoice?: string;
  audience?: string;
  offerDetails?: string;
  claimsPolicy?: Record<string, unknown>;
  channel?: string;
  nichePackKey?: string;
  preferredProviderKey?: string;
}

export interface SemanticPromptBundle {
  semanticPlan: SemanticBlueprintPlan;
  promptText: string;
  promptMetadata: {
    templateId: string;
    promptBlockIds: string[];
    skillIds: string[];
    providerPromptIds: string[];
    guardPromptIds: string[];
  };
}

export const buildSemanticPromptBundle = (
  context: SemanticPromptContext,
): SemanticPromptBundle => {
  const semanticPlan = buildSemanticBlueprintPlan({
    nichePackKey: context.nichePackKey || "ecommerce-product-ads",
    channelTargets: [context.channel || "tiktok"],
    preferredProviderKey: context.preferredProviderKey || "laozhang",
  });

  const providerBlocks = semanticPlan.providerPromptIds
    .map((id) => getPromptBlock(id))
    .filter((definition): definition is PromptBlockDefinition =>
      Boolean(definition),
    );
  const guardBlocks = semanticPlan.guardPromptIds
    .map((id) => getPromptBlock(id))
    .filter((definition): definition is PromptBlockDefinition =>
      Boolean(definition),
    );

  const promptSections = [
    `Template: ${semanticPlan.template.label}`,
    `Niche: ${context.nichePackKey || "ecommerce-product-ads"}`,
    `Channel: ${context.channel || "tiktok"}`,
    `Product: ${context.productName}`,
    `Product Description: ${context.productDescription}`,
    `Brand Voice: ${context.brandVoice || "specific, credible, creator-native"}`,
    `Audience: ${context.audience || "high-intent prospects"}`,
    `Offer: ${context.offerDetails || "clear offer with one direct CTA"}`,
    `Source Analysis:\n${context.sourceAnalysis}`,
    "Semantic Prompt Blocks:\n" +
      semanticPlan.promptBlocks.map(formatPromptBlock).join("\n\n"),
    "Guardrails:\n" + guardBlocks.map(formatPromptBlock).join("\n\n"),
    "Provider Formatting:\n" + providerBlocks.map(formatPromptBlock).join("\n\n"),
    `Claims Policy: ${JSON.stringify(context.claimsPolicy || {})}`,
    "Output Goal: Generate a provider-ready AI-UGC video prompt that feels specific, native, and conversion-oriented.",
  ];

  return {
    semanticPlan,
    promptText: promptSections.join("\n\n"),
    promptMetadata: {
      templateId: semanticPlan.template.id,
      promptBlockIds: semanticPlan.promptBlocks.map((definition) => definition.id),
      skillIds: semanticPlan.skillChain.map((definition) => definition.id),
      providerPromptIds: semanticPlan.providerPromptIds,
      guardPromptIds: semanticPlan.guardPromptIds,
    },
  };
};

export const buildSemanticPromptBundleFromSession = (input: {
  videoAnalysis: VideoAnalysis;
  productInformation: {
    productName: string;
    productDescription: string;
  };
  channel?: string;
  nichePackKey?: string;
  preferredProviderKey?: string;
}): SemanticPromptBundle =>
  buildSemanticPromptBundle({
    sourceAnalysis:
      input.videoAnalysis.userEdits || input.videoAnalysis.sceneBreakdown,
    productName: input.productInformation.productName,
    productDescription: input.productInformation.productDescription,
    channel: input.channel,
    nichePackKey: input.nichePackKey,
    preferredProviderKey: input.preferredProviderKey,
  });

function formatPromptBlock(definition: PromptBlockDefinition): string {
  const parts = [
    `[${definition.id}] ${definition.label}`,
    `Purpose: ${definition.purpose}`,
  ];

  if (definition.required_inputs?.length) {
    parts.push(`Required Inputs: ${definition.required_inputs.join(", ")}`);
  }

  if (definition.blocks && Object.keys(definition.blocks).length > 0) {
    parts.push(
      "Blocks:\n" +
        Object.entries(definition.blocks)
          .map(([key, value]) => `- ${key}: ${formatPromptValue(value)}`)
          .join("\n"),
    );
  }

  if (definition.forbidden_patterns?.length) {
    parts.push(
      `Avoid: ${definition.forbidden_patterns.join(", ")}`,
    );
  }

  if (definition.output_rules && Object.keys(definition.output_rules).length > 0) {
    parts.push(
      "Output Rules:\n" +
        Object.entries(definition.output_rules)
          .map(([key, value]) => `- ${key}: ${formatPromptValue(value)}`)
          .join("\n"),
    );
  }

  if (definition.assembly_order?.length) {
    parts.push(`Assembly Order: ${definition.assembly_order.join(" -> ")}`);
  }

  if (definition.output_format) {
    parts.push(`Output Format: ${definition.output_format}`);
  }

  return parts.join("\n");
}

function formatPromptValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join("; ");
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, nestedValue]) => `${key}=${formatPromptValue(nestedValue)}`)
      .join("; ");
  }

  return String(value);
}
