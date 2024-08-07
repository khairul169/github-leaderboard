import { users } from "../models";
import db from ".";
import logger from "../lib/logger";
import { sql } from "drizzle-orm";
import { faker } from "@faker-js/faker";
import queue from "@server/lib/queue";

const seed = async () => {
  logger.info("🌿 Seeding database...");

  await db.transaction(async (tx) => {
    tx.run(sql`DELETE FROM users`);

    await tx
      .insert(users)
      .values({ username: "khairul169", name: "Khairul Hidayat" });

    await tx.insert(users).values(
      [...Array(50)].map(() => ({
        username: faker.internet.userName(),
        name: faker.person.fullName(),
        location: faker.location.city(),
        followers: faker.number.int({ min: 0, max: 1000 }),
        following: faker.number.int({ min: 0, max: 1000 }),
        points: faker.number.int({ min: 20, max: 3000 }),
        commits: faker.number.int({ min: 20, max: 420 }),
        lineOfCodes: faker.number.int({ min: 1000, max: 300000 }),
      }))
    );
  });

  await queue.add("fetchUserProfile", { userId: 1 });

  logger.info("🌱 Database seeded");

  process.exit();
};

seed();
