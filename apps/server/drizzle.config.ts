import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/daemon/db/schema.ts',
  out: './drizzle',
});
