"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { z } from "zod";
import { opsSchemas } from "@/lib/sdk/schemas";

const boardSchema = opsSchemas.board.response;

type Board = z.infer<typeof boardSchema> | null;

interface DispatchBoardProps {
  board: Board;
}

export function DispatchBoard({ board }: DispatchBoardProps) {
  const counts = useMemo(() => {
    return {
      unassigned: board?.unassigned.length ?? 0,
      active: board?.active.length ?? 0
    };
  }, [board]);

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Dispatch board</h2>
          <p className="text-sm text-slate-500">Drag bookings to available therapists (placeholder demo).</p>
        </div>
        <div className="flex gap-3 text-sm text-slate-500">
          <span className="rounded-full bg-amber-100 px-3 py-1">Unassigned {counts.unassigned}</span>
          <span className="rounded-full bg-emerald-100 px-3 py-1">Active {counts.active}</span>
        </div>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        <Column title="Unassigned" data={board?.unassigned ?? []} />
        <Column title="Active" data={board?.active ?? []} />
      </div>
    </section>
  );
}

interface ColumnProps {
  title: string;
  data: z.infer<typeof boardSchema>['unassigned'];
}

function Column({ title, data }: ColumnProps) {
  return (
    <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      {data.length === 0 ? (
        <p className="text-sm text-slate-400">Empty</p>
      ) : (
        <ul className="space-y-3">
          {data.map((booking) => (
            <li key={booking.id} className="space-y-2 rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-900">{booking.therapistName}</span>
                <span className="text-xs text-slate-500">{new Date(booking.start).toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-500">{booking.address}</p>
              <Button size="sm" variant="outline">
                Assign
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
