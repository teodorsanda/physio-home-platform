import { NextRequest } from "next/server";
import { paymentsSchemas } from "@/lib/sdk/schemas";
import { buildResponse, parseJson, validateRequest } from "@/lib/validators/route";
import { logger } from "@/lib/utils/logger";

export async function POST(req: NextRequest) {
  const body = await parseJson(req);
  return buildResponse(async () => {
    const data = validateRequest(paymentsSchemas.intent.body, body);
    logger.info("Stripe intent stub", { bookingId: data.bookingId, amount: data.amount });
    return paymentsSchemas.intent.response.parse({
      clientSecret: `pi_${data.bookingId}_secret`,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_stub"
    });
  });
}
