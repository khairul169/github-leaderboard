import db from "@server/db";
import github from "@server/lib/github";
import queue from "@server/lib/queue";
import { repositories, users } from "@server/models";
import { eq } from "drizzle-orm";

export type FetchRepoContributorsType = {
  id: number;
  uri: string;
};

export const fetchRepoContributors = async (
  data: FetchRepoContributorsType
) => {
  const [repo] = await db
    .select({ id: repositories.id, userAccessToken: users.accessToken })
    .from(repositories)
    .innerJoin(users, eq(users.id, repositories.userId))
    .where(eq(repositories.id, data.id));

  if (!repo) {
    throw new Error("Repository not found!");
  }

  if (!repo.userAccessToken) {
    throw new Error("User access token not found!");
  }

  const contributors = await github.getRepoContributors(data.uri, {
    headers: {
      Authorization: `Bearer ${repo.userAccessToken}`,
    },
  });

  const [result] = await db
    .update(repositories)
    .set({ contributors, isPending: false, isError: false })
    .where(eq(repositories.id, data.id))
    .returning();

  if (!result) {
    throw new Error("Cannot update repository!");
  }

  await queue.add("calculateUserPoints", { userId: result.userId });
};

export const onFetchRepoContribFailed = async (
  data: FetchRepoContributorsType
) => {
  await db
    .update(repositories)
    .set({ isPending: false, isError: true })
    .where(eq(repositories.id, data.id));
};
