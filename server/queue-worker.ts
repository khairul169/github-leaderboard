import { Job, Worker } from "bullmq";
import { BULLMQ_CONNECTION, BULLMQ_JOB_NAME } from "./lib/consts";
import logger from "./lib/logger";
import { jobs } from "./jobs";
import { onFetchRepoContribFailed } from "./jobs/fetch-repo-contributors";

const handler = async (job: Job) => {
  const jobFn = (jobs as any)[job.name];

  if (jobFn) {
    return jobFn(job.data);
  }

  return false;
};

const onJobRetriesExhausted = async (job: Job) => {
  if (job.name === "fetchRepoContributors") {
    await onFetchRepoContribFailed(job.data);
  }
};

const worker = new Worker(BULLMQ_JOB_NAME, handler, {
  connection: BULLMQ_CONNECTION,
  concurrency: Number(import.meta.env.QUEUE_CONCURRENCY) || 1,
  removeOnComplete: { count: 0 },
  removeOnFail: { count: 0 },
});

worker.on("error", logger.error);

worker.on("active", (job) => {
  logger.info(`Job ${job.name}.${job.id} started.`);
});

worker.on("failed", (job, err) => {
  logger.child({ jobId: job?.id }).error(err);

  if ((job?.attemptsMade || 0) >= (job?.opts.attempts || 0)) {
    logger.error(`Job ${job?.id} has reached the maximum number of attempts`);
    onJobRetriesExhausted(job!);
  }
});

worker.on("completed", (job, result) => {
  logger.info({
    msg: `Job ${job.name}.${job.id} completed.`,
    result,
  });
});

worker.on("ready", () => {
  logger.info("Worker ready!");
});
