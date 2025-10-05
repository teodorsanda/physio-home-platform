import { NextRequest } from "next/server";
import { therapistSchemas } from "@/lib/sdk/schemas";
import { buildResponse, parseJson, validateRequest } from "@/lib/validators/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const body = await parseJson(req);
  return buildResponse(async () => {
    const data = validateRequest(therapistSchemas.availability.body, body);
    const therapist = await prisma.therapist.findFirst();
    if (!therapist) {
      throw new Error("Therapist not found");
    }
    await prisma.availability.deleteMany({ where: { therapistId: therapist.id } });
    await prisma.$transaction(
      data.availability.map((slot) =>
        prisma.availability.create({
          data: {
            therapistId: therapist.id,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.slots[0]?.start ?? "08:00",
            endTime: slot.slots[0]?.end ?? "17:00"
          }
        })
      )
    );
    return therapistSchemas.availability.response.parse({ success: true });
  });
}
