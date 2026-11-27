import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { migrateDatabase } from './migrate.ts';

const temporaryDirectories: string[] = [];

function temporaryDatabaseFile(): string {
  const directory = mkdtempSync(join(tmpdir(), 'robotyard-db-'));
  temporaryDirectories.push(directory);

  return join(directory, 'robotyard.db');
}

type ColumnInfo = { name: string; type: string; notnull: number; pk: number };

function columnsOf(databaseFile: string, table: string): ColumnInfo[] {
  const db = migrateDatabase(databaseFile);

  return db.$client.query(`PRAGMA table_info(${table})`).all() as ColumnInfo[];
}

function tableNames(databaseFile: string): string[] {
  const db = migrateDatabase(databaseFile);
  const rows = db.$client
    .query(
      "select name from sqlite_master where type = 'table' and name not like 'sqlite_%' and name <> '__drizzle_migrations' order by name",
    )
    .all() as { name: string }[];

  return rows.map((row) => row.name);
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('the forward migration', () => {
  it('creates the three tables the product needs in a temporary database', () => {
    expect(tableNames(temporaryDatabaseFile())).toEqual(['agent_session', 'bot', 'mission']);
  });

  it('gives bot its callsign, its JSON mascot look and its creation time', () => {
    const columns = columnsOf(temporaryDatabaseFile(), 'bot');

    expect(columns.map((column) => column.name)).toEqual([
      'id',
      'callsign',
      'mascot_look',
      'created_at',
    ]);
    expect(columns.find((column) => column.name === 'callsign')).toMatchObject({
      notnull: 1,
    });
    expect(columns.find((column) => column.name === 'callsign')?.type.toLowerCase()).toBe('text');
    expect(columns.find((column) => column.name === 'mascot_look')).toMatchObject({
      notnull: 1,
    });
    expect(columns.find((column) => column.name === 'mascot_look')?.type.toLowerCase()).toBe('text');
    expect(columns.find((column) => column.name === 'created_at')).toMatchObject({
      notnull: 1,
    });
    expect(columns.find((column) => column.name === 'created_at')?.type.toLowerCase()).toBe(
      'integer',
    );
  });

  it('keeps callsigns unique', () => {
    const db = migrateDatabase(temporaryDatabaseFile());
    const index = db.$client
      .query("select name from sqlite_master where type = 'index' and name = 'bot_callsign_unique'")
      .get();

    expect(index).toMatchObject({ name: 'bot_callsign_unique' });
  });

  it('gives mission its title, state and creation time', () => {
    const columns = columnsOf(temporaryDatabaseFile(), 'mission');

    expect(columns.map((column) => column.name)).toEqual(['id', 'title', 'state', 'created_at']);
  });

  it('ties an agent session to a bot and leaves its end open', () => {
    const columns = columnsOf(temporaryDatabaseFile(), 'agent_session');
    const db = migrateDatabase(temporaryDatabaseFile());
    const foreignKeys = db.$client.query('PRAGMA foreign_key_list(agent_session)').all() as {
      table: string;
      from: string;
      to: string;
    }[];

    expect(columns.map((column) => column.name)).toEqual([
      'id',
      'bot_id',
      'started_at',
      'ended_at',
    ]);
    expect(columns.find((column) => column.name === 'ended_at')?.notnull).toBe(0);
    expect(foreignKeys).toMatchObject([{ table: 'bot', from: 'bot_id', to: 'id' }]);
  });

  it('applies cleanly a second time on the same database', () => {
    const databaseFile = temporaryDatabaseFile();

    migrateDatabase(databaseFile);

    expect(() => migrateDatabase(databaseFile)).not.toThrow();
    expect(tableNames(databaseFile)).toEqual(['agent_session', 'bot', 'mission']);
  });
});
