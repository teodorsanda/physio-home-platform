export type BookingStatus =
  | "Pending"
  | "Assigned"
  | "EnRoute"
  | "InProgress"
  | "Completed"
  | "Cancelled"
  | "NoShow";

export type GenderPreference = "Male" | "Female" | "Any";

export type BookingSummary = {
  id: string;
  therapistName: string;
  start: string;
  address: string;
  status: BookingStatus;
};

export type PatientDocument = {
  id: string;
  type: string;
  uploadedAt: string;
  secureUrl: string;
};

export type PatientSummary = {
  id: string;
  fullName: string;
  upcomingBookings: BookingSummary[];
  pastBookings: BookingSummary[];
  documents: PatientDocument[];
  openTickets: number;
};
