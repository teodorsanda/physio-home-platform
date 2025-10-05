import { describe, expect, it } from "vitest";
import { bookingsSchemas } from "@/lib/sdk/schemas";

describe("bookings schema", () => {
  it("validates booking creation payload", () => {
    const payload = {
      patientId: "patient",
      addressId: "address",
      scheduledStart: new Date().toISOString(),
      therapistGenderPreference: "Any",
      paymentMethodId: "pm_123"
    };
    const result = bookingsSchemas.create.body.safeParse(payload);
    expect(result.success).toBe(true);
  });
});
