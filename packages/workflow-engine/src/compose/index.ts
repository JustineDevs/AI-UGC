import type { VideoAnalysis } from "../../../../apps/api/src/common/types/analysis.types";
import {
  buildSemanticBlueprintPlan,
  type SemanticBlueprintPlan,
} from "../semantic";

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
    `Prompt Blocks: ${semanticPlan.promptBlocks.map((definition) => definition.id).join(", ")}`,
    `Guardrails: ${semanticPlan.guardPromptIds.join(", ")}`,
    `Provider Formatting: ${semanticPlan.providerPromptIds.join(", ")}`,
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
