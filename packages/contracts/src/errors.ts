export const API_ERROR_CODES = {
  badRequest: 'BAD_REQUEST',
  notFound: 'NOT_FOUND',
  validation: 'VALIDATION_ERROR',
  providerUnsupported: 'PROVIDER_UNSUPPORTED',
  providerValidationFailed: 'PROVIDER_VALIDATION_FAILED',
  providerJobFailed: 'PROVIDER_JOB_FAILED',
  internal: 'INTERNAL_SERVER_ERROR',
} as const;

export type ApiErrorCode =
  (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];
