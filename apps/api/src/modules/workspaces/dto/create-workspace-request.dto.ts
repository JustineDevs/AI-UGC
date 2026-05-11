import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateWorkspaceRequestDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsArray()
  @IsString({ each: true })
  enabledNichePackKeys!: string[];
}
