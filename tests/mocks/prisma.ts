import { vi } from "vitest";

type MockFn = ReturnType<typeof vi.fn>;

type ModelMock = Record<string, MockFn>;

export const mockPrisma = {
  user: {
    create: vi.fn(),
    findUnique: vi.fn()
  },
  patient: {
    findFirst: vi.fn(),
    update: vi.fn(),
    findUnique: vi.fn()
  },
  booking: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn()
  },
  auditLog: {
    create: vi.fn()
  },
  checkIn: {
    create: vi.fn()
  },
  payment: {
    create: vi.fn()
  }
} as const satisfies Record<string, ModelMock>;

export function resetMockPrisma() {
  Object.values(mockPrisma).forEach((model) => {
    Object.values(model).forEach((fn) => fn.mockReset());
  });
}
