import Link from "next/link";
import { ArrowRight, Compass, Gamepad2, Repeat2, Zap, type LucideIcon } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getFeatureStatus } from "@/lib/flags";
import { loadTodaySuggestion } from "@/lib/learn/model/server";

/**
 * TodaySuggestion: an optional "what to do today" card (owner decision 43).
 * Due reviews + the weakest skill + one game. Renders nothing for staff, when
 * Learn is off, or when there's nothing to suggest. Server component: drop
 * <TodaySuggestion /> on any page.
 */
export async function TodaySuggestion({ className }: { className?: string }) {
  const session = await getSession();
  if (session.status !== "ok" || (session.profile.role !== "student" && session.profile.role !== "alumni")) return null;
  if ((await getFeatureStatus("learn")) !== "unlocked") return null;
  const s = await loadTodaySuggestion(session.profile.id);

  const rows: { href: string; icon: LucideIcon; title: string; sub: string }[] = [];
  if (!s.placed && !s.weak) rows.push({ href: "/study/placement", icon: Compass, title: "Take the placement quiz", sub: "18 questions to set your level" });
  if (s.due) rows.push({ href: "/study/map/practice", icon: Repeat2, title: `${s.due} ${s.due === 1 ? "review" : "reviews"} due`, sub: "A mixed round brings them back" });
  if (s.weak) rows.push({ href: s.weak.practiceHref, icon: Zap, title: `Fix: ${s.weak.label}`, sub: "A short quiz on your weakest spot" });
  rows.push({ href: "/prep/smart", icon: Gamepad2, title: "Smart practice", sub: "10 questions from your weak topics" });

  return (
    <section aria-labelledby="today-suggestion" className={className}>
      <h2 id="today-suggestion" className="text-h3">
        Suggested for today
      </h2>
      <ul className="mt-3 space-y-2">
        {rows.map((r) => (
          <li key={r.href}>
            <Link
              href={r.href}
              className="flex min-h-11 items-center gap-3 rounded-md border-2 border-foreground bg-card p-3 transition-transform hover:-translate-y-0.5 hover:hard-shadow-sm motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <r.icon className="size-5 shrink-0" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{r.title}</span>
                <span className="block text-sm text-muted-foreground">{r.sub}</span>
              </span>
              <ArrowRight className="size-4 shrink-0" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
