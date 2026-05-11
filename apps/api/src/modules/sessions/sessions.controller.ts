/**
 * SessionsController
 *
 * REST endpoints for session management.
 */

import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { SessionService } from "../../common/session.service";
import { Session } from "../../common/types/session.types";
import { WorkspaceOwnerGuard } from "../../common/guards/workspace-owner.guard";
import { v4 as uuidv4 } from "uuid";
import type { GenerationSession } from "@ai-ugc/domain";
import { GenerationSessionMemoryRepository } from "../../infrastructure/persistence/generation-session.memory-repository";
import { ProjectProfileMemoryRepository } from "../../infrastructure/persistence/project-profile.memory-repository";
import { SessionRunService } from "./session-run.service";
import { SessionStatusService } from "./session-status.service";

@Controller()
export class SessionsController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly generationSessionRepository: GenerationSessionMemoryRepository,
    private readonly projectProfileRepository: ProjectProfileMemoryRepository,
    private readonly sessionRunService: SessionRunService,
    private readonly sessionStatusService: SessionStatusService,
  ) {}

  /**
   * Create a new session
   * POST /sessions
   */
  @Post("sessions")
  createSession(): { sessionId: string; session: Session } {
    const session = this.sessionService.createSession();
    console.log("Session created:", session.sessionId);
    return {
      sessionId: session.sessionId,
      session,
    };
  }

  /**
   * Get session by ID
   * GET /sessions/:sessionId
   */
  @Get("sessions/:sessionId")
  async getSession(@Param("sessionId") sessionId: string) {
    return this.sessionStatusService.getSession(sessionId);
  }

  @Post("projects/:projectId/sessions")
  @UseGuards(WorkspaceOwnerGuard)
  async createGenerationSession(
    @Param("projectId") projectId: string,
    @Body()
    body: { channelTarget: string; campaignInputs?: Record<string, unknown> },
  ): Promise<GenerationSession> {
    const project = await this.projectProfileRepository.findById(projectId);

    const session: GenerationSession = {
      id: uuidv4(),
      projectProfileId: projectId,
      workflowBlueprintSnapshot: {
        workflowBlueprintId: project?.workflowBlueprintId || "",
      },
      status: "created",
      channelTarget: body.channelTarget,
      campaignInputs: body.campaignInputs || {},
      providerRoutingTrace: {
        initializedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.generationSessionRepository.save(session);
  }

  @Post("sessions/:sessionId/run")
  @UseGuards(WorkspaceOwnerGuard)
  async runGenerationSession(@Param("sessionId") sessionId: string) {
    return this.sessionRunService.run(sessionId);
  }
}
