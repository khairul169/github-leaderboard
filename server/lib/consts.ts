//

export const __PROD = import.meta.env.NODE_ENV === "production";
export const __DEV = !__PROD;

export const BULLMQ_CONNECTION = {
  host: import.meta.env.REDIS_HOST || "127.0.0.1",
  port: Number(import.meta.env.REDIS_PORT) || 6379,
};
export const BULLMQ_JOB_NAME = "ghcontribjob";

export const JWT_SECRET = import.meta.env.JWT_SECRET || "secret";
