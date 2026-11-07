"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Clock, FlaskConical, GraduationCap, ListChecks, NotebookPen, RotateCcw, type LucideIcon } from "lucide-react";
import { emptyState, istToday, type LearnState } from "@/lib/learn/engine";
import { initLearnStore, useLearnState } from "@/lib/learn/store";
import { buildRevisionPlan, type ReviseItem, type ReviseKind, type ReviseModule, type RevisionPlan } from "@/lib/revise/plan";
import { Chai } from "@/components/learn/chai";
import { cn } from "@/lib/utils";

const EMPTY = emptyState();
type Save = (s: LearnState) => Promise<unknown>;

const ICON: Record<ReviseKind, LucideIcon> = {
  review: RotateCcw,
  retest: ListChecks,
  coach: GraduationCap,
  lab: FlaskConical,
  "weak-test": NotebookPen,
  refresh: BookOpen,
};

const DAY_LETTER = ["S", "M", "T", "W", "T", "F", "S"];

function Week({ week }: { week: RevisionPlan["week"] }) {
  const active = week.days.filter((d) => d.active).length;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border-2 border-foreground bg-card px-4 py-3">
      <ol className="flex gap-1.5" aria-label={`Active ${active} of the last 7 days`}>
        {week.days.map((d, i) => (
          <li key={d.day} className="flex flex-col items-center gap-0.5" aria-hidden>
            <span className={cn("size-3.5 rounded-full border-2 border-foreground", d.active ? "bg-primary" : "bg-background", i === week.days.length - 1 && "ring-2 ring-foreground/30 ring-offset-1 ring-offset-card")} />
            <span className="font-mono text-[10px] leading-none text-muted-foreground">{DAY_LETTER[new Date(`${d.day}T00:00:00Z`).getUTCDay()]}</span>
          </li>
        ))}
      </ol>
      <p className="text-sm">
        <span className="font-bold tabular-nums">{week.modules}</span> {week.modules === 1 ? "module" : "modules"} studied this week
      </p>
    </div>
  );
}

function ItemCard({ item, n, lead }: { item: ReviseItem; n: number; lead: boolean }) {
  const Icon = ICON[item.kind];
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-2xl border-2 border-foreground p-4 transition-transform active:translate-y-0.5 sm:gap-4",
        lead ? "btn-sweep bg-primary text-primary-foreground hard-shadow-md" : "bg-card hover:-translate-y-0.5 hover:hard-shadow-sm",
      )}
    >
      <span className="hidden w-6 shrink-0 font-mono text-sm font-semibold tabular-nums sm:block" aria-hidden>
        {String(n).padStart(2, "0")}
      </span>
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl border-2 border-foreground", lead ? "bg-card text-foreground" : "bg-background")}>
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold leading-tight [overflow-wrap:anywhere]">{item.title}</span>
        <span className={cn("mt-0.5 block text-sm leading-snug", lead ? "opacity-85" : "text-muted-foreground")}>{item.why}</span>
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold tabular-nums sm:hidden">
          <Clock className="size-3.5" aria-hidden /> {item.minutes} min
        </span>
      </span>
      <span className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
        <span className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums">
          <Clock className="size-3.5" aria-hidden /> {item.minutes} min
        </span>
        <span className={cn("inline-flex items-center gap-1 rounded-full border-2 border-foreground px-3 py-1 text-sm font-bold", lead ? "bg-foreground text-background" : "bg-background")}>
          Start <ArrowRight className="size-3.5" aria-hidden />
        </span>
      </span>
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-full border-2 border-foreground sm:hidden", lead ? "bg-foreground text-background" : "bg-background")}>
        <ArrowRight className="size-4" aria-hidden />
        <span className="sr-only">Start</span>
      </span>
    </Link>
  );
}

function Later({ items }: { items: RevisionPlan["later"] }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="later" className="rounded-2xl border-2 border-dashed border-foreground/50 p-4">
      <h2 id="later" className="font-bold">
        Later this week
      </h2>
      <ul className="mt-2 divide-y divide-foreground/15">
        {items.map((l) => (
          <li key={l.id}>
            <Link href={l.href} className="flex min-h-11 items-center gap-3 py-2 text-sm hover:underline">
              <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                <span className="shrink-0 font-mono text-xs text-link sm:w-36">{l.when}</span>
                <span className="min-w-0 [overflow-wrap:anywhere]">{l.title}</span>
              </span>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{l.minutes} min</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Empty({ title, text, href, cta, mood }: { title: string; text: string; href: string; cta: string; mood: "happy" | "sleep" }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-foreground bg-card px-5 py-8 text-center hard-shadow-sm">
      <Chai mood={mood} size={80} />
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{text}</p>
      <Link href={href} className="mt-1 inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-foreground bg-primary px-5 py-2 font-bold text-primary-foreground hard-shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0.5">
        {cta} <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}

/** The plan as a view, without the store (also used by the visual harness). */
export function ReviseView({ plan }: { plan: RevisionPlan }) {
  const n = plan.today.length;
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 lg:py-10">
      <Link href="/prep/smart" className="inline-flex min-h-11 items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-sm font-bold">
        <ArrowLeft className="size-4" aria-hidden /> Smart practice
      </Link>

      <header>
        <p className="text-eyebrow text-link">Revise</p>
        <h1 className="text-h1">
          {plan.status === "ready" ? (
            <>
              Today: {n} {n === 1 ? "thing" : "things"}, <span className="whitespace-nowrap">about {plan.minutes} minutes</span>
            </>
          ) : plan.status === "clear" ? (
            "All caught up"
          ) : (
            "Your revision list"
          )}
        </h1>
        {plan.status === "ready" ? <p className="mt-1 text-sm text-muted-foreground">Picked from what you missed and what is due. Top one first.</p> : null}
      </header>

      {plan.status !== "new" ? <Week week={plan.week} /> : null}

      {plan.status === "ready" ? (
        <ol className="space-y-3" aria-label="Revise today">
          {plan.today.map((item, i) => (
            <li key={item.id}>
              <ItemCard item={item} n={i + 1} lead={i === 0} />
            </li>
          ))}
        </ol>
      ) : plan.status === "clear" ? (
        <Empty mood="happy" title="Nothing due today" text="You are on top of it. New things to revise show up here on the right day." href="/games" cta="Play a game" />
      ) : (
        <Empty mood="sleep" title="Nothing to revise yet" text="Read a module in Notes first. Revise picks it up from there." href="/study" cta="Open Notes" />
      )}

      <Later items={plan.later} />
    </div>
  );
}

/** /prep/smart/revise: what to revisit today. */
export function ReviseHome({ modules, serverState, save, lab }: { modules: ReviseModule[]; serverState: LearnState | null; save: Save; lab: boolean }) {
  initLearnStore(serverState, save);
  const st = useLearnState(serverState ?? EMPTY);
  const plan = buildRevisionPlan(st, istToday(), modules, { lab });
  return <ReviseView plan={plan} />;
}
