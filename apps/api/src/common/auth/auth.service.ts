import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthSessionRepository } from "../../infrastructure/persistence/auth-session.repository";
import type { AuthSession } from "./auth-session.types";

@Injectable()
export class AuthService {
  constructor(private readonly authSessionRepository: AuthSessionRepository) {}

  async issueToken(input: {
    actorId: string;
    role: AuthSession["role"];
    allowedWorkspaceIds: string[];
  }): Promise<{ token: string; session: AuthSession }> {
    const issuedAt = new Date();
    const expiresAt = new Date(
      issuedAt.getTime() +
        Number.parseInt(process.env.AUTH_SESSION_TTL_HOURS || "24", 10) *
          60 *
          60 *
          1000,
    );

    const session: AuthSession = {
      sessionId: randomUUID(),
      actorId: input.actorId,
      role: input.role,
      allowedWorkspaceIds: input.allowedWorkspaceIds,
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    await this.authSessionRepository.save(session);

    const payload = Buffer.from(
      JSON.stringify({
        sessionId: session.sessionId,
        actorId: session.actorId,
        role: session.role,
        allowedWorkspaceIds: session.allowedWorkspaceIds,
        exp: session.expiresAt,
      }),
    ).toString("base64url");

    const signature = this.sign(payload);
    return {
      token: `${payload}.${signature}`,
      session,
    };
  }

  async verifyToken(token: string): Promise<AuthSession> {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) {
      throw new UnauthorizedException("Invalid token format");
    }

    const expectedSignature = this.sign(payload);
    if (
      !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      throw new UnauthorizedException("Invalid token signature");
    }

    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { sessionId: string; exp: string };
    const session = await this.authSessionRepository.findById(parsed.sessionId);
    if (!session) {
      throw new UnauthorizedException("Auth session not found");
    }

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      throw new UnauthorizedException("Auth session expired");
    }

    return session;
  }

  private sign(payload: string): string {
    return createHmac(
      "sha256",
      process.env.AUTH_TOKEN_SECRET || "changeme-very-long-secret",
    )
      .update(payload)
      .digest("base64url");
  }
}
