import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const migrationPath = resolve(
  process.cwd(),
  'apps/api/migrations/001_initial_platform.sql',
);

const sql = readFileSync(migrationPath, 'utf8');

console.log('AI-UGC migration scaffold ready.');
console.log(`Loaded migration: ${migrationPath}`);
console.log(`SQL bytes: ${sql.length}`);
