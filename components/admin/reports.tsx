import type { z } from "zod";
import { opsSchemas } from "@/lib/sdk/schemas";

const kpiSchema = opsSchemas.kpis.response;

type Kpis = z.infer<typeof kpiSchema> | null;

interface ReportsProps {
  kpis: Kpis;
}

export function Reports({ kpis }: ReportsProps) {
  const items = [
    { label: "Conversion", value: kpis?.conversionRate ?? 0, suffix: "%" },
    { label: "On-time arrival", value: kpis?.onTimeArrivalRate ?? 0, suffix: "%" },
    { label: "No-show", value: kpis?.noShowRate ?? 0, suffix: "%" },
    { label: "Utilization", value: kpis?.utilization ?? 0, suffix: "%" },
    { label: "NPS", value: kpis?.nps ?? 0, suffix: "" }
  ];

  return (
    <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">Analytics</h2>
        <p className="text-sm text-slate-500">Realtime metrics aggregated from bookings and surveys.</p>
      </header>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <span className="text-sm text-slate-500">{item.label}</span>
            <span className="text-lg font-semibold text-slate-900">
              {item.value.toFixed(1)} {item.suffix}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
