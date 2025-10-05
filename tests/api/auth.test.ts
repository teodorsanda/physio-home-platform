import { describe, expect, it, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { hashPassword } from "@/lib/auth/password";
import { mockPrisma, resetMockPrisma } from "../mocks/prisma";

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));

describe("auth API routes", () => {
  beforeEach(() => {
    resetMockPrisma();
  });

  it("registers a patient account", async () => {
    const { POST } = await import("@/app/api/auth/register/route");
    mockPrisma.user.create.mockResolvedValueOnce({ id: "user-1", email: "new@example.com" });

    const request = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "new@example.com", password: "StrongPassword1!" }),
      headers: { "content-type": "application/json" }
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toEqual({ id: "user-1", email: "new@example.com" });
    expect(mockPrisma.user.create).toHaveBeenCalled();
  });

  it("returns a JWT for valid credentials", async () => {
    const { POST } = await import("@/app/api/auth/login/route");
    const passwordHash = await hashPassword("ValidPassword!1");
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: "user-42",
      role: "PATIENT",
      passwordHash
    } as any);

    const request = new NextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com", password: "ValidPassword!1" }),
      headers: { "content-type": "application/json" }
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(typeof payload.token).toBe("string");
    const decoded = jwt.verify(payload.token, process.env.JWT_SECRET || "test-secret");
    expect((decoded as any).sub).toBe("user-42");
  });
});
