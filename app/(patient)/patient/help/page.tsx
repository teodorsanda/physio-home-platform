import Link from "next/link";
import { ChatbotWidget } from "@/components/marketing/chatbot-widget";
import { Button } from "@/components/ui/button";

export default function PatientHelpPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">Help center</h1>
      <p className="text-sm text-slate-500">
        Our concierge can help with scheduling, payments, and logistics. We do not provide medical diagnoses—contact your
        physician or emergency services if you have urgent symptoms.
      </p>
      <ChatbotWidget />
      <Button asChild variant="outline" className="self-start">
        <Link href="/patient/help/contact">Contact a human</Link>
      </Button>
    </main>
  );
}
