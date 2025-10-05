import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    exportUrl: `https://minio.local/exports/${Date.now()}.zip`
  });
}
