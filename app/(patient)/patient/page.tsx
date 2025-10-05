import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PatientDashboard } from "@/components/patient/dashboard";

export const metadata = {
  title: "Patient portal | Kinetix HomeCare"
};

export default function PatientPage() {
  return (
    <main className="flex-1">
      <div className="border-b bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Patient portal</h1>
            <p className="text-sm text-slate-500">
              Complete onboarding, manage bookings, and securely access your documentation.
            </p>
          </div>
          <Button asChild>
            <Link href="/patient/book">Book a session</Link>
          </Button>
        </div>
      </div>
      <PatientDashboard />
    </main>
  );
}
