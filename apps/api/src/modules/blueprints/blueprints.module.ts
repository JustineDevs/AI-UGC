import { Module } from "@nestjs/common";
import { WorkflowBlueprintMemoryRepository } from "../../infrastructure/persistence/workflow-blueprint.memory-repository";
import { BlueprintsController } from "./blueprints.controller";
import { BlueprintsService } from "./blueprints.service";

@Module({
  controllers: [BlueprintsController],
  providers: [WorkflowBlueprintMemoryRepository, BlueprintsService],
  exports: [WorkflowBlueprintMemoryRepository, BlueprintsService],
})
export class BlueprintsModule {}
