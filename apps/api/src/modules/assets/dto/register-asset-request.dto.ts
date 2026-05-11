import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class RegisterAssetRequestDto {
  @IsString()
  assetType!: string;

  @IsString()
  fileName!: string;

  @IsString()
  mimeType!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  fileSizeBytes?: number;
}
