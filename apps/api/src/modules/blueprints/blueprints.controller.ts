import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { WorkspaceOwnerGuard } from "../../common/guards/workspace-owner.guard";
import { BlueprintsService } from "./blueprints.service";
import { CreateBlueprintRequestDto } from "./dto/create-blueprint-request.dto";

@Controller()
export class BlueprintsController {
  constructor(private readonly blueprintsService: BlueprintsService) {}

  @Post("workspaces/:workspaceId/blueprints")
  @UseGuards(WorkspaceOwnerGuard)
  async createBlueprint(
    @Param("workspaceId") workspaceId: string,
    @Body() body: CreateBlueprintRequestDto,
  ) {
    return this.blueprintsService.createBlueprint(workspaceId, body);
  }

  @Get("blueprints/:blueprintId")
  async getBlueprint(@Param("blueprintId") blueprintId: string) {
    return this.blueprintsService.getBlueprint(blueprintId);
  }
}
