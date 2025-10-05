import { NextRequest } from "next/server";
import { bookingsSchemas } from "@/lib/sdk/schemas";
import { buildResponse, parseJson, validateRequest } from "@/lib/validators/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await parseJson(req);
  return buildResponse(async () => {
    const data = validateRequest(bookingsSchemas.create.body, body);
    const booking = await prisma.booking.create({
      data: {
        patientId: data.patientId,
        addressId: data.addressId,
        therapistGenderPreference: data.therapistGenderPreference as any,
        scheduledStart: new Date(data.scheduledStart),
        notes: data.notes ?? undefined
      },
      include: {
        therapist: { include: { user: true } },
        address: true
      }
    });
    return bookingsSchemas.create.response.parse({
      id: booking.id,
      therapistName: booking.therapist?.user.email ?? "Unassigned",
      start: booking.scheduledStart.toISOString(),
      address: `${booking.address.line1}, ${booking.address.city}`,
      status: booking.status,
      paymentIntentClientSecret: `pi_${booking.id}`
    });
  });
}
