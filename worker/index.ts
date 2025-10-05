import { registerDocumentWorker } from "../lib/workers/document-ocr";
import { logger } from "@/lib/utils/logger";

registerDocumentWorker();

logger.info("Worker started");
