export const localServicesNichePack = {
  key: 'local-service-ads',
  version: '1.0.0',
  label: 'Local Service Ads',
  description: 'Location-aware AI-UGC for service operators and lead generation.',
  defaultChannelTargets: ['meta-ads', 'landing-page'],
  requiredAssetTypes: ['ugc_reference', 'brand_guide'],
  intakeSchemaRef: 'local-services/intake-schema.json',
  promptModuleRefs: ['problem', 'service-proof', 'location-cta'],
  outputPolicyRef: 'local-services/output-policy.json',
  status: 'active',
};
