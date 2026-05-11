export interface CustomNicheInput {
  label: string;
  channelTargets: string[];
  requiredAssetTypes: string[];
  promptModules: string[];
}

export const composeCustomNiche = (input: CustomNicheInput) => ({
  key: `custom-${input.label.toLowerCase().replace(/\s+/g, '-')}`,
  version: '1.0.0',
  label: input.label,
  description: `${input.label} custom AI-UGC workflow`,
  defaultChannelTargets: input.channelTargets,
  requiredAssetTypes: input.requiredAssetTypes,
  intakeSchemaRef: 'custom/intake-schema.json',
  promptModuleRefs: input.promptModules,
  outputPolicyRef: 'custom/output-policy.json',
  status: 'active' as const,
});
