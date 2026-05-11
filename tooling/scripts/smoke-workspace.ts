const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const {
  WorkspacesService,
} = require("../../apps/api/src/modules/workspaces/workspaces.service");
const {
  WorkspaceTemplateMemoryRepository,
} = require("../../apps/api/src/infrastructure/persistence/workspace-template.memory-repository");
const {
  BlueprintsService,
} = require("../../apps/api/src/modules/blueprints/blueprints.service");
const {
  WorkflowBlueprintMemoryRepository,
} = require("../../apps/api/src/infrastructure/persistence/workflow-blueprint.memory-repository");
const {
  ProjectsService,
} = require("../../apps/api/src/modules/projects/projects.service");
const {
  ProjectProfileMemoryRepository,
} = require("../../apps/api/src/infrastructure/persistence/project-profile.memory-repository");

const workspaceFixture = JSON.parse(
  readFileSync(
    resolve(
      process.cwd(),
      "tooling/fixtures/workspaces/ecommerce-laozhang.workspace-template.json",
    ),
    "utf8",
  ),
);

async function main() {
  const workspacesService = new WorkspacesService(
    new WorkspaceTemplateMemoryRepository(),
  );
  const blueprintsService = new BlueprintsService(
    new WorkflowBlueprintMemoryRepository(),
  );
  const projectsService = new ProjectsService(
    new ProjectProfileMemoryRepository(),
  );

  const workspace = await workspacesService.createWorkspace({
    name: workspaceFixture.workspaceTemplate.name,
    slug: workspaceFixture.workspaceTemplate.slug,
    enabledNichePackKeys: workspaceFixture.workspaceTemplate.enabledNichePackKeys,
  });

  const blueprint = await blueprintsService.createBlueprint(workspace.id, {
    name: workspaceFixture.projectProfile.workflowBlueprintId,
    nichePackKey: workspaceFixture.workspaceTemplate.enabledNichePackKeys[0],
    intakeSchema: {
      requiredAssetTypes: ["source_video", "product_image"],
    },
    stepGraph: {
      start: "collect-inputs",
    },
  });

  const project = await projectsService.createProject(workspace.id, {
    name: workspaceFixture.projectProfile.name,
    workflowBlueprintId: blueprint.id,
    brandVoice: workspaceFixture.projectProfile.brandVoice,
    audience: workspaceFixture.projectProfile.audience,
    offerDetails: workspaceFixture.projectProfile.offerDetails,
    channelTargets: workspaceFixture.projectProfile.channelTargets,
  });

  console.log(
    JSON.stringify(
      {
        workspaceId: workspace.id,
        blueprintId: blueprint.id,
        projectId: project.id,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
