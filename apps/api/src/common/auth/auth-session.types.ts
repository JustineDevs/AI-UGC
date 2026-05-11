export interface AuthSession {
  sessionId: string;
  actorId: string;
  role: "owner" | "admin" | "editor" | "viewer";
  allowedWorkspaceIds: string[];
  issuedAt: string;
  expiresAt: string;
}
