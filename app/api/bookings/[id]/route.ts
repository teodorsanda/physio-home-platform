import { NextRequest } from "next/server";
import { bookingsSchemas } from "@/lib/sdk/schemas";
import { buildResponse, HttpError } from "@/lib/validators/route";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  return buildResponse(async () => {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        patient: { include: { user: true } },
        therapist: { include: { user: true } },
        address: true
      }
    });
    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }
    return bookingsSchemas.byId.response.parse({
      id: booking.id,
      therapistName: booking.therapist?.user.email ?? "Unassigned",
      start: booking.scheduledStart.toISOString(),
      address: `${booking.address.line1}, ${booking.address.city}`,
      status: booking.status,
      patient: { id: booking.patient.id, fullName: booking.patient.user.email },
      therapist: booking.therapist ? { id: booking.therapist.id, fullName: booking.therapist.user.email } : null,
      location: null,
      etaMinutes: null,
      otpCode: "123456"
    });
  });
}
