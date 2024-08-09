import db from "@server/db";
import { getLanguageLogo } from "@server/lib/utils";
import { repoLanguages, repositories, users } from "@server/models";
import { count, desc, eq, getTableColumns, inArray, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export type GetLeaderboardRes = {
  columns: { title: string; selector: string; hideOnSmall?: boolean }[];
  rows: {
    id?: string | null;
    rank: number;
    name: string;
    sub: string;
    image?: string | null;
  }[];
};

export class LeaderboardRepository {
  async getTopUsers() {
    const data = await db
      .select()
      .from(users)
      .orderBy(desc(users.points))
      .limit(100);

    const columns = [
      {
        title: "Nama",
        selector: "name",
      },
      {
        title: "Points",
        selector: "sub",
      },
    ];

    const rows = data.map((data, idx) => ({
      id: data.username,
      rank: idx + 1,
      name: data.name,
      sub: `${data.points} pts`,
      image: data.avatar,
    }));

    return { columns, rows } satisfies GetLeaderboardRes;
  }

  async getTopLanguages() {
    const data = await db
      .select({
        language: repoLanguages.name,
        count: count(),
        total: sql<number>`sum(${repoLanguages.percentage})`.as("total"),
        avg: sql<number>`avg(${repoLanguages.percentage})`.as("avg"),
        coverage: sql<number>`count(*) * avg(${repoLanguages.percentage})`.as(
          "coverage"
        ),
      })
      .from(repositories)
      .innerJoin(repoLanguages, eq(repoLanguages.repoId, repositories.id))
      .groupBy(repoLanguages.name)
      .orderBy(desc(sql`count(*) * avg(${repoLanguages.percentage})`));

    const columns = [
      {
        title: "Bahasa",
        selector: "name",
      },
      {
        title: "Total Repo",
        selector: "repo",
      },
      {
        title: "Rerata",
        selector: "avg",
        hideOnSmall: true,
      },
      {
        title: "Cakupan",
        selector: "sub",
      },
      // {
      //   title: "Total Persentase",
      //   selector: "total",
      // },
    ];

    const rows = data
      .filter((i) => !!i.language)
      .map((data, idx) => ({
        rank: idx + 1,
        name: data.language,
        sub: data.coverage.toFixed(0),
        image: getLanguageLogo(data.language),
        repo: `${data.count} repo`,
        total: data.total,
        avg: data.avg.toFixed(1),
      }));

    return { columns, rows } satisfies GetLeaderboardRes;
  }

  async getTopUsersByLang(lang: string) {
    const languages = lang.toLowerCase().split(",");

    const data = await db
      .select({
        id: users.username,
        name: users.name,
        avatar: users.avatar,
        count: count(),
        points: users.points,
      })
      .from(repositories)
      .innerJoin(users, eq(users.id, repositories.userId))
      .innerJoin(repoLanguages, eq(repoLanguages.repoId, repositories.id))
      .where(inArray(sql`lower(${repoLanguages.name})`, languages))
      .groupBy(users.id)
      .orderBy(desc(count()));

    const columns = [
      {
        title: "Nama",
        selector: "name",
      },
      {
        title: "Total Repo",
        selector: "sub",
      },
    ];

    const rows = data.map((data, idx) => ({
      id: data.id,
      rank: idx + 1,
      name: data.name,
      sub: `${data.count} repo`,
      image: data.avatar,
    }));

    return { columns, rows } satisfies GetLeaderboardRes;
  }

  async getUserRank(username: string) {
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

    const repos = await db.query.repositories.findMany({
      where: eq(repositories.userId, user.id),
      orderBy: [desc(repositories.stars), desc(repositories.forks)],
      with: { languages: true },
    });

    const languageMap: Record<string, number> = {};
    repos
      .flatMap((i) => i.languages || [])
      .forEach((i) => {
        if (!languageMap[i.name]) languageMap[i.name] = 0;
        languageMap[i.name] += i.percentage;
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

    return { user, repositories: repos, languages };
  }
}
