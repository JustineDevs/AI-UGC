import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { WorkspaceOwnerGuard } from "../../common/guards/workspace-owner.guard";
import { ValidateProviderRequestDto } from "./dto/validate-provider-request.dto";
import { UpsertProviderProfileRequestDto } from "./dto/upsert-provider-profile-request.dto";
import { ProviderValidationService } from "./provider-validation.service";
import { ProvidersService } from "./providers.service";

@Controller()
export class ProvidersController {
  constructor(
    private readonly providerValidationService: ProviderValidationService,
    private readonly providersService: ProvidersService,
  ) {}

  @Post("providers/validate")
  async validateProvider(@Body() body: ValidateProviderRequestDto) {
    return this.providerValidationService.validate(body.providerKey);
  }

  @Post("workspaces/:workspaceId/providers")
  @UseGuards(WorkspaceOwnerGuard)
  async upsertProviderProfile(
    @Param("workspaceId") workspaceId: string,
    @Body() body: UpsertProviderProfileRequestDto,
  ) {
    return this.providersService.upsertProfile(workspaceId, body);
  }

  @Get("workspaces/:workspaceId/providers")
  async listProviderProfiles(@Param("workspaceId") workspaceId: string) {
    return this.providersService.listByWorkspace(workspaceId);
  }
}
