import { buildResponse } from "@/lib/validators/route";
import { prisma } from "@/lib/prisma";
import { therapistSchemas } from "@/lib/sdk/schemas";

export async function GET() {
  return buildResponse(async () => {
    const therapist = await prisma.therapist.findFirst({
      include: {
        availability: true,
        bookings: {
          include: { address: true, therapist: { include: { user: true } } },
          orderBy: { scheduledStart: "asc" },
          take: 10
        }
      }
    });
    const data = therapistSchemas.schedule.response.parse({
      therapistId: therapist?.id ?? "therapist",
      availability:
        therapist?.availability.map((slot) => ({
          dayOfWeek: slot.dayOfWeek,
          slots: [{ start: slot.startTime, end: slot.endTime }]
        })) ?? [],
      upcomingBookings:
        therapist?.bookings.map((booking) => ({
          id: booking.id,
          therapistName: booking.therapist?.user.email ?? "You",
          start: booking.scheduledStart.toISOString(),
          address: `${booking.address.line1}, ${booking.address.city}`,
          status: booking.status
        })) ?? []
    });
    return data;
  });
}
