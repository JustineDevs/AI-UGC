import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateProjectRequestDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  workflowBlueprintId!: string;

  @IsString()
  brandVoice!: string;

  @IsString()
  audience!: string;

  @IsString()
  offerDetails!: string;

  @IsArray()
  @IsString({ each: true })
  channelTargets!: string[];
}
