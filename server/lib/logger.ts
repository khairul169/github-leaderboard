import pino from "pino";
import { __DEV } from "./consts";

const logger = pino(
  __DEV
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      }
    : {}
);

export default logger;
