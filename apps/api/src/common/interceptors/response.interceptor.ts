/**
 * ResponseInterceptor
 *
 * Transforms all successful responses into consistent API format.
 * Adds meta information (timestamp, requestId) to every response.
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { type ApiSuccessResponse } from "@ai-ugc/contracts";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MetricsService } from "../observability/metrics.service";

/**
 * ResponseInterceptor wraps all successful responses in standard format
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiSuccessResponse<T>
> {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const requestId = request.requestId || "missing-request-id";
    const routeKey = `${request.method || "UNKNOWN"} ${request.route?.path || request.url || "unknown"}`;
    const startedAt = request.requestStartedAt || Date.now();

    return next.handle().pipe(
      map((data) => {
        this.metricsService.record(routeKey, Date.now() - startedAt, true);
        return {
          success: true,
          data,
          meta: {
            timestamp: new Date().toISOString(),
            requestId,
          },
        };
      }),
    );
  }
}
