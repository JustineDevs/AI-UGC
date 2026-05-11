export class ProviderCapabilityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProviderCapabilityError';
  }
}

export class ProviderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProviderValidationError';
  }
}
