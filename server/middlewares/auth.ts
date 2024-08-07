import { JWT_SECRET } from "@server/lib/consts";
import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import * as jwt from "hono/jwt";

type AuthOptions = {
  required: boolean;
};

export const auth =
  (opt?: Partial<AuthOptions>) => async (c: Context, next: Next) => {
    try {
      const token = getCookie(c, "token");
      if (!token) {
        throw new Error("No token found!");
      }

      const jwtData: any = await jwt.verify(token, JWT_SECRET);
      const userId = jwtData.id;

      if (!userId) {
        throw new Error("No user id found!");
      }

      c.set("userId", userId);
    } catch (err) {
      if (opt?.required) {
        throw new HTTPException(401, { message: "Unauthorized!" });
      }
    }

    return next();
  };
