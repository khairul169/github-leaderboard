import db from "./db";
import queue from "./lib/queue";
import { users } from "./models";

const main = async () => {
  const username = process.argv[2];
  if (!username) {
    throw new Error("Missing username");
  }

  const [user] = await db
    .insert(users)
    .values({ username, name: username })
    .onConflictDoUpdate({
      target: users.username,
      set: { username },
    })
    .returning();

  await queue.add(
    "fetchUserProfile",
    { userId: user.id },
    { jobId: `fetchUserProfile:${user.id}` }
  );
  await queue.add(
    "fetchUserRepos",
    { userId: user.id },
    { jobId: `fetchUserRepos:${user.id}` }
  );

  process.exit();
};

main();
