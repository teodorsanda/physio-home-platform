import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/utils/logger";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  logger.info("Privacy delete requested", payload);
  return NextResponse.json({ success: true });
}
