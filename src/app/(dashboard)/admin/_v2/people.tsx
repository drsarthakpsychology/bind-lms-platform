"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { STAGES, STAGE_LABEL, nowMs, type Person, type StageId } from "@/lib/crm/people";
import { presenceOf } from "@/lib/people/presence";
import { cn } from "@/lib/utils";
import { setStage } from "../people/actions";
import { VIEWS, matches, pickLayout, readLayout, subscribeLayout, type ViewId } from "../people/people-view";
import { Empty, RowLink, Rows, Status, btn, control, nameLink, table, type Tone } from "./kit";

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short" }) : "");

const STAGE_TONE: Partial<Record<StageId, Tone>> = { joined: "ok", new: "info", not_interested: "quiet", no_reply: "quiet" };
const stageTone = (s: StageId): Tone => STAGE_TONE[s] ?? "warn";

/** What has happened with this person, in words (emails, reply, follow-up, last seen). */
function signals(p: Person): { text: string; late: boolean } {
  const parts: string[] = [];
  if (p.isStudent) {
    const pr = presenceOf(p.lastSeen, nowMs());
    if (pr === "now") parts.push("On VIBHA now");
    else if (pr === "today") parts.push("Seen today");
    else if (pr === "week") parts.push("Seen this week");
  }
  if (p.emailsSent > 0) parts.push(`${p.emailsSent} email${p.emailsSent === 1 ? "" : "s"}${p.opened ? ", opened" : ""}`);
  if (p.replied) parts.push("Replied");
  const late = Boolean(p.followUpAt && new Date(p.followUpAt).getTime() < nowMs());
  if (p.followUpAt) parts.push(`Follow up ${fmt(p.followUpAt)}`);
  return { text: parts.join(" · "), late };
}

/**
 * Pipeline (v2). One purpose: who to contact next. One filter bar (search, a
 * view, table or board), a real table on desktop, rows on phones. The board
 * keeps one column per stage with the same "move to" control as before.
 */
export function PeopleV2({ people, initialView = "all" }: { people: Person[]; initialView?: string }) {
  const layout = React.useSyncExternalStore(subscribeLayout, readLayout, () => "table" as const);
  const [view, setView] = React.useState<ViewId>(VIEWS.some((x) => x.id === initialView) ? (initialView as ViewId) : "all");
  const [q, setQ] = React.useState("");
  const query = q.trim().toLowerCase();
  const shown = people.filter((p) => matches(p, view) && (!query || `${p.name} ${p.email} ${p.phone ?? ""}`.toLowerCase().includes(query)));
  const counts = Object.fromEntries(VIEWS.map((v) => [v.id, people.filter((p) => matches(p, v.id)).length])) as Record<ViewId, number>;

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <label className="relative block min-w-0 flex-1 basis-56">
          <span className="sr-only">Search people</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email or phone" className={cn(control, "w-full pr-11 pl-9")} />
          {q ? (
            <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute top-1/2 right-0 flex size-11 -translate-y-1/2 items-center justify-center rounded-md outline-none hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring lg:size-9">
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </label>
        <label className="min-w-0 flex-1 basis-44 sm:flex-none">
          <span className="sr-only">View</span>
          <select value={view} onChange={(e) => setView(e.target.value as ViewId)} className={cn(control, "w-full")}>
            {VIEWS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label} ({counts[v.id]})
              </option>
            ))}
          </select>
        </label>
        <div role="group" aria-label="Layout" className="hidden shrink-0 gap-1 lg:flex">
          {(["table", "board"] as const).map((l) => (
            <button key={l} type="button" aria-pressed={layout === l} onClick={() => pickLayout(l)} className={cn(btn.ghost, layout === l ? "bg-[var(--ds-tint)] text-foreground" : "text-muted-foreground")}>
              {l === "table" ? "Table" : "Board"}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <Empty>Nobody here. Try another view, or clear the search.</Empty>
      ) : (
        <>
          {layout === "board" ? <Board people={shown} /> : <PeopleTable people={shown} />}
          <Rows className={layout === "board" ? "lg:hidden" : "md:hidden"}>
            {shown.map((p) => {
              const s = signals(p);
              return (
                <RowLink
                  key={p.email}
                  href={`/admin/people/${p.key}`}
                  title={p.name}
                  meta={
                    <>
                      <span className="block">{p.email}</span>
                      {s.text ? <span className={cn("block", s.late && "text-status-alert-fg")}>{s.text}</span> : null}
                    </>
                  }
                  end={<Status tone={stageTone(p.stage)}>{STAGE_LABEL[p.stage]}</Status>}
                />
              );
            })}
          </Rows>
        </>
      )}
    </div>
  );
}

function PeopleTable({ people }: { people: Person[] }) {
  return (
    <table className={cn(table.root, "hidden md:table")}>
      <thead>
        <tr>
          <th scope="col" className={table.th}>Name</th>
          <th scope="col" className={table.th}>Stage</th>
          <th scope="col" className={table.th}>What has happened</th>
          <th scope="col" className={table.th}>Last contact</th>
        </tr>
      </thead>
      <tbody>
        {people.map((p) => {
          const s = signals(p);
          return (
            <tr key={p.email} className={table.tr}>
              <td className={table.td}>
                <Link href={`/admin/people/${p.key}`} className={nameLink}>{p.name}</Link>
                <span className="block text-muted-foreground [overflow-wrap:anywhere]">{p.email}</span>
              </td>
              <td className={cn(table.td, "whitespace-nowrap")}><Status tone={stageTone(p.stage)}>{STAGE_LABEL[p.stage]}</Status></td>
              <td className={cn(table.td, s.late ? "text-status-alert-fg" : "text-muted-foreground")}>{s.text || "Nothing yet"}</td>
              <td className={cn(table.td, "whitespace-nowrap text-muted-foreground")}>{p.lastContactAt ? fmt(p.lastContactAt) : "Never contacted"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function Board({ people }: { people: Person[] }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState<string | null>(null);
  const move = async (email: string, stage: string) => {
    setBusy(email);
    await setStage(email, stage);
    setBusy(null);
    router.refresh();
  };
  return (
    <div className="hidden w-full max-w-full min-w-0 overflow-x-auto pb-3 [contain:inline-size] lg:block" tabIndex={0} role="region" aria-label="Board, one column per stage">
      <div className="flex w-max gap-6">
        {STAGES.map((s) => {
          const col = people.filter((p) => p.stage === s.id);
          return (
            <section key={s.id} aria-label={s.label} className="flex w-64 shrink-0 flex-col">
              <h2 className="flex items-baseline justify-between border-b border-[var(--ds-card-line)] pb-2 type-small font-semibold">
                {s.label}
                <span className="type-caption type-num text-muted-foreground">{col.length}</span>
              </h2>
              <ul className="flex max-h-[65vh] flex-col divide-y divide-[var(--ds-hairline)] overflow-y-auto">
                {col.map((p) => {
                  const sig = signals(p);
                  return (
                    <li key={p.email} className={cn("flex min-w-0 flex-col gap-1.5 py-2.5", busy === p.email && "opacity-60")}>
                      <Link href={`/admin/people/${p.key}`} className={cn(nameLink, "type-small")}>{p.name}</Link>
                      <span className="type-caption text-muted-foreground [overflow-wrap:anywhere]">{p.email}</span>
                      {sig.text ? <span className={cn("type-caption", sig.late ? "text-status-alert-fg" : "text-muted-foreground")}>{sig.text}</span> : null}
                      <label className="sr-only" htmlFor={`stage-${p.key}`}>Move {p.name}</label>
                      <select id={`stage-${p.key}`} value={p.stage} onChange={(e) => move(p.email, e.target.value)} className={cn(control, "w-full")}>
                        {STAGES.map((o) => (
                          <option key={o.id} value={o.id}>{o.label}</option>
                        ))}
                      </select>
                    </li>
                  );
                })}
                {!col.length ? <li className="py-2.5 type-caption text-muted-foreground">Nobody</li> : null}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
