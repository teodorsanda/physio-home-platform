import { sdk } from "@/lib/sdk";
import { PatientSummary } from "@/lib/types";

export async function getPatientSummary(): Promise<PatientSummary> {
  const response = await sdk.patient.getMe();
  return {
    id: response.id,
    fullName: response.fullName,
    upcomingBookings: response.upcomingBookings,
    pastBookings: response.pastBookings,
    documents: response.documents,
    openTickets: response.openTickets
  };
}
