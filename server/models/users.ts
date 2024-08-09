import { Achievement } from "@server/lib/github";
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import {
  varchar,
  pgTable,
  serial,
  integer,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username").notNull().unique(),
  name: varchar("name").notNull(),
  avatar: varchar("avatar"),
  location: varchar("location"),
  followers: integer("followers").notNull().default(0),
  following: integer("following").notNull().default(0),
  achievements: jsonb("achievements").$type<Achievement[]>().default([]),
  points: integer("points").notNull().default(0),
  commits: integer("commits").notNull().default(0),
  lineOfCodes: integer("line_of_codes").notNull().default(0),
  githubId: integer("github_id").unique(),
  accessToken: varchar("access_token"),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type User = InferSelectModel<typeof users>;
export type CreateUser = InferInsertModel<typeof users>;
