import { NextRequest } from "next/server";
import { patientSchemas } from "@/lib/sdk/schemas";
import { buildResponse } from "@/lib/validators/route";

export async function POST(_req: NextRequest) {
  return buildResponse(async () => {
    return patientSchemas.documents.response.parse({
      url: "https://minio.local/upload",
      fields: {
        key: `documents/${Date.now()}`,
        policy: "stub",
        "x-amz-signature": "stub"
      }
    });
  });
}
