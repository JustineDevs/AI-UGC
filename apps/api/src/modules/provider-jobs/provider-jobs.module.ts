import { Module } from "@nestjs/common";
import { AuditLogService } from "../../common/observability/audit-log.service";
import { ProviderJobMemoryRepository } from "../../infrastructure/persistence/provider-job.memory-repository";
import { ProviderJobsController } from "./provider-jobs.controller";
import { ProviderJobsService } from "./provider-jobs.service";
import { ProviderJobAuditService } from "./provider-job-audit.service";

@Module({
  controllers: [ProviderJobsController],
  providers: [
    AuditLogService,
    ProviderJobMemoryRepository,
    ProviderJobsService,
    ProviderJobAuditService,
  ],
  exports: [ProviderJobsService, ProviderJobAuditService],
})
export class ProviderJobsModule {}
