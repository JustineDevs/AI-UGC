import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { Pool } from "pg";

type SqliteDriver = {
  kind: "sqlite";
  db: DatabaseSync;
};

type PostgresDriver = {
  kind: "postgres";
  pool: Pool;
};

type DatabaseDriver = SqliteDriver | PostgresDriver;

let sharedDriver: DatabaseDriver | null = null;

const resolveDatabaseUrl = (): string =>
  process.env.DATABASE_URL || "file:./.data/ai-ugc.sqlite";

const isPostgresUrl = (databaseUrl: string): boolean =>
  databaseUrl.startsWith("postgres://") ||
  databaseUrl.startsWith("postgresql://");

const resolveSqlitePath = (databaseUrl: string): string => {
  if (databaseUrl.startsWith("file:")) {
    return resolve(process.cwd(), databaseUrl.replace(/^file:/, ""));
  }

  return resolve(process.cwd(), ".data/ai-ugc.sqlite");
};

export const getDatabaseDriver = async (): Promise<DatabaseDriver> => {
  if (sharedDriver) {
    return sharedDriver;
  }

  const databaseUrl = resolveDatabaseUrl();

  if (isPostgresUrl(databaseUrl)) {
    const pool = new Pool({
      connectionString: databaseUrl,
    });
    await initializePostgres(pool);
    sharedDriver = {
      kind: "postgres",
      pool,
    };
    return sharedDriver;
  }

  const sqlitePath = resolveSqlitePath(databaseUrl);
  mkdirSync(dirname(sqlitePath), { recursive: true });
  const db = new DatabaseSync(sqlitePath);
  initializeSqlite(db);
  sharedDriver = {
    kind: "sqlite",
    db,
  };
  return sharedDriver;
};

export const upsertRecord = async (
  tableName: string,
  id: string,
  payload: object,
  columns: Record<string, unknown>,
) => {
  const driver = await getDatabaseDriver();
  const serializedPayload = JSON.stringify(payload);
  const payloadRecord = payload as Record<string, unknown>;
  const updatedAt =
    typeof payloadRecord.updatedAt === "string"
      ? payloadRecord.updatedAt
      : new Date().toISOString();

  const columnKeys = Object.keys(columns);

  if (driver.kind === "postgres") {
    const insertColumns = ["id", ...columnKeys, "payload", "updated_at"];
    const values = [
      id,
      ...columnKeys.map((key) => columns[key]),
      serializedPayload,
      updatedAt,
    ];
    const placeholders = insertColumns
      .map((_, index) => `$${index + 1}`)
      .join(", ");
    const updateColumns = [...columnKeys, "payload", "updated_at"]
      .map((column) => `${column} = excluded.${column}`)
      .join(", ");

    await driver.pool.query(
      `
        insert into ${tableName} (${insertColumns.join(", ")})
        values (${placeholders})
        on conflict(id) do update set ${updateColumns}
      `,
      values,
    );
    return;
  }

  const insertColumns = ["id", ...columnKeys, "payload", "updated_at"];
  const placeholders = insertColumns.map(() => "?").join(", ");
  const updateColumns = [...columnKeys, "payload", "updated_at"]
    .map((column) => `${column} = excluded.${column}`)
    .join(", ");

  const statement = driver.db.prepare(`
    insert into ${tableName} (${insertColumns.join(", ")})
    values (${placeholders})
    on conflict(id) do update set ${updateColumns}
  `);

  statement.run(
    id,
    ...columnKeys.map((key) => columns[key]),
    serializedPayload,
    updatedAt,
  );
};

export const loadRecord = async <T>(
  tableName: string,
  whereClause: string,
  values: unknown[],
): Promise<T[]> => {
  const driver = await getDatabaseDriver();

  if (driver.kind === "postgres") {
    const clause = whereClause.replace(/\?/g, (_, index) => `$${index + 1}`);
    const result = await driver.pool.query(
      `select payload from ${tableName} where ${clause} order by updated_at asc`,
      values,
    );
    return result.rows.map(
      (row: Record<string, unknown>) => JSON.parse(String(row.payload)) as T,
    );
  }

  const statement = driver.db.prepare(
    `select payload from ${tableName} where ${whereClause} order by updated_at asc`,
  );

  return statement
    .all(...values)
    .map(
      (row: Record<string, unknown>) => JSON.parse(String(row.payload)) as T,
    );
};

function initializeSqlite(db: DatabaseSync) {
  db.exec(`
    create table if not exists workspace_templates (
      id text primary key,
      slug text not null unique,
      name text not null,
      payload text not null,
      updated_at text not null
    );

    create table if not exists provider_profiles (
      id text primary key,
      workspace_template_id text not null,
      provider_key text not null,
      payload text not null,
      updated_at text not null
    );

    create table if not exists workflow_blueprints (
      id text primary key,
      workspace_template_id text not null,
      name text not null,
      payload text not null,
      updated_at text not null
    );

    create table if not exists project_profiles (
      id text primary key,
      workspace_template_id text not null,
      workflow_blueprint_id text not null,
      name text not null,
      payload text not null,
      updated_at text not null
    );

    create table if not exists generation_sessions (
      id text primary key,
      project_profile_id text not null,
      status text not null,
      channel_target text not null,
      payload text not null,
      updated_at text not null
    );

    create table if not exists provider_jobs (
      id text primary key,
      generation_session_id text not null,
      provider_profile_id text,
      status text not null,
      capability_type text not null,
      model_key text not null,
      payload text not null,
      updated_at text not null
    );

    create table if not exists output_assets (
      id text primary key,
      generation_session_id text not null,
      provider_job_id text,
      asset_type text not null,
      payload text not null,
      updated_at text not null
    );

    create table if not exists auth_sessions (
      id text primary key,
      actor_id text not null,
      role text not null,
      payload text not null,
      updated_at text not null
    );
  `);
}

async function initializePostgres(pool: Pool) {
  await pool.query(`
    create table if not exists workspace_templates (
      id text primary key,
      slug text not null unique,
      name text not null,
      payload jsonb not null,
      updated_at timestamptz not null
    );

    create table if not exists provider_profiles (
      id text primary key,
      workspace_template_id text not null,
      provider_key text not null,
      payload jsonb not null,
      updated_at timestamptz not null
    );

    create table if not exists workflow_blueprints (
      id text primary key,
      workspace_template_id text not null,
      name text not null,
      payload jsonb not null,
      updated_at timestamptz not null
    );

    create table if not exists project_profiles (
      id text primary key,
      workspace_template_id text not null,
      workflow_blueprint_id text not null,
      name text not null,
      payload jsonb not null,
      updated_at timestamptz not null
    );

    create table if not exists generation_sessions (
      id text primary key,
      project_profile_id text not null,
      status text not null,
      channel_target text not null,
      payload jsonb not null,
      updated_at timestamptz not null
    );

    create table if not exists provider_jobs (
      id text primary key,
      generation_session_id text not null,
      provider_profile_id text,
      status text not null,
      capability_type text not null,
      model_key text not null,
      payload jsonb not null,
      updated_at timestamptz not null
    );

    create table if not exists output_assets (
      id text primary key,
      generation_session_id text not null,
      provider_job_id text,
      asset_type text not null,
      payload jsonb not null,
      updated_at timestamptz not null
    );

    create table if not exists auth_sessions (
      id text primary key,
      actor_id text not null,
      role text not null,
      payload jsonb not null,
      updated_at timestamptz not null
    );
  `);
}
