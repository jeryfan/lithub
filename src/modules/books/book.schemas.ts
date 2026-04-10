import { z } from "zod";

export const bookStatusSchema = z.enum([
  "draft",
  "queued",
  "generating",
  "completed",
  "failed",
]);

export const bookSettingsSchema = z.object({
  tone: z.string().min(1).default("cinematic"),
  targetWords: z.coerce.number().int().positive().default(50000),
  model: z.string().min(1).default("mock-llm"),
  audience: z.string().min(1).default("general"),
  pointOfView: z.string().min(1).default("third-person"),
});

export const createBookSchema = z.object({
  title: z.string().min(1),
  premise: z.string().min(1),
  genre: z.string().min(1),
  settings: bookSettingsSchema.optional(),
});

export const updateBookSchema = z.object({
  title: z.string().min(1).optional(),
  premise: z.string().min(1).optional(),
  genre: z.string().min(1).optional(),
  status: bookStatusSchema.optional(),
  settings: bookSettingsSchema.partial().optional(),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
