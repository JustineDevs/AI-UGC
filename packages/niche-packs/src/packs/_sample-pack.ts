export const sampleNichePack = {
  key: 'sample-pack',
  version: '1.0.0',
  label: 'Sample Pack',
  description: 'Minimal sample niche pack for extension-surface verification.',
  defaultChannelTargets: ['tiktok'],
  requiredAssetTypes: ['source_video'],
  intakeSchemaRef: 'sample/intake-schema.json',
  promptModuleRefs: ['hook'],
  outputPolicyRef: 'sample/output-policy.json',
  status: 'active',
};
