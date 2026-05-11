import {
  getPromptBlocksForChannel,
  getPromptBlock,
  getPromptTemplateForNiche,
  type PromptBlockDefinition,
} from "../prompts";
import {
  getSkillDefinition,
  type SkillDefinition,
} from "../skills";

export interface SemanticBlueprintPlan {
  template: PromptBlockDefinition;
  promptBlocks: PromptBlockDefinition[];
  skillChain: SkillDefinition[];
  providerPromptIds: string[];
  guardPromptIds: string[];
}

const nichePromptByKey: Record<string, string> = {
  "ecommerce-product-ads": "niche.ecommerce-product-ads",
  "local-service-ads": "niche.local-services",
  "info-product-promos": "niche.info-products",
  "creator-testimonial-ads": "niche.creator-testimonials",
  "organic-social-proof": "niche.organic-social-proof",
};

const strategicPromptByNicheKey: Record<string, string[]> = {
  "ecommerce-product-ads": [
    "core.brand-story",
    "core.social-strategy",
    "core.video-structure",
    "core.copy-optimization",
    "core.creative-brief",
    "core.visual-direction",
  ],
  "local-service-ads": [
    "core.brand-story",
    "core.social-strategy",
    "core.video-structure",
    "core.copy-optimization",
    "core.creative-brief",
  ],
  "info-product-promos": [
    "core.brand-story",
    "core.social-strategy",
    "core.video-structure",
    "core.copy-optimization",
    "core.creative-brief",
  ],
  "creator-testimonial-ads": [
    "core.brand-story",
    "core.creator-partnerships",
    "core.social-strategy",
    "core.video-structure",
    "core.copy-optimization",
    "core.visual-direction",
  ],
  "organic-social-proof": [
    "core.brand-story",
    "core.creator-partnerships",
    "core.social-strategy",
    "core.video-structure",
    "core.copy-optimization",
    "core.visual-direction",
  ],
};

const providerPromptByKey: Record<string, string[]> = {
  laozhang: ["provider.laozhang-text", "provider.laozhang-video"],
  apimart: ["provider.apimart-text", "provider.apimart-video"],
  "sample-provider": ["provider.laozhang-text"],
};

const skillChainByStepId: Record<string, string[]> = {
  "collect-inputs": ["validate-inputs"],
  "analyze-source": ["analyze-source"],
  "assemble-prompt": ["compose-prompt"],
  "moderate-prompt": ["validate-claims", "score-output", "revise-output"],
  "generate-output": ["route-provider", "launch-generation", "monitor-job", "publish-export"],
};

export const buildSemanticBlueprintPlan = (input: {
  nichePackKey?: string;
  channelTargets?: string[];
  preferredProviderKey?: string;
  enabledStepIds?: string[];
}): SemanticBlueprintPlan => {
  const template = getPromptTemplateForNiche(input.nichePackKey);
  const channelBlocks = getPromptBlocksForChannel(
    input.channelTargets?.[0] || "tiktok",
  );
  const promptBlockIds = [
    "core.brand-voice",
    ...(strategicPromptByNicheKey[input.nichePackKey || "ecommerce-product-ads"] || []),
    "core.hook",
    "core.proof",
    "core.cta",
    "core.style",
    nichePromptByKey[input.nichePackKey || "ecommerce-product-ads"],
    ...channelBlocks.map((definition) => definition.id),
    "guard.claim-safety",
    "guard.anti-generic",
    "guard.brand-safety",
    "transform.analysis-to-prompt",
    "transform.profile-to-prompt",
    "transform.blueprint-to-prompt",
  ].filter(Boolean) as string[];

  const promptBlocks = promptBlockIds
    .map((id) => ({ id, definition: getPromptBlock(id) }))
    .filter(
      (
        entry,
      ): entry is { id: string; definition: PromptBlockDefinition } =>
        Boolean(entry.definition),
    )
    .map(({ definition }) => definition);

  const enabledStepIds =
    input.enabledStepIds && input.enabledStepIds.length > 0
      ? input.enabledStepIds
      : ["collect-inputs", "analyze-source", "assemble-prompt", "moderate-prompt", "generate-output"];

  const skillChain = enabledStepIds
    .flatMap((stepId) => skillChainByStepId[stepId] || [])
    .map((skillId) => getSkillDefinition(skillId))
    .filter((definition): definition is SkillDefinition => Boolean(definition));

  const providerPromptIds =
    providerPromptByKey[input.preferredProviderKey || "laozhang"] ||
    providerPromptByKey.laozhang;

  return {
    template,
    promptBlocks,
    skillChain,
    providerPromptIds,
    guardPromptIds: [
      "guard.claim-safety",
      "guard.anti-generic",
      "guard.brand-safety",
    ],
  };
};
