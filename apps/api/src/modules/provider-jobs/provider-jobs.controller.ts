import { Controller, Get, Param } from "@nestjs/common";
import { ProviderJobsService } from "./provider-jobs.service";

@Controller("sessions/:sessionId/provider-jobs")
export class ProviderJobsController {
  constructor(private readonly providerJobsService: ProviderJobsService) {}

  @Get()
  async listBySession(@Param("sessionId") sessionId: string) {
    return this.providerJobsService.listBySession(sessionId);
  }
}
