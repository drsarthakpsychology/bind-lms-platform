import Link from "next/link";
import { BookOpen, GraduationCap, Lock, Play } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { readFlags } from "@/lib/flags";
import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRACTICE_TOOLS } from "@/lib/practice/tools";

/**
 * The student dashboard for a roster account: everything the programme has
 * made live or unlocked — the practice tools first, then the lectures. Each
 * practice tool is shown only when its feature flag is `live` (a locked "yet
 * to be live" card) or `unlocked` (fully open). Off tools are hidden entirely.
 *
 * Newly uploaded (published) lectures appear here with no redeploy: this reads
 * the live lessons table on every request.
 */
export default async function LecturesOnlyView() {
  const supabase = await createClient();
  const flags = await readFlags();

  // Everything the admin made live/unlocked, in one place. `live` tools show
  // a locked card; `unlocked` tools link straight through.
  const practiceTools = PRACTICE_TOOLS.filter(
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

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title")
    .eq("is_published", true);

  const courseIds = (courses ?? []).map((c) => c.id);
  const courseTitleById = new Map((courses ?? []).map((c) => [c.id, c.title]));

  const { data: lessons } = courseIds.length
    ? await supabase
        .from("lessons")
        .select("id, title, course_id, status, media_assets(duration_seconds)")
        .in("course_id", courseIds)
        .order("created_at", { ascending: false })
    : { data: [] as Array<{ id: string; title: string | null; course_id: string; status: "hidden" | "live" | "unlocked" | null; media_assets: Array<{ duration_seconds: number | null }> | null }> };

  const rows = (lessons ?? [])
    .filter((l) => l.status !== "hidden")
    .map((l) => ({
      id: l.id,
      title: l.title ?? "Untitled lecture",
      courseId: l.course_id,
      courseTitle: courseTitleById.get(l.course_id) ?? "",
      status: l.status,
      duration: Array.isArray(l.media_assets) && l.media_assets[0]?.duration_seconds
        ? Number(l.media_assets[0].duration_seconds)
        : null,
    }));

  function formatDuration(s: number | null): string {
    if (s == null || !Number.isFinite(s)) return "";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Everything the programme made live or unlocked — practice first. */}
      {practiceTools.length > 0 && (
        <section aria-label="Practice" className="space-y-3">
          <PageHeader
            title="Practice"
            description="The tools your programme has switched on for you."
          />
          <ul className="grid gap-2 sm:grid-cols-2">
            {practiceTools.map((t) =>
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
      )}

      <PageHeader
        title="Lectures"
        description="Your lectures, newest first. Tap one to watch."
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="size-6" aria-hidden />}
          title="No lectures yet"
          description="Your lectures will appear here once they're published."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((l) => {
            const locked = l.status === "live";
            return (
              <li key={l.id}>
                {locked ? (
                  <Card variant="flat" className="flex items-center gap-3 p-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Lock className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body font-semibold text-foreground [overflow-wrap:anywhere]">
                        {l.title}
                      </span>
                      {l.courseTitle && (
                        <span className="block truncate text-caption text-muted-foreground">
                          {l.courseTitle}
                        </span>
                      )}
                    </span>
                    <Badge variant="draft" className="shrink-0">
                      Yet to be live
                    </Badge>
                  </Card>
                ) : (
                  <Link href={`/courses/${l.courseId}/lessons/${l.id}`}>
                    <Card variant="interactive" className="flex items-center gap-3 p-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <Play className="size-5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-body font-semibold text-foreground [overflow-wrap:anywhere]">
                          {l.title}
                        </span>
                        {l.courseTitle && (
                          <span className="block truncate text-caption text-muted-foreground">
                            {l.courseTitle}
                          </span>
                        )}
                      </span>
                      {l.duration != null && (
                        <Badge variant="secondary" className="shrink-0">
                          {formatDuration(l.duration)}
                        </Badge>
                      )}
                    </Card>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
