export interface WorkspaceAuthContext {
  workspaceId?: string;
  actorId?: string;
  allowedWorkspaceIds: string[];
  role: "owner" | "admin" | "editor" | "viewer";
}
