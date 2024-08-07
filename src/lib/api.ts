import type { AppType } from "@server/router";
import { hc } from "hono/client";

export const API_BASEURL = "/api";

const api = hc<AppType>(API_BASEURL);

export default api;
