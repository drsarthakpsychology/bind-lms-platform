import Link from "next/link";
import {
  Stethoscope,
  Mic2,
  ListChecks,
  Layers,
  Brain,
  Timer,
  BookOpen,
  FlaskConical,
} from "lucide-react";

/**
 * /practice — the student-facing hub for the practice layer.
 * Neo-brutalist pastel cards, each a real tool entry point.
 * The Consulting Room is the flagship and is listed first.
 */

type PracticeTool = {
  href: string;
  title: string;
  description: string;
  icon: typeof Stethoscope;
  eyebrow: string;
  accent?: boolean;
};

const PRACTICE_TOOLS: PracticeTool[] = [
  {
    href: "/practice/consulting-room",
    title: "Consulting Room",
    description: "Interview a simulated patient. The debrief shows you what you missed.",
    icon: Stethoscope,
    eyebrow: "AI simulated patient",
    accent: true,
  },
  {
    href: "/practice/judgment",
    title: "5 Judgment Calls",
    description: "90 seconds, one screen. New information, new probability.",
    icon: ListChecks,
    eyebrow: "Script concordance",
  },
  {
    href: "/practice/formulation",
    title: "Formulation Forge",
    description: "Sort the 5P factors, write the narrative, diff against the model.",
    icon: Layers,
    eyebrow: "5P formulation",
  },
  {
    href: "/practice/mse",
    title: "MSE Trainer",
    description: "Tag stimuli across the 11 domains. Mood vs affect, done properly.",
    icon: Brain,
    eyebrow: "Mental status exam",
  },
  {
    href: "/practice/osce",
    title: "OSCE Stations",
    description: "Seven minutes, one task. Voice mode strongly preferred.",
    icon: Timer,
    eyebrow: "Timed stations",
  },
  {
    href: "/practice/rounds",
    title: "Rounds",
    description: "Spaced-repetition cards drafted from your lessons.",
    icon: BookOpen,
    eyebrow: "Cards, capped at 25/day",
  },
  {
    href: "/practice/ethics",
    title: "Ethics & Law",
    description: "MHA 2017, RCI scope, POCSO. The consequence comes first.",
    icon: FlaskConical,
    eyebrow: "Dilemmas",
  },
  {
    href: "/practice/supervision",
    title: "Supervision log",
    description: "Log RCI-track contact hours, tag competencies, build your passport.",
    icon: ListChecks,
    eyebrow: "Contact hours",
  },
  {
    href: "/practice/check-in",
    title: "Weekly check-in",
    description: "Thirty seconds, aggregate-only for faculty. How's the week, really?",
    icon: Timer,
    eyebrow: "Non-clinical",
  },
  {
    href: "/practice/library",
    title: "Case Library",
    description: "Browse open-access case reports from the corpus. Search, expand, read.",
    icon: BookOpen,
    eyebrow: "Corpus",
  },
];

export default function PracticeHubPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <p className="text-eyebrow text-muted-foreground">Practice layer</p>
        <h1 className="mt-1 text-h1">Walk into your first real intake ready.</h1>
        <p className="mt-2 max-w-2xl text-small text-muted-foreground">
          Your degree taught you to describe therapy. These tools teach you to do it.
          Everything here is private to you and your faculty.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRACTICE_TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col gap-3 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:hard-shadow-md active:translate-y-px active:hard-shadow-none"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-md border-2 border-border ${
                    tool.accent ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                  }`}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="text-eyebrow text-muted-foreground">{tool.eyebrow}</span>
              </div>
              <div>
                <h2 className="text-base font-semibold">{tool.title}</h2>
                <p className="mt-1 text-small text-muted-foreground">{tool.description}</p>
              </div>
              <span className="mt-auto text-caption font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Open →
              </span>
            </Link>
          );
        })}
      </div>

      <p className="mt-8 text-caption text-muted-foreground">
        <Mic2 className="mr-1 inline size-3.5" aria-hidden />
        Voice mode is available in the Consulting Room and OSCE stations. Your browser streams
        audio to its provider for speech recognition; everything else stays on the server.
      </p>
    </div>
  );
}
