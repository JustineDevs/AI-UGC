import { mkdirSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

type SqliteAppliedMigrationRow = {
  filename: string;
};

type PostgresMigrationRow = {
  filename: string;
};

type PostgresPool = {
  query<T = unknown>(sql: string, values?: unknown[]): Promise<{ rows: T[] }>;
  end(): Promise<void>;
};

type SqliteDatabase = {
  exec(sql: string): void;
  prepare(sql: string): {
    all(): SqliteAppliedMigrationRow[];
    run(...values: unknown[]): void;
  };
};

const repoRoot = resolve(process.cwd(), "../..");
const migrationsDir = resolve(repoRoot, "apps/api/migrations");
const databaseUrl =
  process.env.DATABASE_URL || "file:./.data/ai-ugc.sqlite";

const migrationFiles = readdirSync(migrationsDir)
  .filter((filename) => filename.endsWith(".sql"))
  .sort();

async function main() {
  if (migrationFiles.length === 0) {
    console.log(`No migration files found in ${migrationsDir}`);
    return;
  }

  if (
    databaseUrl.startsWith("postgres://") ||
    databaseUrl.startsWith("postgresql://")
  ) {
    await runPostgresMigrations();
    return;
  }

  await runSqliteMigrations();
}

async function runPostgresMigrations() {
  const pgSpecifier = "pg";
  const { Pool } = (await import(pgSpecifier)) as {
    Pool: new (options: { connectionString: string }) => PostgresPool;
  };
  const pool = new Pool({ connectionString: databaseUrl });

  try {
    await pool.query(`
      create table if not exists schema_migrations (
        filename text primary key,
        applied_at timestamptz not null default now()
      )
    `);

    const appliedRows = await pool.query<PostgresMigrationRow>(
      "select filename from schema_migrations",
    );
    const applied = new Set(
      appliedRows.rows.map((row: PostgresMigrationRow) => row.filename),
    );

    for (const filename of migrationFiles) {
      if (applied.has(filename)) {
        console.log(`Skipping already-applied migration: ${filename}`);
        continue;
      }

      const sql = readMigration(filename);
      console.log(`Applying migration: ${filename}`);
      await pool.query("begin");
      try {
        await pool.query(sql);
        await pool.query(
          "insert into schema_migrations (filename) values ($1)",
          [filename],
        );
        await pool.query("commit");
      } catch (error) {
        await pool.query("rollback");
        throw error;
      }
    }
  } finally {
    await pool.end();
  }
}

async function runSqliteMigrations() {
  const sqlitePath = databaseUrl.startsWith("file:")
    ? resolve(repoRoot, databaseUrl.replace(/^file:/, ""))
    : resolve(repoRoot, ".data/ai-ugc.sqlite");

  mkdirSync(dirname(sqlitePath), { recursive: true });
  const sqliteSpecifier = "node:sqlite";
  const { DatabaseSync } = (await import(sqliteSpecifier)) as {
    DatabaseSync: new (path: string) => SqliteDatabase;
  };
  const db = new DatabaseSync(sqlitePath);
  db.exec(`
    create table if not exists schema_migrations (
      filename text primary key,
      applied_at text not null default current_timestamp
    );
  `);

  const applied = new Set(
    (
      db.prepare("select filename from schema_migrations").all() as
        | SqliteAppliedMigrationRow[]
        | []
    ).map((row) => row.filename),
  );

  for (const filename of migrationFiles) {
    if (applied.has(filename)) {
      console.log(`Skipping already-applied migration: ${filename}`);
      continue;
    }

    const sql = normalizeSqliteMigration(readMigration(filename));
    console.log(`Applying migration: ${filename}`);
    db.exec("begin");
    try {
      db.exec(sql);
      db.prepare(
        "insert into schema_migrations (filename) values (?)",
      ).run(filename);
      applied.add(filename);
      db.exec("commit");
    } catch (error) {
      db.exec("rollback");
      throw error;
    }
  }
}

function readMigration(filename: string): string {
  return readFileSync(resolve(migrationsDir, filename), "utf8");
}

function normalizeSqliteMigration(sql: string): string {
  return sql
    .replace(/::jsonb/g, "")
    .replace(/\buuid\b/g, "text")
    .replace(/\bjsonb\b/g, "text")
    .replace(/\btimestamptz\b/g, "text")
    .replace(/default now\(\)/g, "default current_timestamp");
}

void main()
  .then(() => {
    console.log("Database migrations complete.");
  })
  .catch((error: unknown) => {
    console.error("Database migration failed.");
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    process.exitCode = 1;
  });
