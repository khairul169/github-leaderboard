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
  const details = await github.getUser(user.username);

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

  await queue.add("calculateUserPoints", { userId: user.id });
};
