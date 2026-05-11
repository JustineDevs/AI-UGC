import { defaultBlueprintSteps } from '../blueprints';

describe('defaultBlueprintSteps', () => {
  it('defines an ordered default workflow scaffold', () => {
    expect(defaultBlueprintSteps.map((step) => step.id)).toEqual([
      'collect-inputs',
      'analyze-source',
      'assemble-prompt',
      'moderate-prompt',
      'generate-output',
    ]);
  });
});
