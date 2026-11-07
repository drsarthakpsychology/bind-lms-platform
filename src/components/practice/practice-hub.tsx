import Link from "next/link";
import {
  ArrowRight,
  Brain,
  ClipboardList,
  BookOpen,
  Gauge,
  GraduationCap,
  Languages,
  Lock,
  MessagesSquare,
  Radar,
  RotateCcw,
  Scale,
  Search,
  Stethoscope,
  Timer,
  Users,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { FeatureKey, FlagStatus } from "@/lib/flags";
import type { SurfaceState } from "@/lib/practice/practice-state";
import { cn } from "@/lib/utils";

/**
 * The Practice hub (plan section 8): clinical skills on real cases.
 * Four main skills at the top, then the smaller tools under two headings.
 * Each tool says what it is in one short line. Server component.
 */

type Tone = "lime" | "blue" | "ink" | "plain";
export type HubTool = { href: string; title: string; text: string; icon: LucideIcon; flag: FeatureKey; tone: Tone };

export const MAIN_TOOLS: HubTool[] = [
  { href: "/games/daily", title: "Daily case", text: "One new patient a day. Name it in as few clues as you can.", icon: ClipboardList, flag: "learn", tone: "lime" },
  { href: "/practice/consulting-room", title: "AI patient interview", text: "Talk to a patient in the Consulting Room. The debrief shows what you missed.", icon: Stethoscope, flag: "consulting_room", tone: "ink" },
  { href: "/practice/mse", title: "MSE", text: "Describe what you see before you label it.", icon: Brain, flag: "mse", tone: "blue" },
  { href: "/practice/formulation", title: "Formulation", text: "Sort the 5Ps and write the story of the case.", icon: Wand2, flag: "formulation", tone: "lime" },
];

export const THINK_TOOLS: HubTool[] = [
  { href: "/games/detective", title: "Clinic detective", text: "Name the disorder or medicine from clues.", icon: Search, flag: "learn", tone: "plain" },
  { href: "/games/scenarios", title: "What would you do", text: "Tricky patient moments, real consequences.", icon: MessagesSquare, flag: "learn", tone: "plain" },
  { href: "/games/terms", title: "Say it clinically", text: "Everyday words into case-sheet words.", icon: Languages, flag: "learn", tone: "plain" },
  { href: "/practice/judgment", title: "Judgment", text: "New facts change the odds. 2 minutes.", icon: Gauge, flag: "judgment", tone: "plain" },
  { href: "/practice/two-minute-clinic", title: "Two-minute clinic", text: "One-liner, differential, next question.", icon: Zap, flag: "two_minute_clinic", tone: "plain" },
  { href: "/practice/ethics", title: "Ethics, law & referral", text: "What to do, then the law behind it.", icon: Scale, flag: "ethics", tone: "plain" },
];

export const MORE_TOOLS: HubTool[] = [
  { href: "/practice/osce", title: "OSCE stations", text: "Seven minutes, one task, out loud.", icon: Timer, flag: "osce", tone: "plain" },
  { href: "/practice/role-play", title: "Peer role-play", text: "One of you is the patient.", icon: Users, flag: "peer_roleplay", tone: "plain" },
  { href: "/practice/weak-spots", title: "Weak spots drill", text: "A drill built from your own debriefs.", icon: Radar, flag: "weak_spots", tone: "plain" },
  { href: "/practice/landmark", title: "Landmark cases", text: "What was believed, and what held up.", icon: GraduationCap, flag: "landmark", tone: "plain" },
  { href: "/practice/library", title: "Case library", text: "Real case reports to read and note.", icon: BookOpen, flag: "case_library", tone: "plain" },
];

const TONE: Record<Tone, string> = {
  ink: "bg-foreground text-background",
  blue: "bg-brand text-brand-foreground",
  lime: "bg-primary text-primary-foreground",
  plain: "bg-card text-foreground",
};

const STATE_CHIP: Record<string, { label: string; className: string }> = {
  in_progress: { label: "In progress", className: "bg-card text-foreground" },
  done_today: { label: "Done today", className: "bg-status-success-bg text-status-success-fg" },
  due: { label: "Due", className: "bg-status-pending-bg text-status-pending-fg" },
};

export type ShownTool = HubTool & { locked: boolean; state?: SurfaceState };

/** Hide "off" tools; "live" ones show locked; blocked ones are dropped by the caller. */
export function shownTools(tools: HubTool[], flags: Record<string, FlagStatus>, states: Record<string, SurfaceState>, isBlocked: (href: string) => boolean): ShownTool[] {
  return tools.flatMap((t) => {
    const status = flags[t.flag];
    if ((status !== "live" && status !== "unlocked") || isBlocked(t.href)) return [];
    const locked = status === "live";
    return [{ ...t, locked, href: locked ? `/practice/not-available?feature=${encodeURIComponent(t.flag)}&state=live` : t.href, state: states[t.href] }];
  });
}

function Chip({ tool }: { tool: ShownTool }) {
  if (tool.locked) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border-2 border-foreground/30 bg-card px-2 py-0.5 text-xs font-semibold text-muted-foreground">
        <Lock className="size-3" aria-hidden /> Soon
      </span>
    );
  }
  const chip = tool.state?.state ? STATE_CHIP[tool.state.state] : undefined;
  if (!chip) return null;
  return <span className={cn("shrink-0 whitespace-nowrap rounded-full border-2 border-foreground px-2 py-0.5 text-xs font-bold", chip.className)}>{chip.label}</span>;
}

/** A main skill: big, coloured, the first thing on the page. */
export function MainTile({ tool }: { tool: ShownTool }) {
  const Icon = tool.icon;
  return (
    <li className="min-w-0">
      <Link
        href={tool.href}
        className={cn(
          "group/tile flex h-full min-w-0 flex-col gap-3 rounded-2xl border-2 border-foreground p-4 outline-none hard-shadow-sm transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-0.5 hover:hard-shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/60 active:translate-y-px active:shadow-none sm:p-5",
          TONE[tool.tone],
          tool.locked && "opacity-70",
        )}
      >
        <span className="flex items-start justify-between gap-2">
          <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-xl border-2 border-foreground bg-card text-foreground">
            <Icon className="size-6 transition-transform duration-fast ease-snappy motion-safe:group-hover/tile:-rotate-6 motion-safe:group-hover/tile:scale-110" />
          </span>
          <Chip tool={tool} />
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="flex items-center gap-2 text-h3 [overflow-wrap:anywhere]">
            {tool.title}
            <ArrowRight className="size-4 shrink-0 transition-transform duration-fast group-hover/tile:translate-x-0.5" aria-hidden />
          </span>
          <span className="text-sm leading-snug opacity-85 [overflow-wrap:anywhere]">{tool.text}</span>
        </span>
      </Link>
    </li>
  );
}

/** A smaller tool: one row, icon, name, one line. */
export function ToolRow({ tool }: { tool: ShownTool }) {
  const Icon = tool.icon;
  return (
    <li className="min-w-0">
      <Link
        href={tool.href}
        className={cn(
          "group/row flex h-full min-h-16 min-w-0 items-center gap-3 rounded-xl border-2 border-foreground bg-card p-3 outline-none transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-0.5 hover:hard-shadow-sm focus-visible:ring-[3px] focus-visible:ring-ring/60 active:translate-y-px active:shadow-none",
          tool.locked && "opacity-70",
        )}
      >
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-lg border-2 border-foreground bg-background">
          <Icon className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold leading-tight [overflow-wrap:anywhere]">{tool.title}</span>
          <span className="block text-sm leading-snug text-muted-foreground [overflow-wrap:anywhere]">{tool.text}</span>
        </span>
        <Chip tool={tool} />
      </Link>
    </li>
  );
}

export function ToolSection({ id, title, tools }: { id: string; title: string; tools: ShownTool[] }) {
  if (!tools.length) return null;
  return (
    <section aria-labelledby={id} className="space-y-3">
      <h2 id={id} className="text-h3">
        {title}
      </h2>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((t) => (
          <ToolRow key={t.href} tool={t} />
        ))}
      </ul>
    </section>
  );
}

/** The whole hub (the page loads flags, states and the resume link). */
export function PracticeHubView({
  main,
  think,
  more,
  resume,
  records = { passport: false, log: false },
}: {
  main: ShownTool[];
  think: ShownTool[];
  more: ShownTool[];
  resume: { href: string; title: string } | null;
  /** Which record links to show: only those whose feature switch is on. */
  records?: { passport: boolean; log: boolean };
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="space-y-2">
        <p className="text-eyebrow text-link">Practice</p>
        <h1 className="text-h1">Clinical skills on real cases</h1>
        {resume ? (
          <Link href={resume.href} className="inline-flex min-h-11 max-w-full items-center gap-2 text-sm font-bold text-link underline-offset-4 hover:underline">
            <RotateCcw className="size-4 shrink-0" aria-hidden />
            <span className="min-w-0 truncate">Pick up where you left off: {resume.title}</span>
          </Link>
        ) : null}
      </header>

      {main.length ? (
        <ul aria-label="Main skills" className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
          {main.map((t) => (
            <MainTile key={t.href} tool={t} />
          ))}
        </ul>
      ) : null}

      <ToolSection id="think" title="Think like a clinician" tools={think} />
      <ToolSection id="more" title="More practice" tools={more} />

      {!main.length && !think.length && !more.length ? (
        <p className="rounded-2xl border-2 border-dashed border-foreground/30 p-6 text-center text-sm text-muted-foreground">Nothing here yet. Your faculty will switch tools on soon.</p>
      ) : null}

      {records.passport || records.log ? (
        <nav className="flex flex-wrap gap-x-5 border-t-2 border-foreground/15 pt-3 text-sm" aria-label="Your record">
          {records.passport ? (
            <Link href="/passport" className="inline-flex min-h-11 items-center font-semibold text-muted-foreground hover:text-foreground">
              Skills Passport
            </Link>
          ) : null}
          {records.log ? (
            <Link href="/record" className="inline-flex min-h-11 items-center font-semibold text-muted-foreground hover:text-foreground">
              Supervision log and check-in
            </Link>
          ) : null}
        </nav>
      ) : null}

    </div>
  );
}
