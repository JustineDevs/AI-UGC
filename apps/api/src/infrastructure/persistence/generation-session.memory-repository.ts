import { Injectable } from "@nestjs/common";
import type { GenerationSession } from "@ai-ugc/domain";
import type { GenerationSessionRepository } from "@ai-ugc/domain";
import { loadRecord, upsertRecord } from "../database/database";

@Injectable()
export class GenerationSessionMemoryRepository implements GenerationSessionRepository {
  async save(session: GenerationSession): Promise<GenerationSession> {
    upsertRecord("generation_sessions", session.id, session, {
      project_profile_id: session.projectProfileId,
      status: session.status,
      channel_target: session.channelTarget,
    });
    return session;
  }

  async findById(id: string): Promise<GenerationSession | null> {
    const rows = await loadRecord<GenerationSession>(
      "generation_sessions",
      "id = ?",
      [id],
    );
    return rows[0] || null;
  }
}
