import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { VibhaWordmark } from "@/components/brand/vibha-logo";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Sign-in / set-up layout (the Linear / Notion pattern): a brand panel on the
 * left on laptops, one focused card on the right. On phones it's just the card.
 */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <aside className="relative hidden overflow-hidden border-r-2 border-foreground bg-brand p-10 text-brand-foreground lg:flex lg:flex-col lg:justify-between">
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1.3px,transparent_1.4px)] [background-size:22px_22px]" aria-hidden />
        <Link href="/go/home" className="relative flex items-center">
          <VibhaWordmark size={40} tone="lime" />
        </Link>
        <div className="relative space-y-6">
          <p className="text-display text-white">
            Don&apos;t just study psychology. <span className="text-primary">Practise it.</span>
          </p>
          <ul className="space-y-3 text-base font-semibold">
            {["Your lectures, picked up where you left off", "Practice tools built from real cases", "Weekend discussions with psychiatrists"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-primary" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm opacity-85">VIBHA School of Psychology · Ahmedabad</p>
      </aside>

      <main className="flex flex-col px-5 py-6 sm:px-8">
        <div className="flex items-center justify-between">
          <Link href="/go/home" className="flex items-center lg:invisible" aria-label="VIBHA home">
            <VibhaWordmark size={34} />
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-start justify-center pt-8 pb-10 sm:items-center sm:py-10">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-2">
              <h1 className="text-h1">{title}</h1>
              <p className="text-body text-muted-foreground">{subtitle}</p>
            </div>
            <div className="rounded-2xl border-2 border-foreground bg-card p-6 hard-shadow-md sm:p-7">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
