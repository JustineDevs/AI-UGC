import { Controller, Get } from "@nestjs/common";
import { MetricsService } from "./metrics.service";

@Controller("internal/metrics")
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  getMetrics() {
    return this.metricsService.snapshot();
  }
}
