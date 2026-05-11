import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { RegisterAssetRequestDto } from "./dto/register-asset-request.dto";
import { AssetsService } from "./assets.service";

@Controller("sessions/:sessionId/assets")
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  async registerAsset(
    @Param("sessionId") sessionId: string,
    @Body() body: RegisterAssetRequestDto,
  ) {
    return this.assetsService.registerAsset(sessionId, body);
  }

  @Get()
  async listAssets(@Param("sessionId") sessionId: string) {
    return this.assetsService.listAssets(sessionId);
  }
}
