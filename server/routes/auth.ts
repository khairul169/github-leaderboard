import db from "@server/db";
import { JWT_SECRET } from "@server/lib/consts";
import github from "@server/lib/github";
import queue from "@server/lib/queue";
import { repositories, users } from "@server/models";
import { CreateUser } from "@server/models/users";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import * as jwt from "hono/jwt";
import { auth as authMiddleware } from "../middlewares/auth";

const { GITHUB_CLIENT_ID, GITHUB_SECRET_KEY } = import.meta.env;

export const auth = new Hono()

  /**
   * Redirect to github oauth
   */
  .get("/login", (c) => {
    return c.redirect(
      "https://github.com/login/oauth/authorize?client_id=" + GITHUB_CLIENT_ID
    );
  })

  /**
   * Auth callback
   */
  .get("/callback", async (c) => {
    const code = c.req.query("code");
    const result = await github.fetch("login/oauth/access_token", {
      params: {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_SECRET_KEY,
        code,
      },
      headers: {
        accept: "application/json",
      },
    });

    const accessToken = result.access_token;
    const ghUser = await github.fetch("user", {
      ghApi: true,
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + accessToken,
      },
    });

    const userData: CreateUser = {
      username: ghUser.login,
      name: ghUser.name,
      avatar: ghUser.avatar_url,
      location: ghUser.location,
      accessToken,
      githubId: ghUser.id,
      followers: ghUser.followers,
      following: ghUser.following,
    };

    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.username,
        set: userData,
      })
      .returning();

    if (!user) {
      throw new Error("Auth user failed!");
    }

    // Fetch latest user profile
    await queue.add("fetchUserProfile", { userId: user.id });

    // Fetch user repositories
    const [hasRepo] = await db
      .select({ id: repositories.id })
      .from(repositories)
      .where(eq(repositories.userId, user.id))
      .limit(1);

    if (!hasRepo) {
      await queue.add("fetchUserRepos", { userId: user.id });
    }

    const authToken = await jwt.sign({ id: user.id }, JWT_SECRET);
    setCookie(c, "token", authToken, { httpOnly: true });

    return c.redirect("/");
  })

  /**
   * Get authenticated user
   */
  .get("/user", authMiddleware(), async (c) => {
    const userId = c.get("userId");
    if (!userId) {
      return c.json(null);
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    return c.json(user ? { ...user, accessToken: undefined } : null);
  })

  /**
   * Logout
   */
  .get("/logout", authMiddleware({ required: true }), async (c) => {
    setCookie(c, "token", "", { httpOnly: true });
    return c.redirect("/");
  });
