import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { logger } from "@/lib/utils/logger";

export function validateRequest<T extends ZodSchema<any>>(schema: T, body: unknown) {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

export class HttpError extends Error {
  status: number;
  payload?: Record<string, unknown>;

  constructor(status: number, message: string, payload?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export class ValidationError extends HttpError {
  details: Record<string, string[]>;

  constructor(details: Record<string, string[]>) {
    super(422, "Validation error", { error: details });
    this.details = details;
  }
}

export async function buildResponse<T>(handler: () => Promise<T>) {
  try {
    const data = await handler();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.warn("Validation failed", { details: error.details });
      return NextResponse.json({ error: error.details }, { status: error.status });
    }
    if (error instanceof HttpError) {
      logger.warn("Handled HTTP error", { status: error.status, message: error.message });
      return NextResponse.json(error.payload ?? { error: error.message }, { status: error.status });
    }
    logger.error("API error", { message: (error as Error).message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function parseJson(req: NextRequest) {
  if (req.headers.get("content-type")?.includes("application/json")) {
    return req.json();
  }
  return {};
}
