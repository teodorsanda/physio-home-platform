import { NextRequest } from "next/server";
import { bookingsSchemas } from "@/lib/sdk/schemas";
import { buildResponse, parseJson, validateRequest } from "@/lib/validators/route";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: Params) {
  const body = await parseJson(req);
  return buildResponse(async () => {
    const data = validateRequest(bookingsSchemas.assign.body, body);
    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: { therapistId: data.therapistId, status: "Assigned" }
    });
    return bookingsSchemas.assign.response.parse({ success: true, status: booking.status });
  });
}
