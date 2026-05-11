import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { WorkspaceOwnerGuard } from "../../common/guards/workspace-owner.guard";
import { CreateProjectRequestDto } from "./dto/create-project-request.dto";
import { ProjectsService } from "./projects.service";

@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post("workspaces/:workspaceId/projects")
  @UseGuards(WorkspaceOwnerGuard)
  async createProject(
    @Param("workspaceId") workspaceId: string,
    @Body() body: CreateProjectRequestDto,
  ) {
    return this.projectsService.createProject(workspaceId, body);
  }

  @Get("projects/:projectId")
  async getProject(@Param("projectId") projectId: string) {
    return this.projectsService.getProject(projectId);
  }
}
