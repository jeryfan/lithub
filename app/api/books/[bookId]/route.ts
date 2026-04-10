import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { logger } from "@/src/lib/logger";
import {
  getBookById,
  updateBook,
} from "@/src/modules/books/book.service";
import { updateBookSchema } from "@/src/modules/books/book.schemas";

type Context = {
  params: Promise<{
    bookId: string;
  }>;
};

export async function GET(_request: Request, context: Context) {
  const { bookId } = await context.params;
  const book = await getBookById(bookId);

  if (!book) {
    return NextResponse.json({ message: "Book not found." }, { status: 404 });
  }

  return NextResponse.json({ book });
}

export async function PATCH(request: Request, context: Context) {
  const { bookId } = await context.params;

  try {
    const input = updateBookSchema.parse(await request.json());
    const book = await updateBook(bookId, input);

    if (!book) {
      return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Book updated.",
      book,
    });
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

    logger.error({ err: error, bookId }, "Failed to update book");

    return NextResponse.json({ message: "Failed to update book." }, { status: 500 });
  }
}
