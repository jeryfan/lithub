import IORedis from "ioredis";

import { getEnv } from "@/src/lib/config/env";

let redisConnection: IORedis | null = null;

export function getRedisConnection() {
  if (redisConnection) {
    return redisConnection;
  }

  const env = getEnv();
  redisConnection = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  return redisConnection;
}
