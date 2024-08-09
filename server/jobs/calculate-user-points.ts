import db from "@server/db";
import { repositories, users } from "@server/models";
import { eq } from "drizzle-orm";

type CalculateUserPointsType = {
  userId: number;
};

const weights = {
  followers: 20,
  following: 10,
  achievements: 100,
  repositories: 1,
  contributorsAmount: 25,
  stars: 10,
  forks: 10,
  languagesKnown: 50,
  commits: 1,
  lineOfCodes: 0.01,
};

export const calculateUserPoints = async (data: CalculateUserPointsType) => {
  const [user] = await db.select().from(users).where(eq(users.id, data.userId));
  if (!user) {
    throw new Error("User not found!");
  }

  let points = 0;
  let totalCommits = 0;
  let totalLineOfCodes = 0;

  // User statistics
  points += user.followers * weights.followers;
  points += user.following * weights.following;
  points += user.achievements
    ? user.achievements?.length * weights.achievements
    : 0;

  // User repositories
  const repos = await db.query.repositories.findMany({
    where: eq(repositories.userId, user.id),
    with: { languages: true },
  });
  points += repos.length * weights.repositories;

  // Languages known
  const languages = new Set(
    repos.flatMap((i) => i.languages?.map((j) => j.name))
  );
  points += languages.size * weights.languagesKnown;

  // Activities
  repos.forEach((repo) => {
    const contributors = repo.contributors?.filter(
      (i) => i.author?.login !== user.username
    );
    points += contributors
      ? contributors.length * weights.contributorsAmount
      : 0;

    points += repo.stars * weights.stars;
    points += repo.forks * weights.forks;

    const contrib = repo.contributors?.find(
      (i) => i.author?.login === user.username
    );
    const commits = contrib?.commits || 0;
    const lineOfCodes = contrib?.additions || 0;

    points += commits * weights.commits;
    points += lineOfCodes * weights.lineOfCodes;
    totalCommits += commits;
    totalLineOfCodes += lineOfCodes;
  });

  await db
    .update(users)
    .set({
      points: Math.round(points),
      commits: totalCommits,
      lineOfCodes: totalLineOfCodes,
    })
    .where(eq(users.id, user.id));
};
