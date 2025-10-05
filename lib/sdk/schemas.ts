import { z } from "zod";

const bookingStatus = z.enum([
  "Pending",
  "Assigned",
  "EnRoute",
  "InProgress",
  "Completed",
  "Cancelled",
  "NoShow"
]);

const genderPreference = z.enum(["Male", "Female", "Any"]);

const geoPoint = z.object({ lat: z.number(), lng: z.number() });

const patientDocument = z.object({
  id: z.string(),
  type: z.string(),
  uploadedAt: z.string(),
  secureUrl: z.string().url()
});

const bookingSummary = z.object({
  id: z.string(),
  therapistName: z.string(),
  start: z.string(),
  address: z.string(),
  status: bookingStatus
});

export const authSchemas = {
  register: {
    body: z.object({ email: z.string().email(), password: z.string().min(8), fullName: z.string() }),
    response: z.object({ id: z.string(), email: z.string().email() })
  },
  login: {
    body: z.object({ email: z.string().email(), password: z.string().min(8) }),
    response: z.object({ token: z.string(), expiresIn: z.number() })
  },
  requestOtp: {
    body: z.object({ phone: z.string().min(8) }),
    response: z.object({ success: z.boolean(), expiresAt: z.string() })
  },
  verifyOtp: {
    body: z.object({ phone: z.string(), code: z.string().length(6) }),
    response: z.object({ success: z.boolean(), sessionId: z.string() })
  }
};

export const patientSchemas = {
  me: {
    response: z.object({
      id: z.string(),
      fullName: z.string(),
      phone: z.string().nullish(),
      openTickets: z.number(),
      upcomingBookings: z.array(bookingSummary),
      pastBookings: z.array(bookingSummary),
      documents: z.array(patientDocument)
    }),
    body: z.object({
      fullName: z.string().min(3),
      phone: z.string().optional(),
      qualificationAnswers: z.array(z.object({ questionId: z.string(), answer: z.string() })).optional()
    })
  },
  documents: {
    response: z.object({ url: z.string().url(), fields: z.record(z.string()) })
  }
};

export const bookingsSchemas = {
  create: {
    body: z.object({
      patientId: z.string(),
      addressId: z.string(),
      scheduledStart: z.string(),
      therapistGenderPreference: genderPreference,
      notes: z.string().max(500).optional(),
      paymentMethodId: z.string(),
      couponCode: z.string().optional()
    }),
    response: bookingSummary.extend({ paymentIntentClientSecret: z.string().optional() })
  },
  byId: {
    response: bookingSummary.extend({
      patient: z.object({ id: z.string(), fullName: z.string() }),
      therapist: z.object({ id: z.string(), fullName: z.string() }).nullish(),
      location: geoPoint.nullish(),
      etaMinutes: z.number().nullish(),
      otpCode: z.string().optional()
    })
  },
  cancel: {
    body: z.object({ reason: z.string().min(3) }),
    response: z.object({ success: z.boolean(), status: bookingStatus })
  },
  assign: {
    body: z.object({ therapistId: z.string() }),
    response: z.object({ success: z.boolean(), status: bookingStatus })
  },
  checkin: {
    body: z.object({ method: z.enum(["PatientApp", "QR", "OTP"]), confirmationCode: z.string().optional() }),
    response: z.object({ success: z.boolean(), confirmedBy: z.enum(["Patient", "Therapist"]), timestamp: z.string() })
  }
};

export const therapistSchemas = {
  schedule: {
    response: z.object({
      therapistId: z.string(),
      availability: z.array(
        z.object({
          dayOfWeek: z.number().min(0).max(6),
          slots: z.array(z.object({ start: z.string(), end: z.string() }))
        })
      ),
      upcomingBookings: z.array(bookingSummary)
    })
  },
  availability: {
    body: z.object({
      availability: z.array(
        z.object({
          dayOfWeek: z.number().min(0).max(6),
          slots: z.array(z.object({ start: z.string(), end: z.string() }))
        })
      )
    }),
    response: z.object({ success: z.boolean() })
  },
  route: {
    body: z.object({ location: geoPoint, heading: z.number().optional(), speed: z.number().optional() }),
    response: z.object({ success: z.boolean(), etaMinutes: z.number().optional() })
  }
};

export const paymentsSchemas = {
  intent: {
    body: z.object({
      bookingId: z.string(),
      currency: z.string().length(3),
      amount: z.number().positive(),
      paymentMethodType: z.enum(["card"])
    }),
    response: z.object({ clientSecret: z.string(), publishableKey: z.string() })
  }
};

export const opsSchemas = {
  board: {
    response: z.object({
      unassigned: z.array(bookingSummary),
      active: z.array(
        bookingSummary.extend({
          location: geoPoint.nullish(),
          therapistId: z.string().nullish(),
          patientId: z.string()
        })
      )
    })
  },
  kpis: {
    response: z.object({
      conversionRate: z.number(),
      onTimeArrivalRate: z.number(),
      noShowRate: z.number(),
      utilization: z.number(),
      nps: z.number()
    })
  },
  verifyTherapist: {
    body: z.object({ therapistId: z.string(), approved: z.boolean(), notes: z.string().optional() }),
    response: z.object({ success: z.boolean(), status: z.string() })
  }
};
