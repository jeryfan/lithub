import { logger } from "@/src/lib/logger";
import { createGenerationWorker } from "@/src/workers/generation-worker";

const worker = createGenerationWorker();

worker.on("ready", () => {
  logger.info("Generation worker ready");
});

worker.on("completed", (job) => {
  logger.info({ bullJobId: job.id }, "Worker completed BullMQ job");
});

worker.on("failed", (job, error) => {
  logger.error(
    { bullJobId: job?.id, err: error },
    "Worker failed BullMQ job",
  );
});

const shutdown = async () => {
  await worker.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
