export const buildProviderTelemetry = (
  providerKey: string,
  capabilityType: string,
) => ({
  providerKey,
  capabilityType,
  recordedAt: new Date().toISOString(),
});
