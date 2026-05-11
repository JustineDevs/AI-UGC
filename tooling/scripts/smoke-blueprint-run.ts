const {
  defaultBlueprintSteps,
} = require("../../packages/workflow-engine/src/blueprints");
const {
  buildModerationPolicy,
} = require("../../packages/workflow-engine/src/moderation");
const {
  buildOutputPolicy,
} = require("../../packages/workflow-engine/src/output-policy");
const {
  buildPromptAssemblyConfig,
} = require("../../packages/workflow-engine/src/prompt-assembly");

console.log(
  JSON.stringify(
    {
      steps: defaultBlueprintSteps,
      promptAssembly: buildPromptAssemblyConfig(["hook", "cta"]),
      moderationPolicy: buildModerationPolicy(),
      outputPolicy: buildOutputPolicy(["tiktok"]),
    },
    null,
    2,
  ),
);

export {};
