type LogLevel = "info" | "warn" | "error";

function maskString(value: string) {
  if (value.includes("@")) {
    const [local, domain] = value.split("@");
    const maskedLocal = local.length <= 2 ? "***" : `${local[0]}***${local.slice(-1)}`;
    return `${maskedLocal}@${domain}`;
  }

  const digits = value.replace(/\D/g, "");
  if (digits.length >= 6) {
    return value.replace(/\d(?=\d{2})/g, "*");
  }

  if (value.length > 6) {
    return `${value.slice(0, 3)}***${value.slice(-2)}`;
  }

  return value;
}

function sanitize(value: unknown): unknown {
  if (value == null) return value;
  if (typeof value === "string") {
    return maskString(value);
  }
  if (Array.isArray(value)) {
    return value.map((entry) => sanitize(entry));
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((acc, [key, val]) => {
      if (val == null) {
        acc[key] = val;
        return acc;
      }

      const lowered = key.toLowerCase();
      if (["email", "phone", "name", "address", "lat", "lng"].some((needle) => lowered.includes(needle))) {
        acc[key] = typeof val === "string" ? maskString(val) : "***";
        return acc;
      }

      acc[key] = sanitize(val);
      return acc;
    }, {});
  }

  return value;
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const payload = meta ? sanitize(meta) : undefined;
  if (payload) {
    console[level](message, payload);
  } else {
    console[level](message);
  }
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => log("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log("error", message, meta)
};

export { sanitize };
