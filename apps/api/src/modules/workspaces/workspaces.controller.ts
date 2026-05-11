import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { WorkspaceOwnerGuard } from "../../common/guards/workspace-owner.guard";
import { CreateWorkspaceRequestDto } from "./dto/create-workspace-request.dto";
import { WorkspacesService } from "./workspaces.service";

@Controller("workspaces")
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @UseGuards(WorkspaceOwnerGuard)
  async createWorkspace(@Body() body: CreateWorkspaceRequestDto) {
    return this.workspacesService.createWorkspace(body);
  }

  @Get(":workspaceId")
  async getWorkspace(@Param("workspaceId") workspaceId: string) {
    return this.workspacesService.getWorkspace(workspaceId);
  }
}
