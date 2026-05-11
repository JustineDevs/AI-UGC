import antiGenericGuard from "../../../../prompts/guards/anti-generic.prompt.json";
import brandSafetyGuard from "../../../../prompts/guards/brand-safety.prompt.json";
import claimSafetyGuard from "../../../../prompts/guards/claim-safety.prompt.json";
import brandAlignmentScore from "../../../../prompts/scoring/brand-alignment.prompt.json";
import complianceScore from "../../../../prompts/scoring/compliance.prompt.json";
import realismScore from "../../../../prompts/scoring/realism.prompt.json";
import specificityScore from "../../../../prompts/scoring/specificity.prompt.json";
import ad15Template from "../../../../prompts/templates/15s-ugc-ad.template.json";
import founderStoryTemplate from "../../../../prompts/templates/founder-story.template.json";
import localServiceTemplate from "../../../../prompts/templates/local-service.template.json";
import testimonialTemplate from "../../../../prompts/templates/testimonial.template.json";
import blueprintToPrompt from "../../../../prompts/transforms/blueprint-to-prompt.prompt.json";
import profileToPrompt from "../../../../prompts/transforms/profile-to-prompt.prompt.json";
import analysisToPrompt from "../../../../prompts/transforms/analysis-to-prompt.prompt.json";
import brandVoice from "../../../../prompts/core/brand-voice.prompt.json";
import cta from "../../../../prompts/core/cta.prompt.json";
import hook from "../../../../prompts/core/hook.prompt.json";
import proof from "../../../../prompts/core/proof.prompt.json";
import style from "../../../../prompts/core/style.prompt.json";
import ecommerceNiche from "../../../../prompts/niches/ecommerce-product-ads.prompt.json";
import localServicesNiche from "../../../../prompts/niches/local-services.prompt.json";
import infoProductsNiche from "../../../../prompts/niches/info-products.prompt.json";
import creatorTestimonialsNiche from "../../../../prompts/niches/creator-testimonials.prompt.json";
import organicSocialProofNiche from "../../../../prompts/niches/organic-social-proof.prompt.json";
import tiktokChannel from "../../../../prompts/channels/tiktok.prompt.json";
import metaAdsChannel from "../../../../prompts/channels/meta-ads.prompt.json";
import reelsChannel from "../../../../prompts/channels/reels.prompt.json";
import shortsChannel from "../../../../prompts/channels/youtube-shorts.prompt.json";
import landingPageChannel from "../../../../prompts/channels/landing-page.prompt.json";
import laozhangText from "../../../../prompts/providers/laozhang-text.prompt.json";
import laozhangVideo from "../../../../prompts/providers/laozhang-video.prompt.json";
import apimartText from "../../../../prompts/providers/apimart-text.prompt.json";
import apimartVideo from "../../../../prompts/providers/apimart-video.prompt.json";

export type PromptBlockType =
  | "core"
  | "niche"
  | "channel"
  | "provider"
  | "guard"
  | "transform"
  | "scoring"
  | "template";

export interface PromptBlockDefinition {
  id: string;
  version: string;
  type: PromptBlockType;
  label: string;
  purpose: string;
  required_inputs?: string[];
  blocks?: Record<string, unknown>;
  forbidden_patterns?: string[];
  output_rules?: Record<string, unknown>;
  assembly_order?: string[];
  output_format?: string;
}

export const promptCatalog = [
  brandVoice,
  hook,
  cta,
  proof,
  style,
  ecommerceNiche,
  localServicesNiche,
  infoProductsNiche,
  creatorTestimonialsNiche,
  organicSocialProofNiche,
  tiktokChannel,
  metaAdsChannel,
  reelsChannel,
  shortsChannel,
  landingPageChannel,
  laozhangText,
  laozhangVideo,
  apimartText,
  apimartVideo,
  antiGenericGuard,
  brandSafetyGuard,
  claimSafetyGuard,
  analysisToPrompt,
  profileToPrompt,
  blueprintToPrompt,
  realismScore,
  specificityScore,
  brandAlignmentScore,
  complianceScore,
  ad15Template,
  founderStoryTemplate,
  testimonialTemplate,
  localServiceTemplate,
] as PromptBlockDefinition[];

const promptCatalogMap = new Map(
  promptCatalog.map((definition) => [definition.id, definition]),
);

export const getPromptBlock = (
  id: string,
): PromptBlockDefinition | undefined => promptCatalogMap.get(id);

export const listPromptBlocksByType = (
  type: PromptBlockType,
): PromptBlockDefinition[] =>
  promptCatalog.filter((definition) => definition.type === type);

export const getPromptTemplateForNiche = (
  nichePackKey?: string,
): PromptBlockDefinition => {
  switch (nichePackKey) {
    case "local-service-ads":
      return localServiceTemplate as PromptBlockDefinition;
    case "creator-testimonial-ads":
      return testimonialTemplate as PromptBlockDefinition;
    case "info-product-promos":
      return founderStoryTemplate as PromptBlockDefinition;
    case "organic-social-proof":
      return testimonialTemplate as PromptBlockDefinition;
    case "ecommerce-product-ads":
    default:
      return ad15Template as PromptBlockDefinition;
  }
};

export const getPromptBlocksForChannel = (
  channel: string,
): PromptBlockDefinition[] => {
  switch (channel) {
    case "meta-ads":
      return [metaAdsChannel as PromptBlockDefinition];
    case "instagram-reels":
    case "reels":
      return [reelsChannel as PromptBlockDefinition];
    case "youtube-shorts":
      return [shortsChannel as PromptBlockDefinition];
    case "landing-page":
      return [landingPageChannel as PromptBlockDefinition];
    case "tiktok":
    default:
      return [tiktokChannel as PromptBlockDefinition];
  }
};
