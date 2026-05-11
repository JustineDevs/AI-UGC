import { Injectable } from "@nestjs/common";
import type { Request } from "express";
import type { WorkspaceAuthContext } from "./workspace-auth.types";
import { AuthService } from "./auth.service";

@Injectable()
export class WorkspaceAuthService {
  constructor(private readonly authService: AuthService) {}

  async buildContext(request: Request): Promise<WorkspaceAuthContext> {
    const authorization = request.header("authorization");
    if (authorization?.startsWith("Bearer ")) {
      const token = authorization.slice("Bearer ".length);
      const authSession = await this.authService.verifyToken(token);
      return {
        workspaceId: request.params.workspaceId || request.params.projectId,
        actorId: authSession.actorId,
        allowedWorkspaceIds: authSession.allowedWorkspaceIds,
        role: authSession.role,
      };
    }

    const workspaceIdsHeader =
      request.header("x-ai-ugc-workspace-ids") ||
      request.header("x-workspace-ids");
    const roleHeader = request.header("x-ai-ugc-role") || "owner";
    const actorId = request.header("x-ai-ugc-actor-id") || undefined;

    const allowedWorkspaceIds = workspaceIdsHeader
      ? workspaceIdsHeader
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
      : [];

    return {
      workspaceId: request.params.workspaceId || request.params.projectId,
      actorId,
      allowedWorkspaceIds,
      role: ["owner", "admin", "editor", "viewer"].includes(roleHeader)
        ? (roleHeader as WorkspaceAuthContext["role"])
        : "owner",
    };
  }
}
