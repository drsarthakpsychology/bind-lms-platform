import Link from "next/link";
import { readFlags, type FeatureKey } from "@/lib/flags";
import { createClient } from "@/lib/supabase/server";
import { computePracticeStates, type SurfaceState } from "@/lib/practice/practice-state";
import { PracticeKeyboardNav } from "@/components/practice/keyboard-nav";
import { WeakSpotsBanner } from "@/components/practice/weak-spots-banner";
import { PracticeGroups, type PracticeCardData } from "@/components/practice/practice-groups";
import { Reveal } from "@/components/motion/reveal";

/**
 * /practice — the deliberate browse view (v5.1 Part B).
 * Grouped by session length (casebook Axis 5), collapsible, open state
 * remembered per user. Every card shows a state chip, a time badge and a
 * progress line — all honest (computed from real data, blank when none).
 * Eyebrow labels are one-word interaction verbs; no two features share an
 * icon. Cards are gated by feature flags.
 */

type PracticeTool = {
  href: string;
  title: string;
  verb: string;
  description: string;
  icon: string; // key into PRACTICE_ICONS (serializable over the boundary)
  time: string;
  flag: FeatureKey;
  group: "quick" | "mid" | "deep" | "browse";
};

const PRACTICE_TOOLS: PracticeTool[] = [
  // Quick — under 5 minutes
  { href: "/practice/judgment", title: "5 Judgment Calls", verb: "SLIDE", description: "New information changes the probability.", icon: "gauge", time: "2 min", flag: "judgment", group: "quick" },
  { href: "/practice/two-minute-clinic", title: "Two-Minute Clinic", verb: "TYPE", description: "One-liner, differential, next question.", icon: "circleCheck", time: "2 min", flag: "two_minute_clinic", group: "quick" },
  { href: "/practice/rounds", title: "Rounds", verb: "RATE", description: "Spaced-repetition cards, capped at 25/day.", icon: "repeat", time: "3 min", flag: "rounds", group: "quick" },
  { href: "/practice/decode", title: "Presenting Complaint Decoder", verb: "DECODE", description: "“Not feeling fresh” — six things could be true.", icon: "search", time: "4 min", flag: "decoder", group: "quick" },
  { href: "/wall", title: "Cohort Wall", verb: "ASK", description: "Threaded, anonymous-post toggle.", icon: "messageSquare", time: "3 min", flag: "journal", group: "quick" },
  { href: "/practice/modules", title: "Modules", verb: "BROWSE", description: "Your course's modules, in order — locked ones state why.", icon: "layers", time: "1 min", flag: "modules", group: "quick" },

  // Mid — 5-10 minutes
  { href: "/practice/mse", title: "MSE Trainer", verb: "TAG", description: "Describe before you label. 11 domains.", icon: "brain", time: "10 min", flag: "mse", group: "mid" },
  { href: "/practice/osce", title: "OSCE Stations", verb: "PERFORM", description: "Seven minutes, one task, voice-first.", icon: "timer", time: "7 min", flag: "osce", group: "mid" },
  { href: "/practice/formulation", title: "Formulation Forge", verb: "SORT", description: "5P factors, narrative, diff against the model.", icon: "wand2", time: "8 min", flag: "formulation", group: "mid" },
  { href: "/practice/ethics", title: "Ethics & Law", verb: "CHOOSE", description: "Consequence first, then the statute.", icon: "scale", time: "5 min", flag: "ethics", group: "mid" },
  { href: "/practice/landmark", title: "Landmark Cases", verb: "READ", description: "What was believed, what held up.", icon: "graduationCap", time: "5 min", flag: "landmark", group: "mid" },
  { href: "/practice/out-of-depth", title: "Out of Depth", verb: "REFER", description: "Know when to refer, escalate, or stop.", icon: "siren", time: "5 min", flag: "ethics", group: "mid" },

  // Deep — a proper sitting
  { href: "/practice/consulting-room", title: "Consulting Room", verb: "TALK", description: "Interview a simulated patient; the debrief shows what you missed.", icon: "stethoscope", time: "12 min", flag: "consulting_room", group: "deep" },
  { href: "/practice/role-play", title: "Peer Role-Play", verb: "PAIR", description: "One of you the patient, one the clinician.", icon: "users", time: "15 min", flag: "peer_roleplay", group: "deep" },

  // Browse — whenever
  { href: "/practice/library", title: "Case Library", verb: "ANNOTATE", description: "Highlight + note; peers' notes unlock after yours.", icon: "bookOpen", time: "varies", flag: "case_library", group: "browse" },
];


const GROUP_META: Record<PracticeTool["group"], { label: string; hint: string }> = {
  quick: { label: "Under 5 minutes", hint: "when you have a minute" },
  mid: { label: "5–10 minutes", hint: "a focused block" },
  deep: { label: "A proper sitting", hint: "the deep loop" },
  browse: { label: "Whenever", hint: "browse and annotate" },
};

export default async function PracticeHubPage() {
  const flags = await readFlags();
  const visible = PRACTICE_TOOLS.filter((t) => flags[t.flag] === true);

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

  let recommendation: { href: string; title: string; reason: string; cta: string; time: string } | null = null;
  if (user) {
    // 1) In-progress sim session → resume it (the patient is waiting).
    const { data: active } = await supabase
      .from("sim_sessions")
      .select("id, case_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();
    if (active) {
      recommendation = {
        href: `/practice/consulting-room/session/${active.id}`,
        title: "Resume your consultation",
        reason: "A patient is waiting mid-session — finishing it banks the debrief and your score.",
        cta: "Resume",
        time: "12 min",
      };
    } else {
      // 2) Risk-timing missed in recent debriefs → the consulting room.
      const { data: scores } = await supabase
        .from("sim_scores")
        .select("rubric")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4);
      const riskLate = (scores ?? []).filter((s) => {
        const r = (s.rubric as Record<string, unknown> | null) ?? {};
        return r.risk_timing === "late" || r.risk_timing === "absent";
      }).length;
      if (riskLate >= 2) {
        recommendation = {
          href: "/practice/consulting-room",
          title: "Consulting Room — risk assessment",
          reason: `You've missed the risk-assessment moment in ${riskLate} of your last ${(scores ?? []).length || 4} sessions. Run a case and front-load it.`,
          cta: "Run a case",
          time: "12 min",
        };
      } else if ((scores ?? []).length >= 3) {
        const unsMse = (scores ?? []).filter((s) => {
          const r = (s.rubric as Record<string, unknown> | null) ?? {};
          return r.idiom_decoding === false;
        }).length;
        if (unsMse > 0) {
          recommendation = {
            href: "/practice/decode",
            title: "Presenting Complaint Decoder",
            reason: `The opening idiom went undecoded in ${unsMse} of your recent sessions. Five minutes here fixes your ears.`,
            cta: "Decode",
            time: "4 min",
          };
        }
      }
    }
    // 3) Fallback: the daily drill.
    if (!recommendation) {
      recommendation = {
        href: "/practice/decode",
        title: "Presenting Complaint Decoder",
        reason: "The daily habit that changes how you hear patients — today's set is fresh.",
        cta: "Decode",
        time: "4 min",
      };
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Reveal delay={0.05}>
        <header className="mb-6">
          <p className="text-eyebrow text-muted-foreground">Practice layer</p>
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
              state: states[t.href]?.state,
              progress: states[t.href]?.progress,
            })) as PracticeCardData[],
        })).filter((g) => g.tools.length > 0)}
      />

      <p className="mt-8 text-caption text-muted-foreground">
        Voice mode is available in the Consulting Room and OSCE stations. Everything stays on the server.
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
