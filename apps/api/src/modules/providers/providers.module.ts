import { Module } from "@nestjs/common";
import { apimartAdapter } from "@ai-ugc/provider-apimart";
import {
  ProviderRegistry,
  createProviderRegistry,
} from "@ai-ugc/provider-core";
import { sampleProviderAdapter } from "@ai-ugc/provider-core/src/stubs/sample-provider";
import { WorkspaceOwnerGuard } from "../../common/guards/workspace-owner.guard";
import { laozhangAdapter } from "@ai-ugc/provider-laozhang";
import { WorkspaceAuthService } from "../../common/auth/workspace-auth.service";
import { AuditLogService } from "../../common/observability/audit-log.service";
import { ProviderProfileMemoryRepository } from "../../infrastructure/persistence/provider-profile.memory-repository";
import { ProvidersController } from "./providers.controller";
import { ProvidersService } from "./providers.service";
import { ProviderValidationService } from "./provider-validation.service";

@Module({
  controllers: [ProvidersController],
  providers: [
    {
      provide: ProviderRegistry,
      useFactory: () =>
        createProviderRegistry([
          laozhangAdapter,
          apimartAdapter,
          sampleProviderAdapter,
        ]),
    },
    WorkspaceAuthService,
    WorkspaceOwnerGuard,
    AuditLogService,
    ProviderProfileMemoryRepository,
    ProvidersService,
    ProviderValidationService,
  ],
  exports: [ProvidersService, ProviderValidationService],
})
export class ProvidersModule {}
