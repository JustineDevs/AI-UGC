import { Injectable } from "@nestjs/common";
import { createAuditEvent } from "../../common/observability";
import { AuditLogService } from "../../common/observability/audit-log.service";

@Injectable()
export class ProviderJobAuditService {
  constructor(private readonly auditLogService: AuditLogService) {}

  record(
    event: string,
    metadata?: Record<string, unknown>,
    context?: {
      requestId?: string;
      actorId?: string;
      workspaceId?: string;
    },
  ) {
    const auditEvent = createAuditEvent(
      "provider-job",
      event,
      metadata,
      context,
    );
    this.auditLogService.write(auditEvent);
    return auditEvent;
  }
}
