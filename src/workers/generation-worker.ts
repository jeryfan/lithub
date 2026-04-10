import { Worker } from "bullmq";

import { getEnv } from "@/src/lib/config/env";
import { connectToDatabase } from "@/src/lib/db/mongodb";
import { logger } from "@/src/lib/logger";
import { getRedisConnection } from "@/src/lib/queue/connection";
import { getGenerationQueueName } from "@/src/lib/queue/queues";
import {
  completeGenerationJob,
  failGenerationJob,
  markJobRunning,
  markStepCompleted,
} from "@/src/modules/generation/generation.service";

function buildMockChapter(bookTitle: string) {
  return {
    chapterTitle: "第一章：坍缩星门之后",
    chapterContent: `${bookTitle} 的第一章示例正文已经由 worker 生成。

主角在失控的跃迁舱中苏醒，舷窗外只剩下破碎星门投出的冷白弧光。舰桥日志残缺不全，但一个被反复提及的坐标仍然在闪烁，像是某种还未完成的召回命令。`,
  };
}

export function createGenerationWorker() {
  const env = getEnv();

  return new Worker(
    getGenerationQueueName(),
    async (job) => {
      const { bookId, jobId } = job.data;

      try {
        await connectToDatabase();

        await markJobRunning(jobId, "outline");
        await new Promise((resolve) => setTimeout(resolve, 500));
        await markStepCompleted(jobId, "outline");

        await markJobRunning(jobId, "chapter-draft");
        await new Promise((resolve) => setTimeout(resolve, 500));

        const chapter = buildMockChapter(`书籍 ${bookId}`);

        await markStepCompleted(jobId, "chapter-draft");
        await completeGenerationJob(jobId, chapter);

        logger.info({ jobId, bookId }, "Generation job completed");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown worker error";

        await failGenerationJob(jobId, message);
        logger.error({ err: error, jobId, bookId }, "Generation job failed");
        throw error;
      }
    },
    {
      connection: getRedisConnection(),
      concurrency: env.JOB_CONCURRENCY,
    },
  );
}
