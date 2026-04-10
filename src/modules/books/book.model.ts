import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const bookSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    premise: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["draft", "queued", "generating", "completed", "failed"],
      default: "draft",
    },
    settings: {
      tone: { type: String, default: "cinematic" },
      targetWords: { type: Number, default: 50000 },
      model: { type: String, default: "mock-llm" },
      audience: { type: String, default: "general" },
      pointOfView: { type: String, default: "third-person" },
    },
    latestVersion: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  },
);

export type BookDocument = InferSchemaType<typeof bookSchema>;

export const BookModel: Model<BookDocument> =
  models.Book || model<BookDocument>("Book", bookSchema);
