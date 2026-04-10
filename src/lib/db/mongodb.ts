import mongoose from "mongoose";

import { getEnv } from "@/src/lib/config/env";
import { logger } from "@/src/lib/logger";

const globalMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: typeof mongoose;
  mongoosePromise?: Promise<typeof mongoose>;
};

function getDatabaseName(uri: string) {
  try {
    const pathname = new URL(uri).pathname.replace("/", "");
    return pathname || "lithub";
  } catch {
    return "lithub";
  }
}

export async function connectToDatabase() {
  const env = getEnv();

  if (globalMongoose.mongooseConnection) {
    return globalMongoose.mongooseConnection;
  }

  if (!globalMongoose.mongoosePromise) {
    globalMongoose.mongoosePromise = mongoose.connect(env.MONGODB_URI, {
      dbName: getDatabaseName(env.MONGODB_URI),
    });
  }

  globalMongoose.mongooseConnection = await globalMongoose.mongoosePromise;
  logger.info("MongoDB connected");

  return globalMongoose.mongooseConnection;
}

export async function pingDatabase() {
  const connection = await connectToDatabase();
  const result = await connection.connection.db?.admin().ping();

  return result?.ok === 1;
}
