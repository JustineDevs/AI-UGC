import { withPostgresPool, isPostgresTestEnabled } from "../helpers/postgres-test-helpers";
import { loadRecord, upsertRecord } from "../../src/infrastructure/database/database";

const describePostgres = isPostgresTestEnabled() ? describe : describe.skip;

describePostgres("postgres repository contract", () => {
  it("persists and loads workspace records against a Postgres URL", async () => {
    await withPostgresPool(async (pool) => {
      await pool.query(`
        create table if not exists workspace_templates (
          id text primary key,
          slug text not null unique,
          name text not null,
          payload jsonb not null,
          updated_at timestamptz not null
        )
      `);
    });

    const payload = {
      id: "ws-postgres",
      name: "Postgres Workspace",
      slug: "postgres-workspace",
      enabledNichePackKeys: ["ecommerce-product-ads"],
      updatedAt: new Date().toISOString(),
    };

    await upsertRecord("workspace_templates", payload.id, payload, {
      slug: payload.slug,
      name: payload.name,
    });

    const rows = await loadRecord<typeof payload>(
      "workspace_templates",
      "id = ?",
      [payload.id],
    );

    expect(rows[0]?.slug).toBe("postgres-workspace");
  });
});
