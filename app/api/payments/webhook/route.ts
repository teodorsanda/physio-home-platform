import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/utils/logger";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  logger.info("Stripe webhook received", { type: payload.type ?? "unknown" });
  return NextResponse.json({ received: true });
}
