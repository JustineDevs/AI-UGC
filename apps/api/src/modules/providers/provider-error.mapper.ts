import { BadRequestException } from "@nestjs/common";

export const mapProviderError = (error: unknown): Error => {
  if (error instanceof Error) {
    return new BadRequestException(error.message);
  }

  return new BadRequestException("Unknown provider error");
};
