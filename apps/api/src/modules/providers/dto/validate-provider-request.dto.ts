import { IsOptional, IsString, IsUrl } from "class-validator";

export class ValidateProviderRequestDto {
  @IsString()
  providerKey!: string;

  @IsString()
  apiKey!: string;

  @IsUrl({
    require_protocol: true,
  })
  baseUrl!: string;

  @IsOptional()
  @IsString()
  textModel?: string;

  @IsOptional()
  @IsString()
  videoModel?: string;
}
