import usefulAiPromptsCollection from "../../../../collections/useful-ai-prompts/COLLECTION.json";
import usefulAiPromptsCurated from "../../../../collections/useful-ai-prompts/AI-UGC-CURATED.json";

export interface PromptCollectionManifest {
  id: string;
  label: string;
  version: string;
  source: {
    repository: string;
    url: string;
    license: string;
    commit: string;
    fetched_at: string;
  };
  resource_counts: {
    prompts: number;
    skills: number;
    hooks: number;
    system_prompts: number;
  };
  integration_mode: string;
  runtime_integration: {
    auto_loaded_by_workflow_engine: boolean;
    repo_owned_runtime_surfaces: string[];
    bridge_manifest: string;
  };
  paths: {
    prompt_index: string;
    prompts: string;
    skills: string;
    hooks: string;
    system_prompts: string;
  };
  notes: string[];
}

export interface CuratedCollectionPrompt {
  slug: string;
  title: string;
  category: string;
  file_path: string;
  best_for: string[];
  ai_ugc_usage: string;
}

export interface CuratedCollectionSkill {
  slug: string;
  file_path: string;
  ai_ugc_usage: string;
}

export interface CuratedCollectionManifest {
  id: string;
  collection_id: string;
  label: string;
  description: string;
  recommended_prompts: CuratedCollectionPrompt[];
  recommended_skills: CuratedCollectionSkill[];
  suggested_usage_order: string[];
}

const promptCollections = [
  usefulAiPromptsCollection as PromptCollectionManifest,
];

const curatedCollectionManifests = [
  usefulAiPromptsCurated as CuratedCollectionManifest,
];

const promptCollectionMap = new Map(
  promptCollections.map((collection) => [collection.id, collection]),
);

const curatedCollectionMap = new Map(
  curatedCollectionManifests.map((manifest) => [manifest.collection_id, manifest]),
);

export const listPromptCollections = (): PromptCollectionManifest[] =>
  promptCollections;

export const getPromptCollection = (
  id: string,
): PromptCollectionManifest | undefined => promptCollectionMap.get(id);

export const getCuratedCollectionManifest = (
  collectionId: string,
): CuratedCollectionManifest | undefined => curatedCollectionMap.get(collectionId);

export const listCuratedCollectionPrompts = (
  collectionId: string,
): CuratedCollectionPrompt[] =>
  getCuratedCollectionManifest(collectionId)?.recommended_prompts || [];

export const listCuratedCollectionSkills = (
  collectionId: string,
): CuratedCollectionSkill[] =>
  getCuratedCollectionManifest(collectionId)?.recommended_skills || [];
