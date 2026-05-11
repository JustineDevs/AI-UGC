import { randomUUID } from "node:crypto";

export interface RequestContext {
  requestId: string;
  actorId?: string;
  workspaceId?: string;
  scope: string;
}

export const createRequestContext = (input: {
  actorId?: string;
  workspaceId?: string;
  scope: string;
}): RequestContext => ({
  requestId: randomUUID(),
  actorId: input.actorId,
  workspaceId: input.workspaceId,
  scope: input.scope,
});
