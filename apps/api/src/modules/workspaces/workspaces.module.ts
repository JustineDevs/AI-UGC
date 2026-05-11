import { Module } from "@nestjs/common";
import { WorkspaceTemplateMemoryRepository } from "../../infrastructure/persistence/workspace-template.memory-repository";
import { WorkspacesController } from "./workspaces.controller";
import { WorkspacesService } from "./workspaces.service";

@Module({
  controllers: [WorkspacesController],
  providers: [WorkspaceTemplateMemoryRepository, WorkspacesService],
  exports: [WorkspaceTemplateMemoryRepository, WorkspacesService],
})
export class WorkspacesModule {}
