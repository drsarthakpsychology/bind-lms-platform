import Link from "next/link";
import { GraduationCap, Lock } from "lucide-react";
import { readFlags } from "@/lib/flags";
import { PageHeader } from "@/components/design-system/page-header";
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
      <PageHeader
        title="Practice"
        description="The tools your programme has switched on for you."
      />
      <ul className="grid gap-2 sm:grid-cols-2">
        {tools.map((t) =>
          t.locked ? (
            <li key={t.title}>
              <Card variant="flat" className="flex h-full items-center gap-3 p-4 opacity-70">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
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
            <li key={t.title}>
              <Link href={t.href} className="block h-full">
                <Card variant="interactive" className="flex h-full items-center gap-3 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
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
