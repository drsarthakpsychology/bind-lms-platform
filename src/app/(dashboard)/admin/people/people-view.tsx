"use client";

import * as React from "react";
import { presenceOf } from "@/lib/people/presence";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock, KanbanSquare, MailOpen, MessageCircle, Reply, Rows3, Search, X } from "lucide-react";

import { STAGES, STAGE_LABEL, nowMs, type Person, type StageId } from "@/lib/crm/people";
import { setStage } from "./actions";
import { cn } from "@/lib/utils";

const VIEWS = [
  { id: "all", label: "Everyone" },
  { id: "not-contacted", label: "Not contacted" },
  { id: "follow-up", label: "Follow-up due" },
  { id: "no-reply", label: "No reply" },
  { id: "enquiries", label: "Enquiries" },
  { id: "students", label: "Students" },
  { id: "active-now", label: "Active now" },
  { id: "not-set-up", label: "Login not set up" },
] as const;
type ViewId = (typeof VIEWS)[number]["id"];

function matches(p: Person, v: ViewId): boolean {
  const soon = Date.now() + 86400000;
  switch (v) {
    case "not-contacted": return !p.contacted && !p.isStudent;
    case "follow-up": return Boolean(p.followUpAt && new Date(p.followUpAt).getTime() <= soon);
    case "no-reply": return p.contacted && !p.replied && !p.isStudent && p.stage !== "not_interested";
    case "enquiries": return p.isEnquiry && !p.isStudent;
    case "students": return p.isStudent;
    case "active-now": return p.isStudent && presenceOf(p.lastSeen, Date.now()) === "now";
    case "not-set-up": return p.isStudent && !p.setupDone;
    default: return true;
  }
}

const LAYOUT_KEY = "vibha-people-layout";
const layoutListeners = new Set<() => void>();
function subscribeLayout(fn: () => void) {
  layoutListeners.add(fn);
  return () => layoutListeners.delete(fn);
}
function readLayout(): "board" | "table" {
  try {
    return window.localStorage.getItem(LAYOUT_KEY) === "board" ? "board" : "table";
  } catch {
    return "table";
  }
}

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short" }) : "—";

/**
 * The CRM list — saved views as chips, search, and two layouts people know
 * from Pipedrive / Attio: a Board (one column per stage) and a Table.
 * Each person opens their own page with the full timeline.
 */
export function PeopleView({ people, initialView = "all" }: { people: Person[]; initialView?: string }) {
  const layout = React.useSyncExternalStore(subscribeLayout, readLayout, () => "table" as const);
  const [view, setView] = React.useState<ViewId>(VIEWS.some((x) => x.id === initialView) ? (initialView as ViewId) : "all");
  const [q, setQ] = React.useState("");
  const pick = (l: "board" | "table") => {
    try {
      window.localStorage.setItem(LAYOUT_KEY, l);
    } catch {
      /* fine */
    }
    layoutListeners.forEach((fn) => fn());
  };

  const query = q.trim().toLowerCase();
  const shown = people.filter(
    (p) => matches(p, view) && (!query || `${p.name} ${p.email} ${p.phone ?? ""}`.toLowerCase().includes(query)),
  );
  const counts = Object.fromEntries(VIEWS.map((v) => [v.id, people.filter((p) => matches(p, v.id)).length])) as Record<ViewId, number>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Search people</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email or phone"
            className="h-11 w-full rounded-full border-2 border-foreground bg-card pr-10 pl-11 text-base outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 md:text-sm"
          />
          {q ? (
            <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full hover:bg-accent">
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </label>
        <div role="group" aria-label="Layout" className="inline-flex shrink-0 rounded-full border-2 border-foreground bg-card p-1">
          {(["table", "board"] as const).map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={layout === l}
              onClick={() => pick(l)}
              className={cn("inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-bold", layout === l ? "bg-brand text-brand-foreground" : "text-muted-foreground")}
            >
              {l === "table" ? <Rows3 className="size-4" aria-hidden /> : <KanbanSquare className="size-4" aria-hidden />}
              {l === "table" ? "Table" : "Board"}
            </button>
          ))}
        </div>
      </div>

      <div role="group" aria-label="Views" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={view === v.id}
            onClick={() => setView(v.id)}
            className={cn(
              "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border-2 border-foreground px-3.5 text-sm font-bold transition-[transform,box-shadow] duration-fast hover:-translate-y-px hover:hard-shadow-xs",
              view === v.id ? "bg-[#111111] text-primary dark:bg-white dark:text-[#111111]" : "bg-card",
            )}
          >
            {v.label}
            <span className="font-pix text-[0.65rem] opacity-80">{counts[v.id]}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-foreground/30 p-8 text-center text-sm font-semibold text-muted-foreground">
          Nobody here. Try another view, or clear the search.
        </p>
      ) : layout === "table" ? (
        <PeopleTable people={shown} />
      ) : (
        <PeopleBoard people={shown} />
      )}
    </div>
  );
}

function SeenChip({ at }: { at: string | null }) {
  const pr = presenceOf(at, nowMs());
  if (pr === "now")
    return (
      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border-2 border-foreground bg-primary px-1.5 text-[0.7rem] font-bold text-primary-foreground">
        <span className="size-1.5 animate-pulse rounded-full bg-foreground" aria-hidden /> Active now
      </span>
    );
  if (pr === "today") return <span className="whitespace-nowrap text-[0.7rem] font-bold text-foreground">Seen today</span>;
  if (pr === "week") return <span className="whitespace-nowrap text-[0.7rem] font-semibold">Seen this week</span>;
  return null;
}

function Signals({ p }: { p: Person }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      {p.isStudent ? <SeenChip at={p.lastSeen} /> : null}
      {p.emailsSent > 0 ? (
        <span title={`${p.emailsSent} email${p.emailsSent === 1 ? "" : "s"} sent${p.opened ? ", opened" : ""}`} className={cn("inline-flex items-center gap-0.5", p.opened && "text-link")}>
          <MailOpen className="size-3.5" aria-hidden />
          <span className="text-caption font-bold">{p.emailsSent}</span>
        </span>
      ) : null}
      {p.replied ? (
        <span title="Replied" className="text-foreground">
          <Reply className="size-3.5" aria-hidden />
        </span>
      ) : null}
      {p.followUpAt ? (
        <span title={`Follow up ${fmt(p.followUpAt)}`} className={cn("inline-flex items-center gap-0.5", new Date(p.followUpAt).getTime() < nowMs() && "text-destructive")}>
          <CalendarClock className="size-3.5" aria-hidden />
          <span className="text-caption font-bold">{fmt(p.followUpAt)}</span>
        </span>
      ) : null}
    </span>
  );
}

function StageChip({ stage }: { stage: StageId }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full border-2 px-2 text-[0.7rem] font-bold whitespace-nowrap",
        stage === "joined" ? "border-foreground bg-primary text-primary-foreground" : stage === "new" ? "border-foreground bg-brand text-brand-foreground" : stage === "not_interested" || stage === "no_reply" ? "border-foreground/30 bg-muted" : "border-foreground bg-card",
      )}
    >
      {STAGE_LABEL[stage]}
    </span>
  );
}

function PeopleTable({ people }: { people: Person[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-foreground bg-card">
      <ul className="divide-y-2 divide-foreground/10">
        {people.map((p) => (
          <li key={p.email}>
            <Link
              href={`/admin/people/${p.key}`}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-3 py-2.5 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none md:grid-cols-[2.5rem_minmax(0,1.4fr)_9rem_minmax(0,1fr)_6rem]"
            >
              <span aria-hidden className="flex size-9 items-center justify-center rounded-full border-2 border-foreground bg-primary font-pix text-xs text-primary-foreground">
                {p.name[0]?.toUpperCase() ?? "?"}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{p.name}</span>
                <span className="block truncate text-caption text-muted-foreground">{p.email}</span>
              </span>
              <span className="justify-self-end md:justify-self-start">
                <StageChip stage={p.stage} />
              </span>
              <span className="col-start-2 md:col-start-auto">
                <Signals p={p} />
              </span>
              <span className="hidden text-caption text-muted-foreground md:block">{p.lastContactAt ? `Last ${fmt(p.lastContactAt)}` : "Never contacted"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PeopleBoard({ people }: { people: Person[] }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState<string | null>(null);
  const move = async (email: string, stage: string) => {
    setBusy(email);
    await setStage(email, stage);
    setBusy(null);
    router.refresh();
  };
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
      <div className="flex w-max gap-3">
        {STAGES.map((s) => {
          const col = people.filter((p) => p.stage === s.id);
          return (
            <section key={s.id} aria-label={s.label} className="flex w-72 shrink-0 flex-col rounded-2xl border-2 border-foreground bg-muted">
              <h2 className="flex items-center justify-between border-b-2 border-foreground px-3 py-2 text-sm font-black">
                {s.label}
                <span className="rounded-full border-2 border-foreground bg-card px-2 font-pix text-[0.6rem]">{col.length}</span>
              </h2>
              <ul className="flex max-h-[65vh] flex-col gap-2 overflow-y-auto p-2">
                {col.map((p) => (
                  <li key={p.email} className={cn("rounded-xl border-2 border-foreground bg-card p-2.5 transition-shadow hover:hard-shadow-sm", busy === p.email && "opacity-60")}>
                    <Link href={`/admin/people/${p.key}`} className="block">
                      <span className="block truncate text-sm font-bold">{p.name}</span>
                      <span className="block truncate text-caption text-muted-foreground">{p.email}</span>
                    </Link>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <Signals p={p} />
                      <label className="sr-only" htmlFor={`stage-${p.key}`}>Move {p.name}</label>
                      <select
                        id={`stage-${p.key}`}
                        value={p.stage}
                        onChange={(e) => move(p.email, e.target.value)}
                        className="h-7 max-w-28 rounded-full border-2 border-foreground bg-card px-2 text-[0.7rem] font-bold"
                      >
                        {STAGES.map((o) => (
                          <option key={o.id} value={o.id}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    {p.phone ? (
                      <a href={`https://wa.me/${p.phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-caption font-bold text-link">
                        <MessageCircle className="size-3.5" aria-hidden /> WhatsApp
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
