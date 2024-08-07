import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "../models";

const DATABASE_PATH = import.meta.env.DATABASE_PATH || "./data.db";

const sqlite = new Database(DATABASE_PATH);
const db = drizzle(sqlite, { schema });

export default db;
