import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../models";

const DATABASE_PATH = import.meta.env.DATABASE_PATH;
if (!DATABASE_PATH) {
  throw new Error("DATABASE_PATH is not set");
}

const queryClient = postgres(DATABASE_PATH);
const db = drizzle(queryClient, { schema });

export default db;
