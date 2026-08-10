import Link from "next/link";
import {
  Stethoscope, Brain, Layers, Timer, BookOpen, FlaskConical,
  NotebookPen, Users, Radar, CircleCheck, Gauge, Search, MessageSquare,
  type LucideIcon,
} from "lucide-react";

/**
 * /practice — the deliberate browse view (v5.1 Part B).
 * Grouped by time + mode, not category. Every card shows a state chip, a time
 * badge and a progress line. Eyebrow labels are one-word interaction verbs —
 * one taxonomy, and it teaches that these are genuinely different activities.
 * No two features share an icon.
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
  reason?: string;
};

const PRACTICE_TOOLS: PracticeTool[] = [
  // Under 5 minutes
  { href: "/practice/judgment", title: "5 Judgment Calls", verb: "SLIDE", description: "New information changes the probability.", icon: Gauge, time: "2 min", state: "due", progress: "day 4" },
  { href: "/practice/two-minute-clinic", title: "Two-Minute Clinic", verb: "TYPE", description: "One-liner, differential, next question.", icon: CircleCheck, time: "2 min", state: "new" },
  { href: "/practice/rounds", title: "Rounds", verb: "RATE", description: "Spaced-repetition cards, capped at 25/day.", icon: Layers, time: "3 min", state: "done_today" },
  { href: "/practice/decode", title: "Presenting Complaint Decoder", verb: "DECODE", description: "“Not feeling fresh” — six things could be true.", icon: Search, time: "4 min", state: "new", reason: "The flagship drill." },

  // A proper session
  { href: "/practice/consulting-room", title: "Consulting Room", verb: "TALK", description: "Interview a simulated patient; the debrief shows what you missed.", icon: Stethoscope, time: "12 min", state: "in_progress", progress: "case 3 / 60" },
  { href: "/practice/mse", title: "MSE Trainer", verb: "TAG", description: "Describe before you label. 11 domains.", icon: Brain, time: "10 min", state: "new" },
  { href: "/practice/osce", title: "OSCE Stations", verb: "PERFORM", description: "Seven minutes, one task, voice-first.", icon: Timer, time: "7 min", state: "new" },
  { href: "/practice/formulation", title: "Formulation Forge", verb: "SORT", description: "5P factors, narrative, diff against the model.", icon: Layers, time: "8 min", state: "new" },

  // With someone else
  { href: "/practice/role-play", title: "Peer Role-Play", verb: "PAIR", description: "One of you the patient, one the clinician.", icon: Users, time: "15 min", state: "new" },
  { href: "/practice/ethics", title: "Ethics & Law", verb: "CHOOSE", description: "Consequence first, then the statute.", icon: FlaskConical, time: "5 min", state: "new" },

  // Read and reflect
  { href: "/practice/library", title: "Case Library", verb: "ANNOTATE", description: "Highlight + note; peers' notes unlock after yours.", icon: BookOpen, time: "varies", state: "new", progress: "129 reports" },
  { href: "/practice/check-in", title: "Weekly Check-in", verb: "ONE TAP", description: "30 seconds, aggregate-only for faculty.", icon: CircleCheck, time: "<1 min", state: "done_today" },
  { href: "/practice/wall", title: "Cohort Wall", verb: "ASK", description: "Threaded, anonymous-post toggle.", icon: MessageSquare, time: "3 min", state: "new" },

  // Your record
  { href: "/practice/passport", title: "Skills Passport", verb: "WATCH", description: "Your competencies, evidenced.", icon: Radar, time: "read", state: "new", progress: "2 / 11 competencies" },
  { href: "/practice/supervision", title: "Supervision Log", verb: "RECORD", description: "Log contact hours, tag competencies.", icon: NotebookPen, time: "1 min", state: "new" },
];

// Weak Spots is a dismissible banner above the grid, not a card.
const WEAK_SPOTS = { href: "/practice/weak-spots", title: "Weak spots", description: "3 domains weak this week: thought form, risk timing, mood vs affect" };

const STATE_STYLE: Record<PracticeTool["state"], { label: string; className: string }> = {
  new: { label: "New", className: "bg-secondary text-muted-foreground" },
  in_progress: { label: "In progress", className: "bg-primary text-primary-foreground" },
  done_today: { label: "Done today", className: "bg-green-100 text-green-800" },
  due: { label: "Due", className: "bg-amber-100 text-amber-800" },
};

export default function PracticeHubPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <p className="text-eyebrow text-muted-foreground">Practice layer</p>
        <h1 className="mt-1 text-h1">Walk into your first real intake ready.</h1>
        <p className="mt-2 max-w-2xl text-small text-muted-foreground">
          Everything here is private to you and your faculty. Pick by how long you have.
        </p>
      </header>

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
        {PRACTICE_TOOLS.map((tool) => {
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
      </p>
    </div>
  );
}
