import { NextRequest } from "next/server";
import { bookingsSchemas } from "@/lib/sdk/schemas";
import { buildResponse, parseJson, validateRequest } from "@/lib/validators/route";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const body = await parseJson(req);
  return buildResponse(async () => {
    const data = validateRequest(bookingsSchemas.cancel.body, body);
    await prisma.auditLog.create({
      data: {
        entityType: "Booking",
        entityId: params.id,
        action: "Cancel",
        metadata: { reason: data.reason }
      }
    });
    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: { status: "Cancelled" }
    });
    return bookingsSchemas.cancel.response.parse({ success: true, status: booking.status });
  });
}
