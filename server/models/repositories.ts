import { Contributor } from "@server/lib/github";
import {
  InferInsertModel,
  InferSelectModel,
  relations,
  sql,
} from "drizzle-orm";
import {
  varchar,
  pgTable,
  integer,
  index,
  serial,
  jsonb,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { repoLanguages } from "./repo-languages";

export const repositories = pgTable(
  "repositories",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),

    name: varchar("name").notNull(),
    uri: varchar("uri").notNull(),
    language: varchar("language").notNull(),
    stars: integer("stars").notNull(),
    forks: integer("forks").notNull(),
    lastUpdate: varchar("last_update").notNull(),
    contributors: jsonb("contributors").$type<Contributor[]>(),

    isPending: boolean("is_pending").notNull().default(false),
    isError: boolean("is_error").notNull().default(false),

    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    nameIdx: index("repositories_name_idx").on(t.name),
    uriIdx: index("repositories_uri_idx").on(t.uri),
    language: index("repositories_language_idx").on(t.language),
  })
);

export const repositoriesRelations = relations(repositories, ({ many }) => ({
  languages: many(repoLanguages),
}));

export type Repository = InferSelectModel<typeof repositories>;
export type CreateRepository = InferInsertModel<typeof repositories>;
