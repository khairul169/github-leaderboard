import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  varchar,
  serial,
  pgTable,
  integer,
  index,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { repositories } from "./repositories";

export const repoLanguages = pgTable(
  "repository_languages",
  {
    id: serial("id").primaryKey(),
    repoId: integer("repo_id")
      .notNull()
      .references(() => repositories.id),

    name: varchar("name").notNull(),
    percentage: doublePrecision("percentage").notNull(),
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
