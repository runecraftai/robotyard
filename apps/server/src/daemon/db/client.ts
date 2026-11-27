import { Database } from 'bun:sqlite';

import { drizzle } from 'drizzle-orm/bun-sqlite';

import * as schema from './schema.ts';

/** Open the SQLite file the daemon owns and hand back the Drizzle client. */
export function openDatabase(filename: string) {
  const sqlite = new Database(filename, { create: true });
  sqlite.exec('PRAGMA foreign_keys = ON');

  return drizzle(sqlite, { schema });
}

export type RobotYardDatabase = ReturnType<typeof openDatabase>;
