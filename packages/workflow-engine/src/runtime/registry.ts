import type { SkillDefinition } from "../skills";
import type { SkillHandlerMap } from "./executor";

export const createSkillHandlerRegistry = (
  skills: SkillDefinition[],
  availableHandlers: SkillHandlerMap,
): SkillHandlerMap => {
  const registry: SkillHandlerMap = {};

  for (const skill of skills) {
    const handler = availableHandlers[skill.id];
    if (handler) {
      registry[skill.id] = handler;
    }
  }

  return registry;
};
