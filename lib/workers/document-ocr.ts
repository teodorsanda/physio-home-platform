import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { logger } from "@/lib/utils/logger";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");

export const documentQueue = new Queue("document-ocr", { connection });

export function registerDocumentWorker() {
  const worker = new Worker(
    "document-ocr",
    async (job) => {
      logger.info("Scanning document", { jobId: job.id });
      return { text: "Stub OCR text" };
    },
    { connection }
  );
  worker.on("completed", (job) => logger.info("Document processed", { jobId: job.id }));
  worker.on("failed", (job, err) => logger.error("Document failed", { jobId: job?.id, error: err.message }));
  return worker;
}
