import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  text,
  sqliteTable,
  integer,
  index,
  real,
} from "drizzle-orm/sqlite-core";
import { repositories } from "./repositories";

export const repoLanguages = sqliteTable(
  "repository_languages",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    repoId: integer("repo_id")
      .notNull()
      .references(() => repositories.id),

    name: text("name").notNull(),
    percentage: real("percentage").notNull(),
  },
  (t) => ({
    nameIdx: index("repository_languages_name_idx").on(t.name),
  })
);

export const repoLanguagesRelations = relations(repoLanguages, ({ one }) => ({
  repository: one(repositories, {
    fields: [repoLanguages.repoId],
    references: [repositories.id],
  }),
}));

export type RepositoryLanguage = InferSelectModel<typeof repoLanguages>;
export type CreateRepositoryLanguage = InferInsertModel<typeof repoLanguages>;
