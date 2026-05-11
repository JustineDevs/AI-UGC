import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  ProviderRegistry,
  type ProviderValidationResult,
} from "@ai-ugc/provider-core";

@Injectable()
export class ProviderValidationService {
  constructor(
    @Inject(ProviderRegistry)
    private readonly providerRegistry: ProviderRegistry,
  ) {}

  async validate(providerKey: string): Promise<ProviderValidationResult> {
    const adapter = this.providerRegistry.get(providerKey);
    if (!adapter) {
      throw new NotFoundException(
        `Provider "${providerKey}" is not registered`,
      );
    }

    return adapter.validate();
  }
}
