"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { sdk } from "@/lib/sdk";
import { MapPreview } from "@/components/therapist/map-preview";
import type { z } from "zod";
import { therapistSchemas } from "@/lib/sdk/schemas";

const scheduleResponse = therapistSchemas.schedule.response;

type Schedule = z.infer<typeof scheduleResponse>;

export function TherapistDashboard() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    sdk.therapist
      .getSchedule()
      .then(setSchedule)
      .catch(() => setSchedule(null));
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Therapist console</h1>
          <p className="text-sm text-slate-500">
            Confirm your route, share live location, and capture SOAP notes securely.
          </p>
        </div>
        <Button onClick={() => sdk.therapist.updateAvailability({ availability: [] })} variant="outline">
          Update availability
        </Button>
      </header>
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming visits</h2>
          <ul className="space-y-3 text-sm text-slate-500">
            {schedule?.upcomingBookings?.length ? (
              schedule.upcomingBookings.map((booking) => (
                <li key={booking.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">{booking.therapistName}</p>
                  <p>{new Date(booking.start).toLocaleString()}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        sdk.therapist.startRoute(booking.id, {
                          location: { lat: 44.4268, lng: 26.1025 },
                          heading: 180,
                          speed: 32
                        })
                      }
                    >
                      Start route
                    </Button>
                    <Button size="sm" variant="outline">
                      Open SOAP note
                    </Button>
                  </div>
                </li>
              ))
            ) : (
              <li>No bookings assigned.</li>
            )}
          </ul>
        </div>
        <MapPreview />
      </section>
    </main>
  );
}
