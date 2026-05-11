export const ecommerceNichePack = {
  key: 'ecommerce-product-ads',
  version: '1.0.0',
  label: 'Ecommerce Product Ads',
  description: 'Product-led AI-UGC for direct response commerce campaigns.',
  defaultChannelTargets: ['tiktok', 'meta-ads'],
  requiredAssetTypes: ['source_video', 'product_image'],
  intakeSchemaRef: 'ecommerce/intake-schema.json',
  promptModuleRefs: ['hook', 'offer', 'ugc-social-proof', 'cta'],
  outputPolicyRef: 'ecommerce/output-policy.json',
  status: 'active',
};
