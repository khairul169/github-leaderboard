import db from "@server/db";
import github from "@server/lib/github";
import queue from "@server/lib/queue";
import { users } from "@server/models";
import { eq } from "drizzle-orm";

export type FetchUserProfileType = {
  userId: number;
};

export const fetchUserProfile = async (data: FetchUserProfileType) => {
  const [user] = await db.select().from(users).where(eq(users.id, data.userId));
  if (!user) {
    throw new Error("User not found!");
  }

  const accessToken = user.accessToken || import.meta.env.GITHUB_DEFAULT_TOKEN;
  const details = await github.getUser(user.username, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  await db
    .update(users)
    .set({
      name: details.name,
      avatar: details.avatar,
      followers: details.followers,
      following: details.following,
      location: details.location,
      achievements: details.achievements || user.achievements,
    })
    .where(eq(users.id, user.id));

  await queue.add(
    "calculateUserPoints",
    { userId: user.id },
    { jobId: `calculateUserPoints:${user.id}` }
  );
};
