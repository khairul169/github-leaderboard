import { Contributor, Language } from "@server/lib/github";
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { text, sqliteTable, integer, index } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const repositories = sqliteTable(
  "repositories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),

    name: text("name").notNull(),
    uri: text("uri").notNull(),
    language: text("language").notNull(),
    stars: integer("stars").notNull(),
    forks: integer("forks").notNull(),
    lastUpdate: text("last_update").notNull(),
    languages: text("languages", { mode: "json" }).$type<Language[]>(),
    contributors: text("contributors", { mode: "json" }).$type<Contributor[]>(),

    isPending: integer("is_pending", { mode: "boolean" })
      .notNull()
      .default(false),
    isError: integer("is_error", { mode: "boolean" }).notNull().default(false),

    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at")
      .notNull()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    nameIdx: index("repositories_name_idx").on(t.name),
    uriIdx: index("repositories_uri_idx").on(t.uri),
    language: index("repositories_language_idx").on(t.language),
  })
);

export type Repository = InferSelectModel<typeof repositories>;
export type CreateRepository = InferInsertModel<typeof repositories>;
