import { Pool } from "pg";

export const getPostgresTestUrl = (): string | null =>
  process.env.AI_UGC_TEST_DATABASE_URL || process.env.DATABASE_URL || null;

export const isPostgresTestEnabled = (): boolean => {
  const url = getPostgresTestUrl();
  return Boolean(
    url &&
      (url.startsWith("postgres://") || url.startsWith("postgresql://")),
  );
};

export const withPostgresPool = async <T>(
  fn: (pool: Pool) => Promise<T>,
): Promise<T | null> => {
  const connectionString = getPostgresTestUrl();
  if (!connectionString || !isPostgresTestEnabled()) {
    return null;
  }

  const pool = new Pool({ connectionString });
  try {
    return await fn(pool);
  } finally {
    await pool.end();
  }
};
