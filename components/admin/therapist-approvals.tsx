"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sdk } from "@/lib/sdk";

const sampleTherapists = [
  { id: "therapist-1", name: "Andrei Pop", documents: ["License", "Identity"] },
  { id: "therapist-2", name: "Ioana Marinescu", documents: ["Malpractice", "License"] }
];

export function TherapistApprovals() {
  const [queue, setQueue] = useState(sampleTherapists);

  const handleDecision = async (id: string, approved: boolean) => {
    await sdk.ops.verifyTherapist({ therapistId: id, approved });
    setQueue((current) => current.filter((t) => t.id !== id));
  };

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Therapist KYC</h2>
          <p className="text-sm text-slate-500">Review licensure documents and approve identity checks.</p>
        </div>
        <span className="text-sm text-slate-500">Queue {queue.length}</span>
      </header>
      <ul className="space-y-3">
        {queue.map((therapist) => (
          <li key={therapist.id} className="space-y-2 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{therapist.name}</p>
                <p className="text-xs text-slate-500">Documents: {therapist.documents.join(", ")}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleDecision(therapist.id, false)}>
                  Reject
                </Button>
                <Button size="sm" onClick={() => handleDecision(therapist.id, true)}>
                  Approve
                </Button>
              </div>
            </div>
          </li>
        ))}
        {queue.length === 0 && <li className="text-sm text-slate-400">No pending applications.</li>}
      </ul>
    </section>
  );
}
