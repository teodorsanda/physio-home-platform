"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { useRealtimeLocation } from "@/lib/realtime/use-realtime-location";

export function MapPreview() {
  const { latestLocation } = useRealtimeLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex min-h-[320px] flex-col justify-between rounded-3xl border border-slate-200 bg-gradient-to-br from-brand/10 via-slate-50 to-white p-6 shadow-sm">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">Live route</h2>
        <p className="text-sm text-slate-500">Broadcast every 5–10 seconds. Uses Socket.IO over secure channel.</p>
      </header>
      <div className="flex flex-1 items-center justify-center">
        {!ready ? (
          <Loader2 className="h-10 w-10 animate-spin text-brand" />
        ) : (
          <div className="space-y-2 text-center">
            <MapPin className="mx-auto h-10 w-10 text-brand" />
            <p className="text-sm text-slate-600">
              {latestLocation
                ? `Lat ${latestLocation.lat.toFixed(4)}, Lng ${latestLocation.lng.toFixed(4)} · ETA ${latestLocation.etaMinutes ?? "--"}`
                : "Waiting for signal"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
