export interface AuditEvent {
  scope: string;
  event: string;
  at: string;
  metadata?: Record<string, unknown>;
  requestId?: string;
  actorId?: string;
  workspaceId?: string;
}

export const createAuditEvent = (
  scope: string,
  event: string,
  metadata?: Record<string, unknown>,
  context?: {
    requestId?: string;
    actorId?: string;
    workspaceId?: string;
  },
): AuditEvent => ({
  scope,
  event,
  at: new Date().toISOString(),
  metadata,
  requestId: context?.requestId,
  actorId: context?.actorId,
  workspaceId: context?.workspaceId,
});

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      requestStartedAt?: number;
      workspaceAuthContext?: {
        actorId?: string;
        workspaceId?: string;
      };
    }
  }
}
