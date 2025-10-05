import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { authSchemas } from "@/lib/sdk/schemas";
import { buildResponse, parseJson, validateRequest } from "@/lib/validators/route";
import { verifyPassword } from "@/lib/auth/password";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function POST(req: NextRequest) {
  const body = await parseJson(req);
  return buildResponse(async () => {
    const data = validateRequest(authSchemas.login.body, body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const valid = await verifyPassword(data.password, user.passwordHash);
    if (!valid) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    return { token, expiresIn: 3600 };
  });
}
