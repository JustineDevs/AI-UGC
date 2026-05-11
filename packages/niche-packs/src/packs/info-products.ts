export const infoProductsNichePack = {
  key: 'info-product-promos',
  version: '1.0.0',
  label: 'Info Product Promos',
  description: 'Educational and conversion-focused AI-UGC for info products.',
  defaultChannelTargets: ['youtube-shorts', 'tiktok'],
  requiredAssetTypes: ['source_video', 'script_reference'],
  intakeSchemaRef: 'info-products/intake-schema.json',
  promptModuleRefs: ['hook', 'authority', 'transformation', 'cta'],
  outputPolicyRef: 'info-products/output-policy.json',
  status: 'active',
};
