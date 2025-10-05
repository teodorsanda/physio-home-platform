import { describe, expect, it, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { bookingsSchemas } from "@/lib/sdk/schemas";
import { mockPrisma, resetMockPrisma } from "../mocks/prisma";

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));

describe("bookings API routes", () => {
  beforeEach(() => {
    resetMockPrisma();
  });

  it("creates a booking and returns typed payload", async () => {
    const { POST } = await import("@/app/api/bookings/route");
    const payload = {
      patientId: "patient-1",
      addressId: "address-1",
      scheduledStart: new Date("2024-05-01T10:00:00Z").toISOString(),
      therapistGenderPreference: "Any",
      notes: "Please bring resistance bands",
      paymentMethodId: "pm_123"
    };

    mockPrisma.booking.create.mockResolvedValueOnce({
      id: "booking-1",
      therapist: { user: { email: "therapist@example.com" } },
      address: { line1: "Strada Exemplu 1", city: "București" },
      scheduledStart: new Date("2024-05-01T10:00:00Z"),
      status: "Pending"
    } as any);

    const request = new NextRequest("http://localhost/api/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "content-type": "application/json" }
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(bookingsSchemas.create.response.safeParse(json).success).toBe(true);
    expect(json.therapistName).toBe("therapist@example.com");
    expect(mockPrisma.booking.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ patientId: "patient-1", addressId: "address-1" }),
      include: expect.any(Object)
    });
  });

  it("returns 404 when fetching a missing booking", async () => {
    const { GET } = await import("@/app/api/bookings/[id]/route");
    mockPrisma.booking.findUnique.mockResolvedValueOnce(null);
    const response = await GET(new NextRequest("http://localhost/api/bookings/booking-404"), {
      params: { id: "booking-404" }
    });
    expect(response.status).toBe(404);
    const payload = await response.json();
    expect(payload.error).toBe("Booking not found");
  });
});
