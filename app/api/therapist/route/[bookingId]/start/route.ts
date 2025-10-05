import { NextRequest } from "next/server";
import { therapistSchemas } from "@/lib/sdk/schemas";
import { buildResponse, parseJson, validateRequest } from "@/lib/validators/route";
import { prisma } from "@/lib/prisma";
import { emitTherapistLocation } from "@/lib/realtime/socket-server";

interface Params {
  params: { bookingId: string };
}

export async function POST(req: NextRequest, { params }: Params) {
  const body = await parseJson(req);
  return buildResponse(async () => {
    const data = validateRequest(therapistSchemas.route.body, body);
    await prisma.booking.update({ where: { id: params.bookingId }, data: { status: "EnRoute" } });
    const etaMinutes = 25;
    await emitTherapistLocation({
      bookingId: params.bookingId,
      ...data,
      etaMinutes
    });
    return therapistSchemas.route.response.parse({ success: true, etaMinutes });
  });
}
