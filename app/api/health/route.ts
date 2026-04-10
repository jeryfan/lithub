import { NextResponse } from "next/server";

import { getEnv } from "@/src/lib/config/env";

export async function GET() {
  const env = getEnv();

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      app: "up",
      mongo: env.MONGODB_URI ? "configured" : "missing",
      redis: env.REDIS_URL ? "configured" : "missing",
    },
  });
}
