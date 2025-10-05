"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { BookingSummary } from "@/lib/types";
import { format } from "date-fns";

interface BookingListProps {
  upcoming: BookingSummary[];
  past: BookingSummary[];
}

export function BookingList({ upcoming, past }: BookingListProps) {
  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Bookings</h2>
          <p className="text-sm text-slate-500">Realtime updates once your therapist starts travelling.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/patient/book">New booking</Link>
        </Button>
      </header>
      <div className="space-y-4">
        <Section title="Upcoming" emptyText="No visits booked yet." bookings={upcoming} />
        <Section title="Past" emptyText="No sessions completed yet." bookings={past} />
      </div>
    </section>
  );
}

function Section({ title, emptyText, bookings }: { title: string; emptyText: string; bookings: BookingSummary[] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      {bookings.length === 0 ? (
        <p className="text-sm text-slate-400">{emptyText}</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((booking) => (
            <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{booking.therapistName}</p>
                <p className="text-xs text-slate-500">
                  {format(new Date(booking.start), "PPP p")} • {booking.address}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">{booking.status}</span>
                <Link href={`/patient/bookings/${booking.id}`} className="text-brand underline">
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
