import Link from "next/link";
import { readFlags } from "@/lib/flags";
import { createClient } from "@/lib/supabase/server";
import { computePracticeStates, type SurfaceState } from "@/lib/practice/practice-state";
import { lastPracticePlace } from "@/lib/practice/resume";
import { ArrowRight, Pill, RotateCcw } from "lucide-react";
import { MEDS } from "@/lib/meds";
import { PracticeKeyboardNav } from "@/components/practice/keyboard-nav";
import { WeakSpotsBanner } from "@/components/practice/weak-spots-banner";
import { type PracticeCardData } from "@/components/practice/practice-groups";
import { PracticeList } from "@/components/practice/practice-list";
import { Reveal } from "@/components/motion/reveal";
import { PRACTICE_TOOLS } from "@/lib/practice/tools";

/**
 * /practice — the deliberate browse view (v5.1 Part B).
 * Grouped by session length (casebook Axis 5), collapsible, open state
 * remembered per user. Every card shows a state chip, a time badge and a
 * progress line — all honest (computed from real data, blank when none).
 * Eyebrow labels are one-word interaction verbs; no two features share an
 * icon. Cards are gated by feature flags.
 */

export default async function PracticeHubPage() {
  const flags = await readFlags();

  // Three-state flags (A2): "off" tools are hidden entirely; "live" tools show
  // a locked "yet to be live" card so students know the section exists;
  // "unlocked" tools are fully live. Grouping + ordering are preserved.
  const visible = PRACTICE_TOOLS.flatMap((t) => {
    const status = flags[t.flag];
    if (status !== "live" && status !== "unlocked") return [];
    const locked = status === "live";
    return [
      {
        ...t,
        locked,
        href: locked
          ? `/practice/not-available?feature=${encodeURIComponent(t.flag)}&state=live`
          : t.href,
      },
    ];
  });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Honest per-surface state from the user's real activity (Finding 3).
  // Blank = no data yet; never fabricated numbers.
  const states: Record<string, SurfaceState> = user
    ? await computePracticeStates(supabase, user.id)
    : {};

  // "Resume where you left off": the last open practice tool they used.
  const resume = user ? await lastPracticePlace(user.id, visible.filter((t) => !t.locked).map((t) => ({ href: t.href, title: t.title }))) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Reveal delay={0.05}>
        <header className="mb-6">
          <p className="text-eyebrow text-muted-foreground">Practice</p>
          <h1 className="mt-1 text-h1">Walk into your first real intake ready.</h1>
          <p className="mt-2 max-w-2xl text-small text-muted-foreground">
            Everything here is private to you and your faculty. Pick whatever you want to practise.
          </p>
        </header>
      </Reveal>

      {/* One button back to where they were. (Your level lives on Home and
          the overall leaderboard: practice tools don't earn level points.) */}
      {resume ? (
        <Reveal delay={0.1}>
          <Link
            href={resume.href}
            className="btn-sweep mb-6 flex items-center gap-4 rounded-3xl border-2 border-foreground bg-primary p-5 text-primary-foreground hard-shadow-md transition-transform active:translate-y-0.5 md:w-1/2"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-foreground bg-card text-foreground">
              <RotateCcw className="size-6" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold uppercase tracking-wide opacity-80">Resume where you left off</span>
              <span className="block text-xl font-bold leading-tight">{resume.title}</span>
            </span>
            <ArrowRight className="size-6 shrink-0" aria-hidden />
          </Link>
        </Reveal>
      ) : null}

      {/* Medicines: its own section, always open */}
      <Reveal delay={0.12}>
        <Link
          href="/practice/medicines"
          className="mb-6 flex items-center gap-4 rounded-3xl border-2 border-foreground bg-brand p-5 text-brand-foreground hard-shadow-md transition-transform active:translate-y-0.5"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-foreground bg-primary text-primary-foreground">
            <Pill className="size-6" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold uppercase tracking-wide opacity-90">Medicines · {MEDS.length} profiles</span>
            <span className="block text-xl font-bold leading-tight">Look up any medicine, dose by dose</span>
            <span className="mt-0.5 block text-sm opacity-90">Instant search. Student or clinician words.</span>
          </span>
          <ArrowRight className="size-6 shrink-0" aria-hidden />
        </Link>
      </Reveal>

      {/* weak-spots banner — real gaps, server-computed */}
      <Reveal delay={0.15}>
        <WeakSpotsBanner />
      </Reveal>

      <PracticeList
        tools={
          visible.map((t) => ({
            href: t.href,
            title: t.title,
            verb: t.verb,
            description: t.description,
            time: t.time,
            icon: t.icon,
            locked: t.locked,
            state: states[t.href]?.state,
            progress: states[t.href]?.progress,
          })) as PracticeCardData[]
        }
      />

      <p className="mt-8 text-caption text-muted-foreground">
        Voice mode is available in the Consulting Room and OSCE stations.
        <span className="ml-2 hidden sm:inline">Keyboard: j/k to move · Enter to open · / for help.</span>
      </p>

      <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-caption text-muted-foreground" aria-label="Your record">
        <Link href="/passport" className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
          Skills Passport
        </Link>
        <Link href="/record" className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
          Supervision log &amp; weekly check-in
        </Link>
      </nav>

      <PracticeKeyboardNav links={visible.map((t) => ({ href: t.href, title: t.title }))} />
    </div>
  );
}
