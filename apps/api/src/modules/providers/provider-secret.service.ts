import { Injectable } from "@nestjs/common";
import { getSecretReference } from "@ai-ugc/config/src/secrets";

@Injectable()
export class ProviderSecretService {
  mask(secretRef: string | undefined): string {
    return getSecretReference(secretRef);
  }
}
