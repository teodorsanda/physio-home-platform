import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");

export const documentQueue = new Queue("document-ocr", { connection });

export function registerDocumentWorker() {
  const worker = new Worker(
    "document-ocr",
    async (job) => {
      console.info("Scanning document", job.id);
      return { text: "Stub OCR text" };
    },
    { connection }
  );
  worker.on("completed", (job) => console.info("Document processed", job.id));
  worker.on("failed", (job, err) => console.error("Document failed", job?.id, err));
  return worker;
}
