import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthSessionRequestDto } from "./dto/create-auth-session-request.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sessions")
  async createSession(@Body() body: CreateAuthSessionRequestDto) {
    return this.authService.issueToken(body);
  }

  @Get("sessions/:token")
  async verifySession(@Param("token") token: string) {
    return this.authService.verifyToken(token);
  }
}
