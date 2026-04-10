import { z } from "zod";

export const createGenerationJobSchema = z.union([
  z.object({
    bookId: z.string().min(1),
  }),
  z.object({
    title: z.string().min(1),
    premise: z.string().min(1),
    genre: z.string().min(1),
    tone: z.string().min(1).default("cinematic"),
    targetWords: z.coerce.number().int().positive().default(50000),
    model: z.string().min(1).default("mock-llm"),
  }),
]);

export type CreateGenerationJobInput = z.infer<typeof createGenerationJobSchema>;
