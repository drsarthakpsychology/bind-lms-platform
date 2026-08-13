import Link from "next/link";
import {
  Stethoscope, Brain, Layers, Timer, BookOpen, Scale,
  Users, CircleCheck, Gauge, Search, MessageSquare,
  Siren, GraduationCap, Wand2, Repeat,
  type LucideIcon,
} from "lucide-react";
import { readFlags, type FeatureKey } from "@/lib/flags";
import { createClient } from "@/lib/supabase/server";
import { computePracticeStates, type SurfaceState } from "@/lib/practice/practice-state";
import { PracticeKeyboardNav } from "@/components/practice/keyboard-nav";
import { WeakSpotsBanner } from "@/components/practice/weak-spots-banner";

/**
 * /practice — the deliberate browse view (v5.1 Part B).
 * Grouped by time + mode, not category. Every card shows a state chip, a time
 * badge and a progress line. Eyebrow labels are one-word interaction verbs.
 * No two features share an icon. Cards are gated by feature flags (A2 scope
 * cut): off-flag tools are hidden from students, shown in admin.
 */

type PracticeTool = {
  href: string;
  title: string;
  verb: string;
  description: string;
  icon: LucideIcon;
  time: string;
  flag: FeatureKey;
};

const PRACTICE_TOOLS: PracticeTool[] = [
  // Under 5 minutes
  { href: "/practice/judgment", title: "5 Judgment Calls", verb: "SLIDE", description: "New information changes the probability.", icon: Gauge, time: "2 min", flag: "judgment" },
  { href: "/practice/two-minute-clinic", title: "Two-Minute Clinic", verb: "TYPE", description: "One-liner, differential, next question.", icon: CircleCheck, time: "2 min", flag: "two_minute_clinic" },
  { href: "/practice/rounds", title: "Rounds", verb: "RATE", description: "Spaced-repetition cards, capped at 25/day.", icon: Repeat, time: "3 min", flag: "rounds" },
  { href: "/practice/decode", title: "Presenting Complaint Decoder", verb: "DECODE", description: "“Not feeling fresh” — six things could be true.", icon: Search, time: "4 min", flag: "decoder" },

  // A proper session
  { href: "/practice/consulting-room", title: "Consulting Room", verb: "TALK", description: "Interview a simulated patient; the debrief shows what you missed.", icon: Stethoscope, time: "12 min", flag: "consulting_room" },
  { href: "/practice/mse", title: "MSE Trainer", verb: "TAG", description: "Describe before you label. 11 domains.", icon: Brain, time: "10 min", flag: "mse" },
  { href: "/practice/osce", title: "OSCE Stations", verb: "PERFORM", description: "Seven minutes, one task, voice-first.", icon: Timer, time: "7 min", flag: "osce" },
  { href: "/practice/formulation", title: "Formulation Forge", verb: "SORT", description: "5P factors, narrative, diff against the model.", icon: Wand2, time: "8 min", flag: "formulation" },

  // With someone else
  { href: "/practice/role-play", title: "Peer Role-Play", verb: "PAIR", description: "One of you the patient, one the clinician.", icon: Users, time: "15 min", flag: "peer_roleplay" },
  { href: "/practice/ethics", title: "Ethics & Law", verb: "CHOOSE", description: "Consequence first, then the statute.", icon: Scale, time: "5 min", flag: "ethics" },
  { href: "/wall", title: "Cohort Wall", verb: "ASK", description: "Threaded, anonymous-post toggle.", icon: MessageSquare, time: "3 min", flag: "journal" },

  // Read and reflect
  { href: "/practice/library", title: "Case Library", verb: "ANNOTATE", description: "Highlight + note; peers' notes unlock after yours.", icon: BookOpen, time: "varies", flag: "case_library" },
  { href: "/practice/landmark", title: "Landmark Cases", verb: "READ", description: "What was believed, what held up.", icon: GraduationCap, time: "5 min", flag: "landmark" },
  { href: "/practice/out-of-depth", title: "Out of Depth", verb: "REFER", description: "Know when to refer, escalate, or stop.", icon: Siren, time: "5 min", flag: "ethics" },
  { href: "/practice/modules", title: "Modules", verb: "BROWSE", description: "Your course's modules, in order — locked ones state why.", icon: Layers, time: "1 min", flag: "modules" },
];


const STATE_STYLE: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-secondary text-muted-foreground" },
  in_progress: { label: "In progress", className: "bg-primary text-primary-foreground" },
  done_today: { label: "Done today", className: "bg-green-100 text-green-800" },
  due: { label: "Due", className: "bg-amber-100 text-amber-800" },
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
      <header className="mb-6">
        <p className="text-eyebrow text-muted-foreground">Practice layer</p>
        <h1 className="mt-1 text-h1">Walk into your first real intake ready.</h1>
        <p className="mt-2 max-w-2xl text-small text-muted-foreground">
          Everything here is private to you and your faculty. Pick by how long you have.
        </p>
      </header>

      {/* recommended card — one tap, always with a reason */}
      {recommendation ? (
        <Link
          href={recommendation.href}
          className="mb-6 block rounded-md border-2 border-primary bg-primary/5 p-4 hard-shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-px"
        >
          <p className="text-caption font-semibold text-primary">Recommended for you</p>
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

      {/* weak-spots banner — real gaps, server-computed */}
      <WeakSpotsBanner />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((tool) => {
          const Icon = tool.icon;
          const live = states[tool.href];
          const chip = live?.state ? STATE_STYLE[live.state] : null;
          const dimmed = live?.state === "done_today";
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group flex flex-col gap-3 rounded-md border-2 border-border bg-card p-4 hard-shadow-sm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:hard-shadow-md active:translate-y-px active:hard-shadow-none ${
                dimmed ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-border bg-secondary text-primary">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="text-caption font-semibold tracking-wide text-muted-foreground">{tool.verb}</span>
                {chip ? (
                  <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-caption font-medium ${chip.className}`}>
                    {chip.label}
                  </span>
                ) : null}
              </div>
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  {tool.title}
                  <span className="shrink-0 text-caption font-normal text-muted-foreground">{tool.time}</span>
                </h2>
                <p className="mt-1 text-small text-muted-foreground">{tool.description}</p>
                {live?.progress ? (
                  <p className="mt-1 text-caption text-muted-foreground">{live.progress}</p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>

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
