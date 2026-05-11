export const organicSocialProofNichePack = {
  key: 'organic-social-proof',
  version: '1.0.0',
  label: 'Organic Social Proof',
  description: 'Native-feeling AI-UGC for creator-style organic recommendation content.',
  defaultChannelTargets: ['tiktok', 'youtube-shorts'],
  requiredAssetTypes: ['ugc_reference', 'product_image'],
  intakeSchemaRef: 'organic-social-proof/intake-schema.json',
  promptModuleRefs: ['social-proof', 'routine', 'benefit'],
  outputPolicyRef: 'organic-social-proof/output-policy.json',
  status: 'active',
};
