import { IsArray, IsIn, IsString } from "class-validator";

export class CreateAuthSessionRequestDto {
  @IsString()
  actorId!: string;

  @IsIn(["owner", "admin", "editor", "viewer"])
  role!: "owner" | "admin" | "editor" | "viewer";

  @IsArray()
  @IsString({ each: true })
  allowedWorkspaceIds!: string[];
}
