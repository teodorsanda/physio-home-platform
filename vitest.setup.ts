import "@testing-library/jest-dom";

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_stub";
