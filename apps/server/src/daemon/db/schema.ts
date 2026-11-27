import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * The persistence baseline the migration starts from.
 * These tables live under the daemon's compiler project (`tsconfig.daemon.json`);
 * the gateway cannot reach them, and `bun run boundary` proves it.
 */

/** A bot's callsign and the JSON description of the head it wears. */
export const bot = sqliteTable('bot', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  callsign: text('callsign').notNull().unique(),
  mascotLook: text('mascot_look', { mode: 'json' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

/** A mission a bot is sent on. `state` is the lifecycle stage the product tracks. */
export const mission = sqliteTable('mission', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  state: text('state').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

/** One run of an agent for a bot. `endedAt` stays null while the session is live. */
export const agentSession = sqliteTable('agent_session', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  botId: integer('bot_id')
    .notNull()
    .references(() => bot.id, { onDelete: 'cascade' }),
  startedAt: integer('started_at', { mode: 'timestamp_ms' }).notNull(),
  endedAt: integer('ended_at', { mode: 'timestamp_ms' }),
});
