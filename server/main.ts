import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
import router from "./router";
import logger from "./lib/logger";
import { __DEV, __PROD } from "./lib/consts";

const HOST = import.meta.env.HOST || "127.0.0.1";
const PORT = Number(import.meta.env.PORT) || 5589;

const app = new Hono();

app.onError((err, c) => {
  logger.error(err);
  return c.text(err.message, 500);
});

// Allow all origin on development
if (__DEV) {
  app.use(cors({ origin: "*" }));
}

// Health check
app.get("/health", (c) => c.text("OK"));

// Serve prod client app
if (__PROD) {
  app.use("*", serveStatic({ root: "./dist/client" }));
}

// API router
app.route("/api", router);

Bun.serve({
  fetch: app.fetch,
  hostname: HOST,
  port: PORT,
});

logger.info(`Server started at http://${HOST}:${PORT}`);
