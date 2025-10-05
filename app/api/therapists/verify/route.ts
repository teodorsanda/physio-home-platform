import { NextRequest } from "next/server";
import { opsSchemas } from "@/lib/sdk/schemas";
import { buildResponse, parseJson, validateRequest } from "@/lib/validators/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await parseJson(req);
  return buildResponse(async () => {
    const data = validateRequest(opsSchemas.verifyTherapist.body, body);
    await prisma.therapist.update({ where: { id: data.therapistId }, data: { kycStatus: data.approved ? "Approved" : "Rejected" } });
    return opsSchemas.verifyTherapist.response.parse({ success: true, status: data.approved ? "Approved" : "Rejected" });
  });
}
