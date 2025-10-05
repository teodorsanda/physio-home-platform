import { sdk } from "@/lib/sdk";
import { logger } from "@/lib/utils/logger";

export async function uploadDocument(): Promise<void> {
  const { url, fields } = await sdk.patient.createDocumentUpload();
  logger.info("Upload using presigned URL", { url, fieldCount: Object.keys(fields).length });
}
