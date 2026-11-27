import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { migrate } from 'drizzle-orm/bun-sqlite/migrator';

import { openDatabase, type RobotYardDatabase } from './client.ts';

/** `apps/server/drizzle`, where drizzle-kit writes the forward migrations. */
export const MIGRATIONS_FOLDER = join(import.meta.dir, '../../../drizzle');

/** The database file `db:migrate` creates, under the gitignored `.data/` at the repo root. */
export const DEFAULT_DATABASE_FILE = join(import.meta.dir, '../../../../../.data/robotyard.db');

/** Apply every pending forward migration and return the client that owns the file. */
export function migrateDatabase(databaseFile: string = DEFAULT_DATABASE_FILE): RobotYardDatabase {
  mkdirSync(dirname(databaseFile), { recursive: true });

  const db = openDatabase(databaseFile);
  migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });

  return db;
}

if (import.meta.main) {
  const databaseFile = process.env.DATABASE_FILE ?? DEFAULT_DATABASE_FILE;
  migrateDatabase(databaseFile);
  console.log(`migrated ${databaseFile}`);
}
