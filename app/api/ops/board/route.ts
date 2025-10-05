import { buildResponse } from "@/lib/validators/route";
import { prisma } from "@/lib/prisma";
import { opsSchemas } from "@/lib/sdk/schemas";

export async function GET() {
  return buildResponse(async () => {
    const bookings = await prisma.booking.findMany({
      include: { address: true, therapist: { include: { user: true } } },
      orderBy: { scheduledStart: "asc" },
      take: 20
    });
    const unassigned = bookings
      .filter((booking) => !booking.therapistId)
      .map((booking) => ({
        id: booking.id,
        therapistName: "Unassigned",
        start: booking.scheduledStart.toISOString(),
        address: `${booking.address.line1}, ${booking.address.city}`,
        status: booking.status,
        patientId: booking.patientId,
        location: null,
        therapistId: null
      }));
    const active = bookings
      .filter((booking) => booking.status !== "Pending")
      .map((booking) => ({
        id: booking.id,
        therapistName: booking.therapist?.user.email ?? "Unassigned",
        start: booking.scheduledStart.toISOString(),
        address: `${booking.address.line1}, ${booking.address.city}`,
        status: booking.status,
        patientId: booking.patientId,
        location: null,
        therapistId: booking.therapistId ?? null
      }));
    return opsSchemas.board.response.parse({ unassigned, active });
  });
}
