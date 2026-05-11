import { Module } from "@nestjs/common";
import { AuthSessionRepository } from "../../infrastructure/persistence/auth-session.repository";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { WorkspaceAuthService } from "./workspace-auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthSessionRepository, AuthService, WorkspaceAuthService],
  exports: [AuthSessionRepository, AuthService, WorkspaceAuthService],
})
export class AuthModule {}
