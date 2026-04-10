import { isValidObjectId } from "mongoose";

import { connectToDatabase } from "@/src/lib/db/mongodb";
import { BookModel } from "@/src/modules/books/book.model";
import {
  CreateBookInput,
  UpdateBookInput,
} from "@/src/modules/books/book.schemas";
import { GenerationJobModel } from "@/src/modules/generation/generation-job.model";

export async function createBook(input: CreateBookInput) {
  await connectToDatabase();

  const settings = {
    tone: "cinematic",
    targetWords: 50000,
    model: "mock-llm",
    audience: "general",
    pointOfView: "third-person",
  };

  return BookModel.create({
    title: input.title,
    coverImage: input.coverImage || null,
    premise: "",
    genre: "",
    settings,
  });
}

export async function listBooks() {
  await connectToDatabase();

  return BookModel.find({}).sort({ updatedAt: -1 }).limit(50).lean();
}

export async function getBookById(bookId: string) {
  if (!isValidObjectId(bookId)) {
    return null;
  }

  await connectToDatabase();

  return BookModel.findById(bookId).lean();
}

export async function updateBook(bookId: string, input: UpdateBookInput) {
  if (!isValidObjectId(bookId)) {
    return null;
  }

  await connectToDatabase();

  const update: Record<string, unknown> = {};

  if (input.title !== undefined) {
    update.title = input.title;
  }

  if (input.coverImage !== undefined) {
    update.coverImage = input.coverImage || null;
  }

  if (input.premise !== undefined) {
    update.premise = input.premise;
  }

  if (input.genre !== undefined) {
    update.genre = input.genre;
  }

  if (input.status !== undefined) {
    update.status = input.status;
  }

  if (input.settings) {
    for (const [key, value] of Object.entries(input.settings)) {
      update[`settings.${key}`] = value;
    }
  }

  if (Object.keys(update).length === 0) {
    return BookModel.findById(bookId).lean();
  }

  return BookModel.findByIdAndUpdate(
    bookId,
    {
      $set: update,
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();
}

export async function getBookDashboard(bookId: string) {
  if (!isValidObjectId(bookId)) {
    return null;
  }

  await connectToDatabase();

  const [book, jobs] = await Promise.all([
    BookModel.findById(bookId).lean(),
    GenerationJobModel.find({ bookId }).sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  if (!book) {
    return null;
  }

  return {
    book,
    jobs,
  };
}
