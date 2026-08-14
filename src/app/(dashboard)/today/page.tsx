import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { WeakSpotsBanner } from "@/components/practice/weak-spots-banner";
import { Reveal } from "@/components/motion/reveal";
import { ArrowRight, Zap, Mic2, Flame, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * /today — the front door (v5.1 Part B). One primary card (the single next
 * thing, with a reason), two chips (quick / deep), and a streak line.
 * Everything else lives behind "All practice".
 */
export default async function TodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Streak + unfinished session + in-progress chain (parallel).
  const [{ data: streak }, { data: activeSession }, { data: chains }] = await Promise.all([
    supabase
      .from("streaks")
      .select("current_streak")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("sim_sessions")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(1)
      .maybeSingle(),
    supabase
      .from("practice_chains")
      .select("id, case_id, steps")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(3),
  ]);

  // Course "Continue learning" — mirror the dashboard's continue logic so a
  // student mid-course sees their course next-step here too (T28), always
  // subservient to the practice primary card above.
  const [{ data: courses }, { data: courseLessons }, { data: courseProgress }] =
    await Promise.all([
      supabase.from("courses").select("id, title").eq("is_published", true),
      supabase
        .from("lessons")
        .select("id, course_id, order_index, video_storage_path, description, title"),
      supabase
        .from("progress")
        .select("lesson_id, is_completed, watched_seconds")
        .eq("user_id", user.id),
    ]);

  const progressByLesson = new Map(
    (courseProgress ?? []).map((p) => [p.lesson_id, p]),
  );
  const lessonsByCourse = new Map<
    string,
    Array<{
      id: string;
      order_index: number;
      video_storage_path: string | null;
      description: string | null;
      title: string | null;
    }>
  >();
  for (const l of courseLessons ?? []) {
    const list = lessonsByCourse.get(l.course_id) ?? [];
    list.push(l);
    lessonsByCourse.set(l.course_id, list);
  }

  let courseContinue: {
    href: string;
    courseTitle: string;
    nextTitle: string | null;
    done: number;
    total: number;
  } | null = null;
  const sortedCourses = (courses ?? [])
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));
  for (const c of sortedCourses) {
    const cl = (lessonsByCourse.get(c.id) ?? []).sort(
      (a, b) => a.order_index - b.order_index,
    );
    const playable = cl.filter((l) => l.video_storage_path || l.description);
    const completed = playable.filter((l) => progressByLesson.get(l.id)?.is_completed);
    const started = playable.filter((l) => {
      const p = progressByLesson.get(l.id);
      return p && (p.is_completed || (p.watched_seconds ?? 0) > 0);
    });
    if (started.length > 0 && completed.length < playable.length) {
      const next = playable.find((l) => !progressByLesson.get(l.id)?.is_completed);
      courseContinue = {
        href: next ? `/courses/${c.id}/lessons/${next.id}` : `/courses/${c.id}`,
        courseTitle: c.title,
        nextTitle: next?.title ?? null,
        done: completed.length,
        total: playable.length,
      };
      break;
    }
  }

  // The most recent chain with a pending next step (casebook "the chain").
  const SURFACE_LABEL: Record<string, string> = {
    consulting_room: "Consulting Room",
    formulation: "Formulation Forge",
    mse: "MSE Trainer",
    rounds: "Rounds",
    follow_up: "Follow-up visit",
  };
  let chainNext: { href: string; label: string; caseTitle: string; done: number; total: number } | null = null;
  const chainRows = (chains ?? []) as Array<{ id: string; case_id: string; steps: Array<{ surface: string; status: string }> }>;
  for (const c of chainRows) {
    const steps = Array.isArray(c.steps) ? c.steps : [];
    const done = steps.filter((s) => s.status === "complete").length;
    const next = steps.find((s) => s.status !== "complete");
    if (next) {
      const { data: simCase } = await supabase.from("sim_cases").select("title").eq("id", c.case_id).maybeSingle();
      const title = (simCase?.title as string | undefined) ?? "your patient";
      const shortName = title.split("—")[0].trim().replace(/^(.+?),.*$/, "$1");
      chainNext = {
        // Known surfaces link to their tool; anything unknown (or a
        // consulting_room step that's still pending) falls back to the hub —
        // never to a session URL built from the chain row id (a broken link).
        href: next.surface === "formulation" ? "/practice/formulation" : next.surface === "mse" ? "/practice/mse" : next.surface === "rounds" ? "/practice/rounds" : next.surface === "follow_up" ? "/practice/consulting-room" : "/practice/consulting-room",
        label: SURFACE_LABEL[next.surface] ?? next.surface,
        caseTitle: shortName || title,
        done,
        total: steps.length,
      };
      break;
    }
  }

  const currentStreak = Number(streak?.current_streak ?? 0);

  const primary = activeSession
    ? {
        href: `/practice/consulting-room/session/${activeSession.id}`,
        title: "Resume your session",
        reason: "You have an unfinished consultation with a patient who's waiting.",
        badge: "In progress",
        time: "12 min",
        cta: "Resume",
      }
    : {
        href: "/practice/decode",
        title: "Presenting Complaint Decoder",
        reason: currentStreak >= 2
          ? "You're on a streak — keep the daily habit sharp."
          : "Start the day with the drill that changes how you hear patients.",
        badge: "Daily",
        time: "4 min",
        cta: "Decode",
      };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Reveal delay={0.05}>
        <p className="text-eyebrow text-muted-foreground">Today</p>
        <h1 className="mt-1 text-h1">
          {currentStreak > 0 ? `${currentStreak}-day streak. ` : ""}One thing next.
        </h1>
      </Reveal>

      {/* streak line */}
      <Reveal delay={0.1}>
        <p className="mt-1 flex items-center gap-1.5 text-small text-muted-foreground">
          <Flame className="size-4 text-link" aria-hidden />
          {currentStreak > 0
            ? `${currentStreak} days in a row — the practice is compounding.`
            : "Every day you practise, a future client is better served."}
        </p>
      </Reveal>

      {/* The primary action is the first attention surface. Weak-spots + the
          chain come AFTER it so a returning student answers "what do I do
          now?" before seeing the gaps (T87 / "one thing next"). */}
      <Reveal delay={0.15}>
      <Link
        href={primary.href}
        className="mt-6 block rounded-lg border-2 border-border bg-card p-6 hard-shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-px"
      >
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-primary px-2 py-0.5 text-caption font-semibold text-primary-foreground">
            {primary.badge}
          </span>
          <span className="text-caption text-muted-foreground">{primary.time}</span>
        </div>
        <p className="mt-3 text-h3 font-semibold">{primary.title}</p>
        <p className="mt-1 text-small text-muted-foreground">{primary.reason}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-small font-medium text-link">
          {primary.cta} <ArrowRight className="size-4" aria-hidden />
        </span>
      </Link>
      </Reveal>

      {/* Course continue — subservient to the practice primary card, so a
          student mid-course still sees their course next-step (T28). */}
      {courseContinue ? (
        <Reveal delay={0.18}>
          <Link
            href={courseContinue.href}
            className="mt-4 flex items-center justify-between gap-3 rounded-lg border-2 border-border bg-card p-4 transition-transform hover:-translate-y-0.5 active:translate-y-px"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-border bg-secondary text-link">
                <BookOpen className="size-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-small font-semibold text-foreground">
                  Continue learning
                </span>
                <span className="block truncate text-caption text-muted-foreground">
                  {courseContinue.courseTitle} · {courseContinue.done} of {courseContinue.total} done
                  {courseContinue.nextTitle ? ` · next: ${courseContinue.nextTitle}` : ""}
                </span>
              </span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-link" aria-hidden />
          </Link>
        </Reveal>
      ) : null}

      {/* in-progress chain — a patient's arc continues (casebook "the chain") */}
      <Reveal delay={0.2}>
      {chainNext ? (
        <Link
          href={chainNext.href}
          className={cn(
            "mt-4 flex items-center justify-between gap-3 rounded-lg border-2 p-4 transition-transform hover:-translate-y-0.5 active:translate-y-px",
            // One prominent "continue" action at a time. When the primary card
            // is "Resume your session" (an active session exists), the chain's
            // resume intent yields to it and the card goes quiet. Otherwise
            // the chain IS the continuation action and keeps the highlight.
            activeSession ? "border-border bg-card" : "border-primary bg-primary/5"
          )}
        >
          <span className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-md border-2 text-sm font-black",
                activeSession
                  ? "border-border bg-secondary text-link"
                  : "border-primary bg-primary text-primary-foreground"
              )}
            >
              {chainNext.done + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-small font-semibold text-foreground">
                Continue with {chainNext.caseTitle}
              </span>
              <span className="block text-caption text-muted-foreground">
                {chainNext.done} of {chainNext.total} done · next: {chainNext.label}
              </span>
            </span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-link" aria-hidden />
        </Link>
      ) : null}
      </Reveal>

      {/* weak-spots banner — real gaps, AFTER the one action so it doesn't compete. */}
      <Reveal delay={0.2}>
        <div className="mt-4">
          <WeakSpotsBanner />
        </div>
      </Reveal>

      {/* quick / deep chips */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Reveal delay={0.25} className="h-full">
        <Link
          href="/practice/two-minute-clinic"
          className="flex h-full items-center gap-3 rounded-lg border-2 border-border bg-card p-4 transition-transform hover:-translate-y-0.5 active:translate-y-px"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-border bg-secondary text-link">
            <Zap className="size-4" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-small font-semibold">Something quick</span>
            <span className="block truncate text-caption text-muted-foreground">Two-Minute Clinic · 2 min</span>
          </span>
        </Link>
        </Reveal>
        <Reveal delay={0.3} className="h-full">
        <Link
          href="/practice/consulting-room"
          className="flex h-full items-center gap-3 rounded-lg border-2 border-border bg-card p-4 transition-transform hover:-translate-y-0.5 active:translate-y-px"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-border bg-secondary text-link">
            <Mic2 className="size-4" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-small font-semibold">Something deep</span>
            <span className="block truncate text-caption text-muted-foreground">Consulting Room · 12 min</span>
          </span>
        </Link>
        </Reveal>
      </div>

      <Link
        href="/practice"
        className="mt-6 inline-flex items-center gap-1 text-small font-medium text-link hover:underline"
      >
        All practice tools <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </div>
  );
}
