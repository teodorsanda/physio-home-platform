import { sdk } from "@/lib/sdk";

export async function uploadDocument(): Promise<void> {
  const { url, fields } = await sdk.patient.createDocumentUpload();
  console.info("Upload using presigned URL", { url, fields: Object.keys(fields).length });
}
