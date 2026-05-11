export const creatorTestimonialsNichePack = {
  key: 'creator-testimonial-ads',
  version: '1.0.0',
  label: 'Creator Testimonial Ads',
  description: 'Creator-style proof and narrative-driven AI-UGC testimonials.',
  defaultChannelTargets: ['tiktok', 'instagram-reels'],
  requiredAssetTypes: ['source_video', 'product_image'],
  intakeSchemaRef: 'creator-testimonials/intake-schema.json',
  promptModuleRefs: ['hook', 'story', 'benefit', 'cta'],
  outputPolicyRef: 'creator-testimonials/output-policy.json',
  status: 'active',
};
