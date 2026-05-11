import { Injectable } from "@nestjs/common";

interface RouteMetric {
  count: number;
  failures: number;
  totalDurationMs: number;
}

@Injectable()
export class MetricsService {
  private readonly routes = new Map<string, RouteMetric>();

  record(routeKey: string, durationMs: number, success: boolean): void {
    const current = this.routes.get(routeKey) || {
      count: 0,
      failures: 0,
      totalDurationMs: 0,
    };

    current.count += 1;
    current.totalDurationMs += durationMs;
    if (!success) {
      current.failures += 1;
    }

    this.routes.set(routeKey, current);
  }

  snapshot() {
    return Object.fromEntries(
      [...this.routes.entries()].map(([route, metric]) => [
        route,
        {
          count: metric.count,
          failures: metric.failures,
          avgDurationMs:
            metric.count > 0 ? metric.totalDurationMs / metric.count : 0,
        },
      ]),
    );
  }
}
