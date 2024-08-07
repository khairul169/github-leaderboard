import { defineConfig } from "drizzle-kit";

const DATABASE_PATH = process.env.DATABASE_PATH || "./data.db";

export default defineConfig({
  schema: "./server/models/index.ts",
  out: "./server/db/migrations",
  dialect: "sqlite",
  dbCredentials: { url: DATABASE_PATH },
  verbose: true,
});
