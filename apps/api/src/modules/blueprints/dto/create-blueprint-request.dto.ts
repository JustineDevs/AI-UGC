import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class CreateBlueprintRequestDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  nichePackKey?: string;

  @IsObject()
  intakeSchema!: Record<string, unknown>;

  @IsObject()
  stepGraph!: Record<string, unknown>;
}
