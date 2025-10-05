import { writeFileSync } from "fs";
import { join } from "path";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  authSchemas,
  patientSchemas,
  bookingsSchemas,
  therapistSchemas,
  paymentsSchemas,
  opsSchemas
} from "../lib/sdk/schemas";

const paths: Record<string, any> = {
  "/api/auth/register": {
    post: buildOperation("Register", authSchemas.register.body, authSchemas.register.response)
  },
  "/api/auth/login": {
    post: buildOperation("Login", authSchemas.login.body, authSchemas.login.response)
  },
  "/api/auth/otp/request": {
    post: buildOperation("Request OTP", authSchemas.requestOtp.body, authSchemas.requestOtp.response)
  },
  "/api/auth/otp/verify": {
    post: buildOperation("Verify OTP", authSchemas.verifyOtp.body, authSchemas.verifyOtp.response)
  },
  "/api/patient/me": {
    get: buildOperation("Get patient", undefined, patientSchemas.me.response),
    put: buildOperation("Update patient", patientSchemas.me.body, patientSchemas.me.response)
  },
  "/api/patient/documents": {
    post: buildOperation("Create document upload", undefined, patientSchemas.documents.response)
  },
  "/api/bookings": {
    post: buildOperation("Create booking", bookingsSchemas.create.body, bookingsSchemas.create.response)
  },
  "/api/bookings/{id}": {
    get: buildOperation("Get booking", undefined, bookingsSchemas.byId.response)
  },
  "/api/bookings/{id}/cancel": {
    patch: buildOperation("Cancel booking", bookingsSchemas.cancel.body, bookingsSchemas.cancel.response)
  },
  "/api/bookings/{id}/assign": {
    post: buildOperation("Assign booking", bookingsSchemas.assign.body, bookingsSchemas.assign.response)
  },
  "/api/bookings/{id}/checkin": {
    post: buildOperation("Check-in booking", bookingsSchemas.checkin.body, bookingsSchemas.checkin.response)
  },
  "/api/therapist/me/schedule": {
    get: buildOperation("Therapist schedule", undefined, therapistSchemas.schedule.response)
  },
  "/api/therapist/me/availability": {
    patch: buildOperation("Update availability", therapistSchemas.availability.body, therapistSchemas.availability.response)
  },
  "/api/therapist/route/{bookingId}/start": {
    post: buildOperation("Start route", therapistSchemas.route.body, therapistSchemas.route.response)
  },
  "/api/payments/intent": {
    post: buildOperation("Create payment intent", paymentsSchemas.intent.body, paymentsSchemas.intent.response)
  },
  "/api/ops/board": {
    get: buildOperation("Dispatch board", undefined, opsSchemas.board.response)
  },
  "/api/reports/kpis": {
    get: buildOperation("KPIs", undefined, opsSchemas.kpis.response)
  },
  "/api/therapists/verify": {
    post: buildOperation("Verify therapist", opsSchemas.verifyTherapist.body, opsSchemas.verifyTherapist.response)
  }
};

const spec = {
  openapi: "3.1.0",
  info: {
    title: "Kinetix HomeCare API",
    version: "0.1.0",
    description: "REST API for the home-visit physiotherapy platform"
  },
  servers: [{ url: "http://localhost:3000" }],
  paths
};

writeFileSync(join(process.cwd(), "openapi.json"), JSON.stringify(spec, null, 2));
console.info("OpenAPI spec generated");

function buildOperation(summary: string, body: any | undefined, response: any) {
  const operation: any = {
    summary,
    responses: {
      "200": {
        description: "Success",
        content: {
          "application/json": {
            schema: zodToJsonSchema(response)
          }
        }
      }
    }
  };
  if (body) {
    operation.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: zodToJsonSchema(body)
        }
      }
    };
  }
  return operation;
}
