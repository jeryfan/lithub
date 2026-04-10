import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { logger } from "@/src/lib/logger";
import { createBook, listBooks } from "@/src/modules/books/book.service";
import { createBookSchema } from "@/src/modules/books/book.schemas";

export async function GET() {
  const books = await listBooks();
  return NextResponse.json({ books });
}

export async function POST(request: Request) {
  try {
    const input = createBookSchema.parse(await request.json());
    const book = await createBook(input);

    return NextResponse.json(
      {
        message: "Book created.",
        book,
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

    logger.error({ err: error }, "Failed to create book");

    return NextResponse.json({ message: "Failed to create book." }, { status: 500 });
  }
}
