import db from "@server/db";
import github from "@server/lib/github";
import queue from "@server/lib/queue";
import { repositories } from "@server/models";
import { eq } from "drizzle-orm";

export type FetchRepoDataJobType = {
  id: number;
  uri: string;
};

export const fetchRepoData = async (data: FetchRepoDataJobType) => {
  const details = await github.getRepoDetails(data.uri);

  const [result] = await db
    .update(repositories)
    .set({ languages: details.languages })
    .where(eq(repositories.id, data.id))
    .returning();

  if (!result) {
    throw new Error("Repository not found!");
  }

  await queue.add("calculateUserPoints", { userId: result.userId });
};
