import Link from "next/link";
import {
  Stethoscope, Brain, Layers, Timer, BookOpen, Scale,
  NotebookPen, Users, Radar, CircleCheck, Gauge, Search, MessageSquare,
  Siren, GraduationCap, HeartPulse, ClipboardCheck, Wand2, Repeat,
  type LucideIcon,
} from "lucide-react";
import { readFlags, type FeatureKey } from "@/lib/flags";
import { createClient } from "@/lib/supabase/server";
import { PracticeKeyboardNav } from "@/components/practice/keyboard-nav";

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
  state: "new" | "in_progress" | "done_today" | "due";
  progress?: string;
  flag: FeatureKey;
};

const PRACTICE_TOOLS: PracticeTool[] = [
  // Under 5 minutes
  { href: "/practice/judgment", title: "5 Judgment Calls", verb: "SLIDE", description: "New information changes the probability.", icon: Gauge, time: "2 min", state: "due", flag: "judgment", progress: "day 4" },
  { href: "/practice/two-minute-clinic", title: "Two-Minute Clinic", verb: "TYPE", description: "One-liner, differential, next question.", icon: CircleCheck, time: "2 min", state: "new", flag: "two_minute_clinic" },
  { href: "/practice/rounds", title: "Rounds", verb: "RATE", description: "Spaced-repetition cards, capped at 25/day.", icon: Repeat, time: "3 min", state: "done_today", flag: "rounds" },
  { href: "/practice/decode", title: "Presenting Complaint Decoder", verb: "DECODE", description: "“Not feeling fresh” — six things could be true.", icon: Search, time: "4 min", state: "new", flag: "decoder" },

  // A proper session
  { href: "/practice/consulting-room", title: "Consulting Room", verb: "TALK", description: "Interview a simulated patient; the debrief shows what you missed.", icon: Stethoscope, time: "12 min", state: "in_progress", flag: "consulting_room", progress: "case 3 / 60" },
  { href: "/practice/mse", title: "MSE Trainer", verb: "TAG", description: "Describe before you label. 11 domains.", icon: Brain, time: "10 min", state: "new", flag: "mse" },
  { href: "/practice/osce", title: "OSCE Stations", verb: "PERFORM", description: "Seven minutes, one task, voice-first.", icon: Timer, time: "7 min", state: "new", flag: "osce" },
  { href: "/practice/formulation", title: "Formulation Forge", verb: "SORT", description: "5P factors, narrative, diff against the model.", icon: Wand2, time: "8 min", state: "new", flag: "formulation" },

  // With someone else
  { href: "/practice/role-play", title: "Peer Role-Play", verb: "PAIR", description: "One of you the patient, one the clinician.", icon: Users, time: "15 min", state: "new", flag: "peer_roleplay" },
  { href: "/practice/ethics", title: "Ethics & Law", verb: "CHOOSE", description: "Consequence first, then the statute.", icon: Scale, time: "5 min", state: "new", flag: "ethics" },
  { href: "/wall", title: "Cohort Wall", verb: "ASK", description: "Threaded, anonymous-post toggle.", icon: MessageSquare, time: "3 min", state: "new", flag: "journal" },

  // Read and reflect
  { href: "/practice/library", title: "Case Library", verb: "ANNOTATE", description: "Highlight + note; peers' notes unlock after yours.", icon: BookOpen, time: "varies", state: "new", flag: "case_library", progress: "129 reports" },
  { href: "/practice/check-in", title: "Weekly Check-in", verb: "TAP", description: "30 seconds, aggregate-only for faculty.", icon: HeartPulse, time: "<1 min", state: "done_today", flag: "checkin" },
  { href: "/practice/landmark", title: "Landmark Cases", verb: "READ", description: "What was believed, what held up.", icon: GraduationCap, time: "5 min", state: "new", flag: "landmark" },
  { href: "/practice/out-of-depth", title: "Out of Depth", verb: "REFER", description: "Know when to refer, escalate, or stop.", icon: Siren, time: "5 min", state: "new", flag: "ethics" },

  // Your record
  { href: "/practice/passport", title: "Skills Passport", verb: "VIEW", description: "Your competencies, evidenced.", icon: Radar, time: "read", state: "new", flag: "skills_passport", progress: "2 / 11 competencies" },
  { href: "/practice/supervision", title: "Supervision Log", verb: "RECORD", description: "Log contact hours, tag competencies.", icon: NotebookPen, time: "1 min", state: "new", flag: "supervision" },
  { href: "/practice/weak-spots", title: "Weak Spots", verb: "DRILL", description: "Your gaps, and a 10-item drill on the spot.", icon: ClipboardCheck, time: "5 min", state: "new", flag: "weak_spots" },
  { href: "/practice/modules", title: "Modules", verb: "BROWSE", description: "Your course's modules, in order — locked ones state why.", icon: Layers, time: "1 min", state: "new", flag: "modules" },
];

// Weak Spots is a dismissible banner above the grid, not a card.
const WEAK_SPOTS = { href: "/practice/weak-spots", title: "Weak spots", description: "3 domains weak this week: thought form, risk timing, mood vs affect" };

const STATE_STYLE: Record<PracticeTool["state"], { label: string; className: string }> = {
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

      {/* weak-spots banner */}
      <Link
        href={WEAK_SPOTS.href}
        className="mb-6 flex items-center justify-between gap-3 rounded-md border-2 border-border bg-amber-50 p-3 text-small transition-transform active:translate-y-px"
      >
        <span className="flex items-center gap-2">
          <Radar className="size-4 shrink-0 text-amber-700" aria-hidden />
          <span>{WEAK_SPOTS.description}</span>
        </span>
        <span className="shrink-0 font-medium text-primary">Generate drill →</span>
      </Link>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((tool) => {
          const Icon = tool.icon;
          const state = STATE_STYLE[tool.state];
          const dimmed = tool.state === "done_today";
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
                <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-caption font-medium ${state.className}`}>
                  {state.label}
                </span>
              </div>
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  {tool.title}
                  <span className="shrink-0 text-caption font-normal text-muted-foreground">{tool.time}</span>
                </h2>
                <p className="mt-1 text-small text-muted-foreground">{tool.description}</p>
                {tool.progress ? (
                  <p className="mt-1 text-caption text-muted-foreground">{tool.progress}</p>
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

      <PracticeKeyboardNav links={visible.map((t) => ({ href: t.href, title: t.title }))} />
    </div>
  );
}
