import {
  GetLeaderboardRes,
  LeaderboardRepository,
} from "@server/repository/leaderboard";
import { Hono } from "hono";

export const leaderboard = new Hono()

  /**
   * Get users leaderboard
   */
  .get("/", async (c) => {
    const query = c.req.query();
    const repo = new LeaderboardRepository();

    let result: GetLeaderboardRes;

    switch (query.type) {
      case "lang":
        result = await repo.getTopLanguages();
        break;
      case "lang-users":
        result = await repo.getTopUsersByLang(query.lang);
        break;
      case "user":
      case "":
        result = await repo.getTopUsers();
        break;
      default:
        throw new Error("Invalid query type");
    }

    return c.json(result);
  })

  /**
   * Get specific user data
   */
  .get("/:username", async (c) => {
    const { username } = c.req.param();
    const repo = new LeaderboardRepository();
    const result = await repo.getUserRank(username);

    return c.json(result);
  });
