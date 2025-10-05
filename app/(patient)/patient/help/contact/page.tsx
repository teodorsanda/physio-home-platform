import { ContactForm } from "@/components/patient/contact-form";

export default function PatientContactPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">Contact support</h1>
      <p className="mt-2 text-sm text-slate-500">
        Share details about your visit or upcoming booking. Our care coordinators respond within 2 business hours.
      </p>
      <ContactForm />
    </main>
  );
}
