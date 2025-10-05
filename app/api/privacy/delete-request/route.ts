import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  console.info("Deletion requested", payload);
  return NextResponse.json({ success: true });
}
