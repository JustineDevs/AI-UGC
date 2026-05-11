import { buildModerationPolicy } from '../moderation';
import { buildOutputPolicy } from '../output-policy';
import { buildPromptAssemblyConfig } from '../prompt-assembly';
import { buildSemanticPromptBundle } from '../compose';
import { reviseSemanticPrompt, scoreSemanticPrompt } from '../runtime';
import { loadSkillContract, parseDeclaredSteps, parsePolicyRules } from '../runtime/contracts';

describe('workflow engine composition helpers', () => {
  it('builds prompt and output policies', () => {
    expect(buildPromptAssemblyConfig(['hook']).modules).toEqual(['hook']);
    expect(buildModerationPolicy().enabled).toBe(true);
    expect(buildOutputPolicy(['tiktok']).channelTargets).toEqual(['tiktok']);
  });

  it('builds a semantic prompt bundle from context', () => {
    const bundle = buildSemanticPromptBundle({
      sourceAnalysis: 'fast cuts, creator hook, testimonial proof',
      productName: 'AI-UGC Starter',
      productDescription: 'A toolkit for niche-specific ad generation',
      channel: 'tiktok',
      nichePackKey: 'ecommerce-product-ads',
      preferredProviderKey: 'laozhang',
    });

    expect(bundle.promptText).toContain('Template:');
    expect(bundle.promptMetadata.promptBlockIds.length).toBeGreaterThan(0);
    expect(bundle.promptMetadata.skillIds).toContain('compose-prompt');
  });

  it('scores and revises semantic prompt context', () => {
    const context = {
      sourceAnalysis: 'fast cuts',
      productName: 'AI-UGC Starter',
      productDescription: 'short desc',
      channel: 'tiktok',
      nichePackKey: 'ecommerce-product-ads',
      preferredProviderKey: 'laozhang',
    };

    const score = scoreSemanticPrompt(context);
    const revision = reviseSemanticPrompt(context);

    expect(score.overall).toBeGreaterThan(0);
    expect(revision.revisedPromptText).toContain('Revision Instruction');
  });

  it('parses skill policy rules and declared steps', () => {
    expect(
      parsePolicyRules(
        '# Policy\n\n- Must use declared blocks.\n- Must reject bad input.\n',
      ),
    ).toEqual(['Must use declared blocks.', 'Must reject bad input.']);

    expect(
      parseDeclaredSteps(
        '1. Validate input.\n2. Assemble blocks.\n3. Return output.\n',
      ),
    ).toEqual(['Validate input.', 'Assemble blocks.', 'Return output.']);
  });

  it('loads skill contract metadata from repo-owned files', () => {
    const contract = loadSkillContract('compose-prompt');

    expect(contract.policyRules.length).toBeGreaterThan(0);
    expect(contract.declaredSteps.length).toBeGreaterThan(0);
    expect(contract.definition.id).toBe('compose-prompt');
  });
});
