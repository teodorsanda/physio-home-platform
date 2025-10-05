import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChatbotWidget } from "@/components/marketing/chatbot-widget";

export default function MarketingPage() {
  return (
    <main className="flex-1 bg-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20 md:flex-row md:items-center">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1 text-sm font-semibold text-brand">
            Kinetix HomeCare
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Physiotherapy that comes to your home
          </h1>
          <p className="max-w-xl text-lg text-slate-600">
            We match you with vetted physiotherapists, coordinate travel, digitize documents, and deliver progress tracking
            so that your recovery fits your routine.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link href="/patient">Book a home visit</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/patient/help">Talk to our team</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-6 rounded-2xl bg-slate-50 p-6 shadow-sm">
            {[
              { label: "Cities served", value: "3" },
              { label: "Therapists vetted", value: "120" },
              { label: "Average NPS", value: "71" },
              { label: "Minutes to match", value: "< 20" }
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-semibold text-brand-dark">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">Patient journey</p>
            <ol className="mt-6 space-y-4 text-slate-600">
              <li>
                <span className="font-semibold text-slate-900">1.</span> Answer guided onboarding questions and upload your referral
                securely.
              </li>
              <li>
                <span className="font-semibold text-slate-900">2.</span> Choose preferred date, time, therapist gender, and pay via
                card or Apple/Google Pay.
              </li>
              <li>
                <span className="font-semibold text-slate-900">3.</span> Track your therapist in realtime, confirm arrival, and
                receive a digital report.
              </li>
            </ol>
          </div>
          <ChatbotWidget />
        </div>
      </section>
    </main>
  );
}
