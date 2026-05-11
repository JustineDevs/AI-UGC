/**
 * AppModule
 *
 * Root application module that imports all feature modules.
 */

import { Module, Global } from "@nestjs/common";
import { AuthModule } from "./common/auth/auth.module";
import { MetricsController } from "./common/observability/metrics.controller";
import { MetricsService } from "./common/observability/metrics.service";
import { StorageModule } from "./modules/storage/storage.module";
import { VideoModule } from "./modules/video/video.module";
import { AnalysisModule } from "./modules/analysis/analysis.module";
import { SessionsModule } from "./modules/sessions/sessions.module";
import { ProductModule } from "./modules/product/product.module";
import { PromptModule } from "./modules/prompt/prompt.module";
import { GenerationModule } from "./modules/generation/generation.module";
import { AssetsModule } from "./modules/assets/assets.module";
import { WorkspacesModule } from "./modules/workspaces/workspaces.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { BlueprintsModule } from "./modules/blueprints/blueprints.module";
import { ProviderJobsModule } from "./modules/provider-jobs/provider-jobs.module";
import { ProvidersModule } from "./modules/providers/providers.module";
import { SessionService } from "./common/session.service";

@Global()
@Module({
  imports: [
    AuthModule,
    StorageModule,
    VideoModule,
    AnalysisModule,
    SessionsModule,
    ProductModule,
    PromptModule,
    GenerationModule,
    AssetsModule,
    WorkspacesModule,
    ProjectsModule,
    BlueprintsModule,
    ProviderJobsModule,
    ProvidersModule,
  ],
  controllers: [MetricsController],
  providers: [SessionService, MetricsService],
  exports: [SessionService, MetricsService],
})
export class AppModule {}
