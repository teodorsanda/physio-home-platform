"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface LocationPayload {
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  etaMinutes?: number;
}

let socket: Socket | null = null;

function getSocket() {
  if (!socket) {
    const url = process.env.NEXT_PUBLIC_REALTIME_URL || typeof window === "undefined" ? "" : window.location.origin;
    socket = io(url, {
      path: "/api/socket",
      transports: ["websocket"],
      autoConnect: true
    });
  }
  return socket;
}

export function useRealtimeLocation() {
  const [latestLocation, setLatestLocation] = useState<LocationPayload | null>(null);

  useEffect(() => {
    const instance = getSocket();
    const handler = (payload: LocationPayload) => {
      setLatestLocation(payload);
    };
    instance.on("therapist-location", handler);
    return () => {
      instance.off("therapist-location", handler);
    };
  }, []);

  return { latestLocation };
}
