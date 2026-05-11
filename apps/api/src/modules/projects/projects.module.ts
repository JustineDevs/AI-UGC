import { Module } from "@nestjs/common";
import { ProjectProfileMemoryRepository } from "../../infrastructure/persistence/project-profile.memory-repository";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";

@Module({
  controllers: [ProjectsController],
  providers: [ProjectProfileMemoryRepository, ProjectsService],
  exports: [ProjectProfileMemoryRepository, ProjectsService],
})
export class ProjectsModule {}
