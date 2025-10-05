"use client";

import { useEffect, useState } from "react";
import { BookingList } from "@/components/patient/sections/bookings";
import { DocumentsSection } from "@/components/patient/sections/documents";
import { HelpSection } from "@/components/patient/sections/help";
import { getPatientSummary } from "@/lib/services/patient";
import type { PatientSummary } from "@/lib/types";

export function PatientDashboard() {
  const [summary, setSummary] = useState<PatientSummary | null>(null);

  useEffect(() => {
    getPatientSummary().then(setSummary).catch(() => setSummary(null));
  }, []);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-8">
        <BookingList upcoming={summary?.upcomingBookings ?? []} past={summary?.pastBookings ?? []} />
        <DocumentsSection documents={summary?.documents ?? []} />
      </div>
      <HelpSection supportTicketCount={summary?.openTickets ?? 0} />
    </div>
  );
}
