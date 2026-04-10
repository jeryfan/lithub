import { NextResponse } from "next/server";

import { pingDatabase } from "@/src/lib/db/mongodb";
import { pingRedis } from "@/src/lib/queue/connection";
import { logger } from "@/src/lib/logger";

export async function GET() {
  try {
    const [mongoOk, redisOk] = await Promise.all([pingDatabase(), pingRedis()]);
    const ready = mongoOk && redisOk;

    return NextResponse.json(
      {
        status: ready ? "ok" : "degraded",
        check: "readyz",
        services: {
          mongo: mongoOk ? "up" : "down",
          redis: redisOk ? "up" : "down",
        },
        timestamp: new Date().toISOString(),
      },
      { status: ready ? 200 : 503 },
    );
  } catch (error) {
    logger.error({ err: error }, "Readiness check failed");

    return NextResponse.json(
      {
        status: "down",
        check: "readyz",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
