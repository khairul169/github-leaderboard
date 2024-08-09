import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
import router from "./router";
import logger from "./lib/logger";
import { logger as httpLogger } from "hono/logger";
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
} else {
  app.use(httpLogger());
}

// Health check
app.get("/health", (c) => c.text("OK"));

// API router
app.route("/api", router);

// Serve prod client app
if (__PROD) {
  const CLIENT_DIST_DIR = "./dist";
  app.use(serveStatic({ root: CLIENT_DIST_DIR }));
  app.get("*", async (c) => {
    const index = Bun.file(CLIENT_DIST_DIR + "/index.html");
    const content = await index.text();
    return c.html(content);
  });
}

Bun.serve({
  fetch: app.fetch,
  hostname: HOST,
  port: PORT,
});

logger.info(`Server started at http://${HOST}:${PORT}`);
