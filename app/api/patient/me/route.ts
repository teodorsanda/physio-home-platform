import { NextRequest } from "next/server";
import { patientSchemas } from "@/lib/sdk/schemas";
import { buildResponse, parseJson, validateRequest } from "@/lib/validators/route";
import { prisma } from "@/lib/prisma";

const selectSummary = {
  id: true,
  user: { select: { email: true } },
  bookings: {
    take: 20,
    orderBy: { scheduledStart: "asc" },
    include: { therapist: { select: { user: { select: { email: true } } } }, address: true }
  },
  documents: true
};

export async function GET() {
  return buildResponse(async () => {
    const patient = await prisma.patient.findFirst({ where: { deletedAt: null }, select: selectSummary });
    if (!patient) {
      throw new Error("Patient not found");
    }
    return formatPatient(patient);
  });
}

export async function PUT(req: NextRequest) {
  const body = await parseJson(req);
  return buildResponse(async () => {
    const data = validateRequest(patientSchemas.me.body, body);
    const patient = await prisma.patient.findFirst({ where: { deletedAt: null } });
    if (!patient) {
      throw new Error("Patient not found");
    }
    await prisma.patient.update({
      where: { id: patient.id },
      data: { qualification: data.qualificationAnswers ?? [] }
    });
    const refreshed = await prisma.patient.findUnique({ where: { id: patient.id }, select: selectSummary });
    if (!refreshed) {
      throw new Error("Patient not found");
    }
    return formatPatient(refreshed);
  });
}

function formatPatient(patient: any) {
  const now = new Date();
  const upcoming = patient.bookings.filter((b: any) => new Date(b.scheduledStart) >= now);
  const past = patient.bookings.filter((b: any) => new Date(b.scheduledStart) < now);
  return {
    id: patient.id,
    fullName: patient.user.email,
    phone: null,
    openTickets: 0,
    upcomingBookings: upcoming.map(mapBooking),
    pastBookings: past.map(mapBooking),
    documents: patient.documents.map((doc: any) => ({
      id: doc.id,
      type: doc.type,
      uploadedAt: doc.createdAt.toISOString(),
      secureUrl: doc.url
    }))
  };
}

function mapBooking(booking: any) {
  return {
    id: booking.id,
    therapistName: booking.therapist?.user.email ?? "Unassigned",
    start: booking.scheduledStart,
    address: `${booking.address.line1}, ${booking.address.city}`,
    status: booking.status
  };
}
