"use client";

import { useEffect, useState } from "react";
import { sdk } from "@/lib/sdk";
import { Button } from "@/components/ui/button";
import { DispatchBoard } from "@/components/admin/dispatch-board";
import { Reports } from "@/components/admin/reports";
import { TherapistApprovals } from "@/components/admin/therapist-approvals";
import type { z } from "zod";
import { opsSchemas } from "@/lib/sdk/schemas";

const boardSchema = opsSchemas.board.response;
const kpiSchema = opsSchemas.kpis.response;

type Board = z.infer<typeof boardSchema>;
type Kpis = z.infer<typeof kpiSchema>;

export function AdminDashboard() {
  const [board, setBoard] = useState<Board | null>(null);
  const [kpis, setKpis] = useState<Kpis | null>(null);

  useEffect(() => {
    sdk.ops.board().then(setBoard).catch(() => setBoard(null));
    sdk.ops.kpis().then(setKpis).catch(() => setKpis(null));
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Operations dashboard</h1>
          <p className="text-sm text-slate-500">Monitor bookings, assign therapists, and track service quality.</p>
        </div>
        <Button variant="outline" onClick={() => console.info("Export CSV requested")}>Export CSV</Button>
      </header>
      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <DispatchBoard board={board} />
        <Reports kpis={kpis} />
      </section>
      <TherapistApprovals />
    </main>
  );
}
