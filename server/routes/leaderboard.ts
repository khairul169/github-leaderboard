import db from "@server/db";
import { repositories, users } from "@server/models";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export const leaderboard = new Hono()

  /**
   * Get users leaderboard
   */
  .get("/", async (c) => {
    const rows = await db
      .select()
      .from(users)
      .orderBy(desc(users.points))
      .limit(100);
    const result = rows.map((data, idx) => ({ ...data, rank: idx + 1 }));

    return c.json(result);
  })

  /**
   * Get specific user data
   */
  .get("/:username", async (c) => {
    const { username } = c.req.param();

    const rankSubquery = db
      .select({
        userId: users.id,
        value: sql`rank() over (order by points desc)`.as("rank"),
      })
      .from(users)
      .orderBy(desc(users.points))
      .as("rank");

    const [user] = await db
      .select({
        ...getTableColumns(users),
        accessToken: sql`null`,
        rank: rankSubquery.value,
      })
      .from(users)
      .leftJoin(rankSubquery, eq(users.id, rankSubquery.userId))
      .where(eq(users.username, username));

    if (!user) {
      throw new HTTPException(404, { message: "User not found!" });
    }

    const repos = await db
      .select()
      .from(repositories)
      .where(eq(repositories.userId, user.id))
      .orderBy(desc(repositories.stars), desc(repositories.forks));

    const languageMap: Record<string, number> = {};
    repos
      .flatMap((i) => i.languages || [])
      .forEach((i) => {
        if (!languageMap[i.lang]) languageMap[i.lang] = 0;
        languageMap[i.lang] += i.amount;
      });

    const totalLangWeight = Object.values(languageMap).reduce(
      (a, b) => a + b,
      0
    );
    let languages = [] as { name: string; percent: number }[];
    for (const [lang, amount] of Object.entries(languageMap)) {
      languages.push({
        name: lang,
        percent: (amount / totalLangWeight) * 100,
      });
    }
    languages = languages.sort((a, b) => b.percent - a.percent);

    return c.json({ user, repositories: repos, languages });
  });
