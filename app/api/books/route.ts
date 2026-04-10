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
    const formData = await request.formData();
    const title = formData.get("title");
    const cover = formData.get("cover");
    const coverImage = await toDataUrl(cover);

    const input = createBookSchema.parse({
      title: typeof title === "string" ? title : "",
      coverImage,
    });
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

async function toDataUrl(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size === 0) {
    return "";
  }

  if (!value.type.startsWith("image/")) {
    throw new ZodError([
      {
        code: "custom",
        path: ["cover"],
        message: "Cover must be an image file.",
      },
    ]);
  }

  const bytes = Buffer.from(await value.arrayBuffer());
  return `data:${value.type};base64,${bytes.toString("base64")}`;
}
