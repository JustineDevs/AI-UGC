declare module "node:sqlite" {
  export class StatementSync {
    run(...params: unknown[]): { changes: number };
    all(...params: unknown[]): Array<Record<string, unknown>>;
  }

  export class DatabaseSync {
    constructor(path: string);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
  }
}
