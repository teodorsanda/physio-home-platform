import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

describe("payments API routes", () => {
  it("creates a Stripe intent stub", async () => {
    const { POST } = await import("@/app/api/payments/intent/route");
    const request = new NextRequest("http://localhost/api/payments/intent", {
      method: "POST",
      body: JSON.stringify({ bookingId: "booking-77", amount: 25000, currency: "RON" }),
      headers: { "content-type": "application/json" }
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.clientSecret).toContain("booking-77");
    expect(payload.publishableKey).toBe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_stub");
  });

  it("acknowledges webhook payloads", async () => {
    const { POST } = await import("@/app/api/payments/webhook/route");
    const request = new NextRequest("http://localhost/api/payments/webhook", {
      method: "POST",
      body: JSON.stringify({ type: "payment_intent.succeeded" }),
      headers: { "content-type": "application/json" }
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.received).toBe(true);
  });
});
