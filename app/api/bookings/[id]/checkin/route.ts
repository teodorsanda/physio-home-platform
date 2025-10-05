import { NextRequest } from "next/server";
import { bookingsSchemas } from "@/lib/sdk/schemas";
import { buildResponse, HttpError, parseJson, validateRequest } from "@/lib/validators/route";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: Params) {
  const body = await parseJson(req);
  return buildResponse(async () => {
    const data = validateRequest(bookingsSchemas.checkin.body, body);
    const booking = await prisma.booking.findUnique({ where: { id: params.id } });
    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    await prisma.checkIn.create({
      data: {
        bookingId: params.id,
        method: data.method,
        confirmedBy: data.method === "PatientApp" ? "Patient" : "Therapist",
        lat: 44.43,
        lng: 26.1
      }
    });
    return bookingsSchemas.checkin.response.parse({
      success: true,
      confirmedBy: data.method === "PatientApp" ? "Patient" : "Therapist",
      timestamp: new Date().toISOString()
    });
  });
}
