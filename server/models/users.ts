import { Achievement } from "@server/lib/github";
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  location: text("location"),
  followers: integer("followers").notNull().default(0),
  following: integer("following").notNull().default(0),
  achievements: text("achievements", { mode: "json" })
    .$type<Achievement[]>()
    .default([]),
  points: integer("points").notNull().default(0),
  commits: integer("commits").notNull().default(0),
  lineOfCodes: integer("line_of_codes").notNull().default(0),
  githubId: integer("github_id").unique(),
  accessToken: text("access_token"),

  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export type User = InferSelectModel<typeof users>;
export type CreateUser = InferInsertModel<typeof users>;
