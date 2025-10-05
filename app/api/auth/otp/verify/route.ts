import { NextRequest } from "next/server";
import { authSchemas } from "@/lib/sdk/schemas";
import { buildResponse, parseJson, validateRequest } from "@/lib/validators/route";

export async function POST(req: NextRequest) {
  const body = await parseJson(req);
  return buildResponse(async () => {
    const data = validateRequest(authSchemas.verifyOtp.body, body);
    console.info("OTP verified", { phone: data.phone.replace(/.(?=.{2})/g, "*") });
    return { success: true, sessionId: `sess_${Date.now()}` };
  });
}
