import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils/cn";
import { sanitize } from "@/lib/utils/logger";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });

  it("masks PII when sanitising for logs", () => {
    const payload = sanitize({
      email: "patient@example.com",
      phone: "+40123456789",
      address: "Strada Exemplu 99",
      nested: { contactName: "Jane Doe" }
    }) as any;

    expect(payload.email).toContain("***");
    expect(payload.phone.endsWith("89")).toBe(true);
    expect(payload.address).toContain("***");
    expect(payload.nested.contactName).toContain("***");
  });
});
