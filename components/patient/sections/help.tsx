import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HelpSectionProps {
  supportTicketCount: number;
}

export function HelpSection({ supportTicketCount }: HelpSectionProps) {
  return (
    <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">Need help?</h2>
        <p className="text-sm text-slate-500">
          The virtual assistant escalates red flags to our care coordinators. Never ignore urgent symptoms—call 112.
        </p>
      </header>
      <div className="rounded-2xl bg-slate-50 p-4">
        <p className="text-sm text-slate-600">Open support cases</p>
        <p className="text-3xl font-semibold text-brand">{supportTicketCount}</p>
      </div>
      <Button asChild className="w-full" variant="outline">
        <Link href="/patient/help">Help center</Link>
      </Button>
      <Button asChild className="w-full">
        <Link href="/patient/help/contact">Contact support</Link>
      </Button>
    </aside>
  );
}
