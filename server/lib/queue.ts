import { Queue } from "bullmq";
import { BULLMQ_CONNECTION, BULLMQ_JOB_NAME } from "./consts";
import logger from "./logger";
import type { JobNames } from "@server/jobs";

const queue = new Queue<any, any, JobNames>(BULLMQ_JOB_NAME, {
  connection: BULLMQ_CONNECTION,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
  },
});

queue.on("error", logger.error);

export default queue;
