import { ForbiddenException } from "@nestjs/common";
import { AuthService } from "../../src/common/auth/auth.service";
import { WorkspaceAuthService } from "../../src/common/auth/workspace-auth.service";
import { WorkspaceOwnerGuard } from "../../src/common/guards/workspace-owner.guard";
import { AuthSessionRepository } from "../../src/infrastructure/persistence/auth-session.repository";

describe("auth contract", () => {
  beforeEach(() => {
    process.env.AUTH_TOKEN_SECRET = "test-secret-for-auth-contract";
  });

  it("issues and verifies bearer tokens", async () => {
    const authService = new AuthService(new AuthSessionRepository());

    const issued = await authService.issueToken({
      actorId: "actor-1",
      role: "editor",
      allowedWorkspaceIds: ["workspace-1"],
    });

    const verified = await authService.verifyToken(issued.token);

    expect(verified.actorId).toBe("actor-1");
    expect(verified.role).toBe("editor");
    expect(verified.allowedWorkspaceIds).toEqual(["workspace-1"]);
  });

  it("builds workspace auth context from a bearer token", async () => {
    const authService = new AuthService(new AuthSessionRepository());
    const workspaceAuthService = new WorkspaceAuthService(authService);

    const issued = await authService.issueToken({
      actorId: "actor-2",
      role: "admin",
      allowedWorkspaceIds: ["workspace-2"],
    });

    const context = await workspaceAuthService.buildContext({
      params: { workspaceId: "workspace-2" },
      header(name: string) {
        return name.toLowerCase() === "authorization"
          ? `Bearer ${issued.token}`
          : undefined;
      },
    } as never);

    expect(context).toEqual({
      workspaceId: "workspace-2",
      actorId: "actor-2",
      allowedWorkspaceIds: ["workspace-2"],
      role: "admin",
    });
  });

  it("blocks viewer mutations through the workspace guard", async () => {
    const guard = new WorkspaceOwnerGuard({
      buildContext: async () => ({
        workspaceId: "workspace-3",
        actorId: "actor-3",
        allowedWorkspaceIds: ["workspace-3"],
        role: "viewer",
      }),
    } as unknown as WorkspaceAuthService);

    const request = {} as { workspaceAuthContext?: unknown };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as never;

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });
});
