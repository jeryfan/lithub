import { Types } from "mongoose";

import { connectToDatabase } from "@/src/lib/db/mongodb";
import { logger } from "@/src/lib/logger";
import { GenerationJobData, getGenerationQueue } from "@/src/lib/queue/queues";
import { BookModel } from "@/src/modules/books/book.model";
import { GenerationJobModel } from "@/src/modules/generation/generation-job.model";
import { CreateGenerationJobInput } from "@/src/modules/generation/generation.schemas";

export async function createGenerationJob(input: CreateGenerationJobInput) {
  await connectToDatabase();

  let bookId: string;
  let book;

  if ("bookId" in input) {
    const existingBook = await BookModel.findByIdAndUpdate(
      input.bookId,
      {
        $set: {
          status: "queued",
        },
      },
      {
        new: true,
      },
    );

    if (!existingBook) {
      throw new Error("Book not found.");
    }

    book = existingBook;
    bookId = existingBook.id;
  } else {
    book = await BookModel.create({
      title: input.title,
      premise: input.premise,
      genre: input.genre,
      status: "queued",
      settings: {
        tone: input.tone,
        targetWords: input.targetWords,
        model: input.model,
      },
    });
    bookId = book.id;
  }

  const generationJob = await GenerationJobModel.create({
    bookId,
    status: "queued",
    currentStep: "queued",
    logs: ["Job created and waiting in queue."],
    steps: [
      {
        name: "outline",
        status: "pending",
      },
      {
        name: "chapter-draft",
        status: "pending",
      },
    ],
  });

  const queuePayload: GenerationJobData = {
    bookId,
    jobId: generationJob._id.toString(),
  };

  await getGenerationQueue().add("generate-book", queuePayload);
  logger.info({ queuePayload }, "Generation job enqueued");

  return {
    book,
    generationJob,
  };
}

export async function listGenerationJobs() {
  await connectToDatabase();

  return GenerationJobModel.find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("bookId")
    .lean();
}

export async function listGenerationJobsByBookId(bookId: string) {
  await connectToDatabase();

  return GenerationJobModel.find({ bookId })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
}

export async function markJobRunning(jobId: string, step: string) {
  await connectToDatabase();

  await GenerationJobModel.findByIdAndUpdate(
    jobId,
    {
      $set: {
        status: "running",
        currentStep: step,
        "steps.$[step].status": "running",
        "steps.$[step].startedAt": new Date(),
      },
      $push: {
        logs: `Started step: ${step}`,
      },
    },
    {
      arrayFilters: [{ "step.name": step }],
    },
  );
}

export async function markStepCompleted(jobId: string, step: string) {
  await connectToDatabase();

  await GenerationJobModel.findByIdAndUpdate(
    jobId,
    {
      $set: {
        "steps.$[step].status": "completed",
        "steps.$[step].finishedAt": new Date(),
      },
      $push: {
        logs: `Completed step: ${step}`,
      },
    },
    {
      arrayFilters: [{ "step.name": step }],
    },
  );
}

export async function completeGenerationJob(
  jobId: string,
  result: { chapterTitle: string; chapterContent: string },
) {
  await connectToDatabase();

  const generationJob = await GenerationJobModel.findByIdAndUpdate(
    jobId,
    {
      $set: {
        status: "completed",
        currentStep: "completed",
        result,
      },
      $push: {
        logs: "Job completed.",
      },
    },
    { new: true },
  );

  if (generationJob?.bookId instanceof Types.ObjectId) {
    await BookModel.findByIdAndUpdate(generationJob.bookId, {
      $set: { status: "completed" },
      $inc: { latestVersion: 1 },
    });
  }
}

export async function failGenerationJob(jobId: string, reason: string) {
  await connectToDatabase();

  const generationJob = await GenerationJobModel.findByIdAndUpdate(
    jobId,
    {
      $set: {
        status: "failed",
        currentStep: "failed",
        failedReason: reason,
      },
      $push: {
        logs: `Job failed: ${reason}`,
      },
    },
    { new: true },
  );

  if (generationJob?.bookId instanceof Types.ObjectId) {
    await BookModel.findByIdAndUpdate(generationJob.bookId, {
      $set: { status: "failed" },
    });
  }
}
