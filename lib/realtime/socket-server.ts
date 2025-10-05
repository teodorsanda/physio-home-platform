import { Server as IOServer } from "socket.io";

let io: IOServer | null = null;

export function setSocketServer(server: IOServer) {
  io = server;
}

interface TherapistLocation {
  bookingId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  etaMinutes?: number;
}

export async function emitTherapistLocation(payload: TherapistLocation) {
  if (!io) {
    console.warn("Socket server not initialised");
    return;
  }
  io.emit("therapist-location", payload);
}
