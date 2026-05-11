export interface ApiMeta {
  timestamp: string;
  requestId: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: ApiMeta;
}

export interface ApiErrorDetails {
  code: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  data?: undefined;
  error: ApiErrorDetails;
  meta: ApiMeta & {
    path?: string;
  };
}

export type ApiResponseEnvelope<T> = ApiSuccessResponse<T> | ApiErrorResponse;
