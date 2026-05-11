import { Injectable } from "@nestjs/common";
import { loadRecord, upsertRecord } from "../database/database";
import type { AuthSession } from "../../common/auth/auth-session.types";

@Injectable()
export class AuthSessionRepository {
  async save(session: AuthSession): Promise<AuthSession> {
    await upsertRecord("auth_sessions", session.sessionId, session, {
      actor_id: session.actorId,
      role: session.role,
    });
    return session;
  }

  async findById(sessionId: string): Promise<AuthSession | null> {
    const rows = await loadRecord<AuthSession>("auth_sessions", "id = ?", [
      sessionId,
    ]);
    return rows[0] || null;
  }
}
