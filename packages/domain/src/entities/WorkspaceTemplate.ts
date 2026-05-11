export interface WorkspaceTemplate {
  id: string;
  name: string;
  slug: string;
  defaultProviderProfileId: string;
  storageProfileId: string;
  enabledNichePackKeys: string[];
  createdAt: string;
  updatedAt: string;
}
