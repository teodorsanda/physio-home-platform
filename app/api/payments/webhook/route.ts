import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  console.info("Stripe webhook", { type: payload.type });
  return NextResponse.json({ received: true });
}
