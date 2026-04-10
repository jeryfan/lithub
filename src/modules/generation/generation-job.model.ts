import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const generationStepSchema = new Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      required: true,
    },
    detail: { type: String },
    startedAt: { type: Date },
    finishedAt: { type: Date },
  },
  { _id: false },
);

const generationJobSchema = new Schema(
  {
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    status: {
      type: String,
      enum: ["queued", "running", "completed", "failed"],
      default: "queued",
    },
    currentStep: { type: String, default: "queued" },
    steps: { type: [generationStepSchema], default: [] },
    logs: { type: [String], default: [] },
    result: {
      chapterTitle: { type: String },
      chapterContent: { type: String },
    },
    failedReason: { type: String },
  },
  {
    timestamps: true,
  },
);

export type GenerationJobDocument = InferSchemaType<typeof generationJobSchema>;

export const GenerationJobModel: Model<GenerationJobDocument> =
  models.GenerationJob ||
  model<GenerationJobDocument>("GenerationJob", generationJobSchema);
