import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { logger } from "@/src/lib/logger";
import {
  createGenerationJob,
  listGenerationJobs,
} from "@/src/modules/generation/generation.service";
import { createGenerationJobSchema } from "@/src/modules/generation/generation.schemas";

export async function GET() {
  const jobs = await listGenerationJobs();
  return NextResponse.json({ jobs });
}

export async function POST(request: Request) {
  try {
    const input = createGenerationJobSchema.parse(await request.json());
    const result = await createGenerationJob(input);

    return NextResponse.json(
      {
        message: "Generation job created.",
        book: result.book,
        generationJob: result.generationJob,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid request payload.",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    logger.error({ err: error }, "Failed to create generation job");

    return NextResponse.json(
      { message: "Failed to create generation job." },
      { status: 500 },
    );
  }
}
