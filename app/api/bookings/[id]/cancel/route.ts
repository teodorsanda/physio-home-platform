import { NextRequest } from "next/server";
import { bookingsSchemas } from "@/lib/sdk/schemas";
import { buildResponse, HttpError, parseJson, validateRequest } from "@/lib/validators/route";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const body = await parseJson(req);
  return buildResponse(async () => {
    const data = validateRequest(bookingsSchemas.cancel.body, body);
    const booking = await prisma.booking.findUnique({ where: { id: params.id } });
    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    await prisma.auditLog.create({
      data: {
        entityType: "Booking",
        entityId: params.id,
        action: "Cancel",
        metadata: { reason: data.reason }
      }
    });
    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: { status: "Cancelled" }
    });
    return bookingsSchemas.cancel.response.parse({ success: true, status: updated.status });
  });
}
