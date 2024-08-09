import db from "@server/db";
import github from "@server/lib/github";
import queue from "@server/lib/queue";
import { repositories } from "@server/models";
import { repoLanguages } from "@server/models/repo-languages";
import { and, eq, notInArray } from "drizzle-orm";

export type FetchRepoDataJobType = {
  id: number;
  uri: string;
};

export const fetchRepoData = async (data: FetchRepoDataJobType) => {
  const [repository] = await db
    .select()
    .from(repositories)
    .where(eq(repositories.id, data.id));

  if (!repository) {
    throw new Error("Repository not found!");
  }

  const details = await github.getRepoDetails(data.uri);
  const { languages } = details;

  await db.transaction(async (tx) => {
    // Remove languages that don't exist anymore
    const purgeLangFilter = and(
      eq(repoLanguages.repoId, repository.id),
      notInArray(
        repoLanguages.name,
        languages.map((i) => i.lang)
      )
    );
    await tx.delete(repoLanguages).where(purgeLangFilter);

    // Add or update languages
    for (const lang of languages) {
      const [existing] = await tx
        .select({ id: repoLanguages.id })
        .from(repoLanguages)
        .where(
          and(
            eq(repoLanguages.repoId, repository.id),
            eq(repoLanguages.name, lang.lang)
          )
        );

      if (existing) {
        await tx
          .update(repoLanguages)
          .set({ percentage: lang.amount })
          .where(eq(repoLanguages.id, existing.id));
      } else {
        await tx.insert(repoLanguages).values({
          repoId: repository.id,
          name: lang.lang,
          percentage: lang.amount,
        });
      }
    }
  });

  await queue.add("calculateUserPoints", { userId: repository.userId });
};
