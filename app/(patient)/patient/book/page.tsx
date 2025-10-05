import { BookingForm } from "@/components/patient/booking-form";

export default function BookingPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">Book a home visit</h1>
      <p className="mt-2 text-sm text-slate-500">
        Complete the qualification questions and pick a timeslot. You can choose therapist gender preference and add coupons.
      </p>
      <BookingForm />
    </main>
  );
}
