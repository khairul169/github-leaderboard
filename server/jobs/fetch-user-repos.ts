import db from "@server/db";
import github from "@server/lib/github";
import queue from "@server/lib/queue";
import { repositories, users } from "@server/models";
import { and, eq } from "drizzle-orm";
import { FetchRepoDataJobType } from "./fetch-repo-data";

export type FetchUserRepos = {
  userId: number;
};

export const fetchUserRepos = async (data: FetchUserRepos) => {
  const [user] = await db.select().from(users).where(eq(users.id, data.userId));
  if (!user) {
    throw new Error("User not found!");
  }

  const res = await github.getRepositories(user.username, {
    sort: "stargazers",
    fetchAll: true,
  });

  const jobList = [] as FetchRepoDataJobType[];

  await db.transaction(async (tx) => {
    for (const repo of res.repositories) {
      const data = {
        ...repo,
        userId: user.id,
        lastUpdate: repo.lastUpdate.toISOString(),
        isPending: true,
      };

      const [existing] = await tx
        .select({ id: repositories.id })
        .from(repositories)
        .where(
          and(
            eq(repositories.userId, data.userId),
            eq(repositories.name, data.name)
          )
        );

      if (existing) {
        await tx
          .update(repositories)
          .set(data)
          .where(eq(repositories.id, existing.id));
        jobList.push({ id: existing.id, uri: data.uri });
      } else {
        const [result] = await tx.insert(repositories).values(data).returning();
        jobList.push({ id: result.id, uri: data.uri });
      }
    }
  });

  // Queue fetch repo details
  queue.addBulk(jobList.map((data) => ({ name: "fetchRepoData", data })));
  queue.addBulk(
    jobList.map((data) => ({
      name: "fetchRepoContributors",
      data,
      opts: {
        attempts: 10,
        backoff: { type: "exponential", delay: 10000 },
        jobId: `contributors:${data.uri}`,
      },
    }))
  );
};
