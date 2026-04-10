import { Queue } from "bullmq";

import { getEnv } from "@/src/lib/config/env";
import { getRedisConnection } from "@/src/lib/queue/connection";

export type GenerationJobData = {
  bookId: string;
  jobId: string;
};

let generationQueue: Queue<GenerationJobData> | null = null;

export function getGenerationQueueName() {
  return getEnv().BOOK_GENERATION_QUEUE;
}

export function getGenerationQueue() {
  if (generationQueue) {
    return generationQueue;
  }

  generationQueue = new Queue<GenerationJobData>(getGenerationQueueName(), {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      removeOnComplete: 100,
      removeOnFail: 200,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    },
  });

  return generationQueue;
}
