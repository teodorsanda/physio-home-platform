import { NextRequest, NextResponse } from "next/server";
import { z, ZodSchema } from "zod";

export function validateRequest<T extends ZodSchema<any>>(schema: T, body: unknown) {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

export class ValidationError extends Error {
  details: Record<string, string[]>;

  constructor(details: Record<string, string[]>) {
    super("Validation error");
    this.details = details;
  }
}

export async function buildResponse<T>(handler: () => Promise<T>) {
  try {
    const data = await handler();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.details }, { status: 422 });
    }
    console.error("API error", { message: (error as Error).message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function parseJson(req: NextRequest) {
  if (req.headers.get("content-type")?.includes("application/json")) {
    return req.json();
  }
  return {};
}
