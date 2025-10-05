import { buildResponse } from "@/lib/validators/route";
import { opsSchemas } from "@/lib/sdk/schemas";

export async function GET() {
  return buildResponse(async () => {
    return opsSchemas.kpis.response.parse({
      conversionRate: 42.5,
      onTimeArrivalRate: 92.1,
      noShowRate: 3.3,
      utilization: 71.4,
      nps: 68
    });
  });
}
