import { createAuditEvent } from "../../src/common/observability";
import { MetricsService } from "../../src/common/observability/metrics.service";

describe("observability contract", () => {
  it("aggregates route metrics with count, failures, and average duration", () => {
    const metricsService = new MetricsService();

    metricsService.record("POST /sessions/:id/run", 120, true);
    metricsService.record("POST /sessions/:id/run", 180, false);

    expect(metricsService.snapshot()).toEqual({
      "POST /sessions/:id/run": {
        count: 2,
        failures: 1,
        avgDurationMs: 150,
      },
    });
  });

  it("creates audit events with request correlation metadata", () => {
    const event = createAuditEvent(
      "sessions",
      "semantic-run.completed",
      { providerKey: "laozhang" },
      {
        requestId: "req-1",
        actorId: "actor-1",
        workspaceId: "workspace-1",
      },
    );

    expect(event).toEqual(
      expect.objectContaining({
        scope: "sessions",
        event: "semantic-run.completed",
        requestId: "req-1",
        actorId: "actor-1",
        workspaceId: "workspace-1",
        metadata: { providerKey: "laozhang" },
      }),
    );
  });
});
