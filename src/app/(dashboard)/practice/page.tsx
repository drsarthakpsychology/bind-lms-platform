import Link from "next/link";
import { readFlags } from "@/lib/flags";
import { createClient } from "@/lib/supabase/server";
import { computePracticeStates, type SurfaceState } from "@/lib/practice/practice-state";
import { computeResumePrimary } from "@/lib/practice/resume";
import { PracticeKeyboardNav } from "@/components/practice/keyboard-nav";
import { WeakSpotsBanner } from "@/components/practice/weak-spots-banner";
import { PracticeGroups, type PracticeCardData } from "@/components/practice/practice-groups";
import { Reveal } from "@/components/motion/reveal";
import { PRACTICE_TOOLS, GROUP_META, type PracticeTool } from "@/lib/practice/tools";

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

  // The recommended card — ALWAYS states why (B2: reason beats recommendation).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Honest per-surface state from the user's real activity (Finding 3).
  // Blank = no data yet; never fabricated numbers.
  const states: Record<string, SurfaceState> = user
    ? await computePracticeStates(supabase, user.id)
    : {};

  // The recommended card — one shared engine for "what's next" (T140), so
  // /today and /practice always recommend the same thing. ALWAYS states why
  // (B2: reason beats recommendation).
  const recommendation = user ? await computeResumePrimary(supabase, user.id) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Reveal delay={0.05}>
        <header className="mb-6">
          <p className="text-eyebrow text-muted-foreground">Practice</p>
          <h1 className="mt-1 text-h1">Walk into your first real intake ready.</h1>
          <p className="mt-2 max-w-2xl text-small text-muted-foreground">
            Everything here is private to you and your faculty. Core tools are full workflows; drills are single-skill reps. Pick by how long you have.
          </p>
        </header>
      </Reveal>

      {/* recommended card — one tap, always with a reason */}
      <Reveal delay={0.1}>
      {recommendation ? (
        <Link
          href={recommendation.href}
          className="mb-6 block rounded-md border-2 border-primary bg-primary/5 p-4 hard-shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-px"
        >
          <p className="text-caption font-semibold text-link">Recommended for you</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <div>
              <p className="text-base font-semibold">{recommendation.title}</p>
              <p className="mt-1 text-small text-muted-foreground">{recommendation.reason}</p>
            </div>
            <span className="shrink-0 rounded-md border-2 border-primary bg-primary px-3 py-1.5 text-caption font-semibold text-primary-foreground">
              {recommendation.cta} · {recommendation.time}
            </span>
          </div>
        </Link>
      ) : null}
      </Reveal>

      {/* weak-spots banner — real gaps, server-computed */}
      <Reveal delay={0.15}>
        <WeakSpotsBanner />
      </Reveal>

      <PracticeGroups
        groups={(Object.keys(GROUP_META) as PracticeTool["group"][]).map((g) => ({
          id: g,
          label: GROUP_META[g].label,
          hint: GROUP_META[g].hint,
          tools: visible
            .filter((t) => t.group === g)
            .map((t) => ({
              href: t.href,
              title: t.title,
              verb: t.verb,
              description: t.description,
              time: t.time,
              icon: t.icon,
              locked: t.locked,
              state: states[t.href]?.state,
              progress: states[t.href]?.progress,
            })) as PracticeCardData[],
        })).filter((g) => g.tools.length > 0)}
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
