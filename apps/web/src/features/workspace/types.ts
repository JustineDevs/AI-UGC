import type { CustomNicheInput } from "@ai-ugc/workflow-engine";

export type ProviderKey = string;

export type BuiltInNichePack = {
  key: string;
  version: string;
  label: string;
  description: string;
  defaultChannelTargets: string[];
  requiredAssetTypes: string[];
  intakeSchemaRef: string;
  promptModuleRefs: string[];
  outputPolicyRef: string;
  status: "active" | "deprecated";
};

export interface ProjectProfileDraft {
  name: string;
  selectedBlueprint: string;
  brandVoice: string;
  audience: string;
  offerDetails: string;
  claimsPolicy: string[];
  channelTargets: string[];
  forbiddenTerms: string[];
  assetConstraints: {
    aspectRatio: string;
    durationSeconds: string;
    ctaPolicy: string;
  };
}

export interface WorkspaceSetupDraft {
  workspaceId: string;
  projectId?: string;
  name: string;
  slug: string;
  defaultProviderKey: ProviderKey;
  nicheMode: "bundled" | "custom";
  selectedBundledKey: string;
  customNicheInput: CustomNicheInput;
  projectProfile: ProjectProfileDraft;
  persistedBlueprintId?: string;
  savedAt?: string;
}
