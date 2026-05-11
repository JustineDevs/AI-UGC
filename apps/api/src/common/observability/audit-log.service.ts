import { appendFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { Injectable } from "@nestjs/common";
import type { AuditEvent } from "./index";

@Injectable()
export class AuditLogService {
  private readonly logPath = resolve(process.cwd(), ".omx/logs/api-audit.log");

  constructor() {
    mkdirSync(dirname(this.logPath), { recursive: true });
  }

  write(event: AuditEvent): void {
    appendFileSync(this.logPath, `${JSON.stringify(event)}\n`, "utf8");
  }
}
