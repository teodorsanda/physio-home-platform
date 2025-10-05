import { z } from "zod";
import { bookingsSchemas, patientSchemas, therapistSchemas, authSchemas, paymentsSchemas, opsSchemas } from "./schemas";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    },
    ...init
  });
  if (!res.ok) {
    throw new Error(`Request failed ${res.status}`);
  }
  return (await res.json()) as T;
}

export const sdk = {
  auth: {
    register: (body: z.infer<typeof authSchemas.register.body>) =>
      request<z.infer<typeof authSchemas.register.response>>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(body)
      }),
    login: (body: z.infer<typeof authSchemas.login.body>) =>
      request<z.infer<typeof authSchemas.login.response>>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body)
      }),
    requestOtp: (body: z.infer<typeof authSchemas.requestOtp.body>) =>
      request<z.infer<typeof authSchemas.requestOtp.response>>("/api/auth/otp/request", {
        method: "POST",
        body: JSON.stringify(body)
      }),
    verifyOtp: (body: z.infer<typeof authSchemas.verifyOtp.body>) =>
      request<z.infer<typeof authSchemas.verifyOtp.response>>("/api/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify(body)
      })
  },
  patient: {
    getMe: () => request<z.infer<typeof patientSchemas.me.response>>("/api/patient/me", { method: "GET" }),
    updateMe: (body: z.infer<typeof patientSchemas.me.body>) =>
      request<z.infer<typeof patientSchemas.me.response>>("/api/patient/me", {
        method: "PUT",
        body: JSON.stringify(body)
      }),
    createDocumentUpload: () =>
      request<z.infer<typeof patientSchemas.documents.response>>("/api/patient/documents", {
        method: "POST"
      })
  },
  bookings: {
    create: (body: z.infer<typeof bookingsSchemas.create.body>) =>
      request<z.infer<typeof bookingsSchemas.create.response>>("/api/bookings", {
        method: "POST",
        body: JSON.stringify(body)
      }),
    getById: (id: string) => request<z.infer<typeof bookingsSchemas.byId.response>>(`/api/bookings/${id}`),
    cancel: (id: string, body: z.infer<typeof bookingsSchemas.cancel.body>) =>
      request<z.infer<typeof bookingsSchemas.cancel.response>>(`/api/bookings/${id}/cancel`, {
        method: "PATCH",
        body: JSON.stringify(body)
      }),
    assign: (id: string, body: z.infer<typeof bookingsSchemas.assign.body>) =>
      request<z.infer<typeof bookingsSchemas.assign.response>>(`/api/bookings/${id}/assign`, {
        method: "POST",
        body: JSON.stringify(body)
      }),
    checkIn: (id: string, body: z.infer<typeof bookingsSchemas.checkin.body>) =>
      request<z.infer<typeof bookingsSchemas.checkin.response>>(`/api/bookings/${id}/checkin`, {
        method: "POST",
        body: JSON.stringify(body)
      })
  },
  therapist: {
    getSchedule: () => request<z.infer<typeof therapistSchemas.schedule.response>>("/api/therapist/me/schedule"),
    updateAvailability: (body: z.infer<typeof therapistSchemas.availability.body>) =>
      request<z.infer<typeof therapistSchemas.availability.response>>("/api/therapist/me/availability", {
        method: "PATCH",
        body: JSON.stringify(body)
      }),
    startRoute: (bookingId: string, body: z.infer<typeof therapistSchemas.route.body>) =>
      request<z.infer<typeof therapistSchemas.route.response>>(`/api/therapist/route/${bookingId}/start`, {
        method: "POST",
        body: JSON.stringify(body)
      })
  },
  payments: {
    createIntent: (body: z.infer<typeof paymentsSchemas.intent.body>) =>
      request<z.infer<typeof paymentsSchemas.intent.response>>("/api/payments/intent", {
        method: "POST",
        body: JSON.stringify(body)
      })
  },
  ops: {
    board: () => request<z.infer<typeof opsSchemas.board.response>>("/api/ops/board"),
    kpis: () => request<z.infer<typeof opsSchemas.kpis.response>>("/api/reports/kpis"),
    verifyTherapist: (body: z.infer<typeof opsSchemas.verifyTherapist.body>) =>
      request<z.infer<typeof opsSchemas.verifyTherapist.response>>("/api/therapists/verify", {
        method: "POST",
        body: JSON.stringify(body)
      })
  }
};

export type SDK = typeof sdk;
