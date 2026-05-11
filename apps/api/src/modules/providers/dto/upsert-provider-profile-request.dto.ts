import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from "class-validator";

export class UpsertProviderProfileRequestDto {
  @IsString()
  providerKey!: string;

  @IsString()
  displayName!: string;

  @IsUrl({
    require_protocol: true,
  })
  baseUrl!: string;

  @IsString()
  apiKeySecretRef!: string;

  @IsString()
  defaultTextModel!: string;

  @IsString()
  defaultVideoModel!: string;

  @IsOptional()
  @IsString()
  defaultImageModel?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  enabledCapabilities!: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  fallbackPriority?: number;
}
