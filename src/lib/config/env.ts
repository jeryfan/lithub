import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGODB_URI: z.string().min(1),
  REDIS_URL: z.string().min(1),
  BOOK_GENERATION_QUEUE: z.string().min(1).default("book-generation"),
  JOB_CONCURRENCY: z.coerce.number().int().positive().default(2),
  NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: z.string().optional(),
});

let cachedEnv: z.infer<typeof envSchema> | null = null;

export function getEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  cachedEnv = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    REDIS_URL: process.env.REDIS_URL,
    BOOK_GENERATION_QUEUE: process.env.BOOK_GENERATION_QUEUE,
    JOB_CONCURRENCY: process.env.JOB_CONCURRENCY,
    NEXT_SERVER_ACTIONS_ENCRYPTION_KEY:
      process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY,
  });

  return cachedEnv;
}
