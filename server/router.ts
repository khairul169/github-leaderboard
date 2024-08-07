import { Hono } from "hono";
import { auth } from "./routes/auth";
import { leaderboard } from "./routes/leaderboard";

const router = new Hono()
  .route("/auth", auth)
  .route("/leaderboard", leaderboard);

export type AppType = typeof router;

declare module "hono" {
  interface ContextVariableMap {
    userId?: number;
  }
}

export default router;
