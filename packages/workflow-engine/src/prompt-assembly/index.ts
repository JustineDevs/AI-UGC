export const buildPromptAssemblyConfig = (
  modules: string[],
  semantic?: {
    templateId?: string;
    promptBlockIds?: string[];
    skillIds?: string[];
    providerPromptIds?: string[];
    guardPromptIds?: string[];
  },
) => ({
  modules,
  strategy: "ordered",
  semantic: {
    templateId: semantic?.templateId,
    promptBlockIds: semantic?.promptBlockIds || [],
    skillIds: semantic?.skillIds || [],
    providerPromptIds: semantic?.providerPromptIds || [],
    guardPromptIds: semantic?.guardPromptIds || [],
  },
});
