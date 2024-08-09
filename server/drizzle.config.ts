import { defineConfig } from "drizzle-kit";

const DATABASE_PATH = process.env.DATABASE_PATH;
if (!DATABASE_PATH) {
  throw new Error("DATABASE_PATH is not set");
}

export default defineConfig({
  schema: "./server/models/index.ts",
  out: "./server/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: DATABASE_PATH },
  verbose: true,
});
