import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { WorkspaceAuthService } from "../auth/workspace-auth.service";

@Injectable()
export class WorkspaceOwnerGuard implements CanActivate {
  constructor(private readonly workspaceAuthService: WorkspaceAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authContext = await this.workspaceAuthService.buildContext(request);

    if (
      authContext.workspaceId &&
      authContext.allowedWorkspaceIds.length > 0 &&
      !authContext.allowedWorkspaceIds.includes(authContext.workspaceId)
    ) {
      throw new ForbiddenException("Workspace access denied");
    }

    if (authContext.role === "viewer") {
      throw new ForbiddenException("Viewer role cannot mutate workspace state");
    }

    request.workspaceAuthContext = authContext;
    return true;
  }
}
