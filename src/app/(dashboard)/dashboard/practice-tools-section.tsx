import Link from "next/link";
import { GraduationCap, Lock } from "lucide-react";
import { readFlags } from "@/lib/flags";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRACTICE_TOOLS } from "@/lib/practice/tools";

/**
 * The practice strip for the roster dashboard: everything the programme made
 * live or unlocked, so the student home isn't lecture-only. `live` tools show
 * a locked "yet to be live" card; `unlocked` tools link straight through; off
 * tools are hidden entirely. Reads the flags table on every request, so a
 * toggle in /admin/flags shows up here with no redeploy.
 */
export async function PracticeToolsSection() {
  const flags = await readFlags();

  const tools = PRACTICE_TOOLS.filter(
    (t) => flags[t.flag] === "live" || flags[t.flag] === "unlocked",
  ).map((t) => ({
    title: t.title,
    description: t.description,
    time: t.time,
    locked: flags[t.flag] === "live",
    href:
      flags[t.flag] === "live"
        ? `/practice/not-available?feature=${encodeURIComponent(t.flag)}&state=live`
        : t.href,
  }));

  if (tools.length === 0) return null;

  return (
    <section aria-label="Practice" className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-eyebrow text-link">Practice</p>
          <h2 className="text-h1">Try it yourself</h2>
        </div>
        <Link href="/practice" className="inline-flex min-h-11 shrink-0 items-center text-sm font-bold text-link underline-offset-4 hover:underline">
          See all
        </Link>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((t) =>
          t.locked ? (
            <li key={t.title} className="min-w-0">
              <Card variant="flat" className="flex h-full flex-row items-center gap-3 p-4 opacity-70">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-foreground/40 bg-muted text-muted-foreground">
                  <Lock className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body font-semibold text-foreground [overflow-wrap:anywhere]">
                    {t.title}
                  </span>
                  <span className="block truncate text-caption text-muted-foreground">
                    {t.description}
                  </span>
                </span>
                <Badge variant="draft" className="shrink-0">
                  Yet to be live
                </Badge>
              </Card>
            </li>
          ) : (
            <li key={t.title} className="min-w-0">
              <Link href={t.href} className="block h-full">
                <Card variant="interactive" className="flex h-full flex-row items-center gap-3 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border-2 border-foreground bg-primary text-primary-foreground">
                    <GraduationCap className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-body font-semibold text-foreground [overflow-wrap:anywhere]">
                      {t.title}
                    </span>
                    <span className="block truncate text-caption text-muted-foreground">
                      {t.description}
                    </span>
                  </span>
                  {t.time && (
                    <Badge variant="secondary" className="shrink-0">
                      {t.time}
                    </Badge>
                  )}
                </Card>
              </Link>
            </li>
          ),
        )}
      </ul>
    </section>
  );
}
