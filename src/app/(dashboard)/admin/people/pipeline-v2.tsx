"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail, MessageCircle, MoreHorizontal, Search, SlidersHorizontal, X } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { STAGES, STAGE_LABEL, isStage, nowMs, type Person, type StageId } from "@/lib/crm/people";
import {
  LAST_CONTACT_LABEL,
  QUICK_VIEWS,
  QUIET_DAYS,
  filterPipeline,
  hasJoined,
  isQuickView,
  sourceOf,
  sourcesOf,
  viewCounts,
  waLink,
  waMessage,
  type LastContact,
  type PipelineFilters,
  type QuickView,
} from "@/lib/crm/views";
import { cn } from "@/lib/utils";
import { Empty, Notice, RowItem, Rows, Status, btn, control, nameLink, table, type Tone } from "../_v2/kit";
import { EmailCompose, type Allowance } from "../forms/email-compose";
import { emailPeople, logActivity, logWhatsApp, markPaid, sendInvite, sendWaitingPeopleEmails, setStage } from "./actions";

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short" }) : "");
const STAGE_TONE: Partial<Record<StageId, Tone>> = { joined: "ok", new: "info", not_interested: "quiet", no_reply: "quiet" };
const stageTone = (s: StageId): Tone => STAGE_TONE[s] ?? "warn";
const PAGE = 100;

export type PipelineInitial = {
  view: string;
  quiet: string;
  q: string;
  stage: string;
  cohort: string;
  source: string;
  from: string;
  to: string;
  last: string;
  /** "1": follow-ups due only. */
  due: string;
};

type State = Required<Omit<PipelineFilters, "stage" | "lastContact" | "view">> & { view: QuickView; stage: StageId | ""; lastContact: LastContact };

function toState(i: Partial<PipelineInitial>): State {
  const quiet = Number(i.quiet);
  return {
    view: isQuickView(i.view) ? i.view : "all",
    quietDays: (QUIET_DAYS as readonly number[]).includes(quiet) ? quiet : 14,
    q: i.q ?? "",
    stage: i.stage && isStage(i.stage) ? i.stage : "",
    cohortId: i.cohort ?? "",
    source: i.source ?? "",
    from: /^\d{4}-\d{2}-\d{2}$/.test(i.from ?? "") ? (i.from as string) : "",
    to: /^\d{4}-\d{2}-\d{2}$/.test(i.to ?? "") ? (i.to as string) : "",
    lastContact: (["week", "month", "older", "never"] as const).includes(i.last as Exclude<LastContact, "">) ? (i.last as LastContact) : "",
    // Admin Today links here with the old view name (?view=follow-up).
    due: i.due === "1" || i.view === "follow-up",
  };
}

/** Keep the view and filters in the address (no reload), so a view can be bookmarked or shared. */
function writeUrl(s: State) {
  try {
    const p = new URLSearchParams();
    if (s.view !== "all") p.set("view", s.view);
    if (s.view === "quiet" && s.quietDays !== 14) p.set("quiet", String(s.quietDays));
    if (s.q) p.set("q", s.q);
    if (s.stage) p.set("stage", s.stage);
    if (s.cohortId) p.set("cohort", s.cohortId);
    if (s.source) p.set("source", s.source);
    if (s.from) p.set("from", s.from);
    if (s.to) p.set("to", s.to);
    if (s.lastContact) p.set("last", s.lastContact);
    if (s.due) p.set("due", "1");
    const q = p.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${q ? `?${q}` : ""}`);
  } catch {
    /* fine */
  }
}

/** What has happened with this person, in words. */
function signals(p: Person): { text: string; late: boolean } {
  const parts: string[] = [];
  if (p.isStudent) parts.push(hasJoined(p) ? "Set up their login" : p.inviteSentAt ? `Invited ${fmt(p.inviteSentAt)}, not set up` : "Account, no invite yet");
  if (p.emailsSent > 0) parts.push(`${p.emailsSent} email${p.emailsSent === 1 ? "" : "s"}${p.opened ? ", opened" : ""}`);
  if (p.replied) parts.push("Replied");
  const late = Boolean(p.followUpAt && new Date(p.followUpAt).getTime() < nowMs());
  if (p.followUpAt) parts.push(`Follow up ${fmt(p.followUpAt)}`);
  // The no-break space keeps each · on the line of the words before it.
  return { text: parts.join("\u00a0· "), late };
}

function PaidLine({ p, ready }: { p: Person; ready: boolean }) {
  if (p.paidAt) return <Status tone="ok">{`Paid ${fmt(p.paidAt)}${p.paidAmount != null ? ` · ₹${p.paidAmount.toLocaleString("en-IN")}` : ""}`}</Status>;
  return <span className="text-muted-foreground">{ready ? "Not paid" : "Not recorded"}</span>;
}

/**
 * Pipeline (v2): who to connect with next. Quick views with counts (Not paid
 * yet, Invited not joined, Enquired not converted, Went quiet, Joined), one
 * filter bar, a table on desktop and rows on phones, quick actions per person,
 * and email or WhatsApp for a picked group.
 */
export function PipelineV2({
  people,
  cohorts,
  initial,
  canWrite,
  paymentReady,
  allowance,
  waiting,
  scope = "all",
}: {
  people: Person[];
  cohorts: Array<{ id: string; name: string }>;
  initial: Partial<PipelineInitial>;
  canWrite: boolean;
  paymentReady: boolean;
  allowance: Allowance;
  waiting: number;
  /** "enquiries": the public form's people only, with their message. */
  scope?: "all" | "enquiries";
}) {
  const router = useRouter();
  const [s, setS] = React.useState<State>(() => toState(initial));
  const [now] = React.useState(() => nowMs());
  const [filtersOpen, setFiltersOpen] = React.useState(() => Boolean(initial.stage || initial.cohort || initial.source || initial.from || initial.to || initial.last || initial.due === "1" || initial.view === "follow-up"));
  const [limit, setLimit] = React.useState(PAGE);
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set());
  const [compose, setCompose] = React.useState<string[] | null>(null);
  const [wa, setWa] = React.useState<string[] | null>(null);
  const [draining, setDraining] = React.useState(false);
  const [drainNote, setDrainNote] = React.useState<string | null>(null);

  const set = (patch: Partial<State>) => {
    const next = { ...s, ...patch };
    setS(next);
    setLimit(PAGE);
    writeUrl(next);
  };

  // The chosen quick view can sit past the edge on a phone (Enquiries opens on
  // the fourth one): scroll the row so it is always in sight.
  const viewsRef = React.useRef<HTMLUListElement>(null);
  React.useEffect(() => {
    const ul = viewsRef.current;
    const on = ul?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!ul || !on) return;
    const left = on.offsetLeft - ul.offsetLeft;
    if (left < ul.scrollLeft || left + on.offsetWidth > ul.scrollLeft + ul.clientWidth) ul.scrollLeft = Math.max(0, left - 16);
  }, [s.view]);

  const base = React.useMemo(() => (scope === "enquiries" ? people.filter((p) => p.isEnquiry) : people), [people, scope]);
  const shown = React.useMemo(() => filterPipeline(base, s, now), [base, s, now]);
  const counts = React.useMemo(() => viewCounts(base, s, now), [base, s, now]);
  const sources = React.useMemo(() => sourcesOf(base), [base]);
  const byEmail = React.useMemo(() => new Map(base.map((p) => [p.email, p])), [base]);
  const slice = shown.slice(0, limit);
  const otherFilters = Boolean(s.stage || s.cohortId || s.source || s.from || s.to || s.lastContact || s.due);
  const filtering = otherFilters || Boolean(s.q);
  const allShownPicked = shown.length > 0 && shown.every((p) => selected.has(p.email));

  const toggle = (email: string) =>
    setSelected((cur) => {
      const n = new Set(cur);
      if (n.has(email)) n.delete(email);
      else n.add(email);
      return n;
    });
  const pickAll = () => setSelected(allShownPicked ? new Set() : new Set(shown.map((p) => p.email)));
  const groupOf = (emails: string[]) => emails.map((e) => byEmail.get(e)).filter((p): p is Person => Boolean(p));

  return (
    <div className={cn("flex min-w-0 flex-col gap-4", selected.size > 0 && "pb-24 md:pb-0")}>
      {waiting > 0 ? (
        <Notice className="flex-wrap items-center justify-between">
          <span className="min-w-0">
            <span className="font-semibold type-num">{waiting}</span> pipeline email{waiting === 1 ? " is" : "s are"} waiting for today&apos;s allowance.
            {drainNote ? <span className="ml-2" role="status">{drainNote}</span> : null}
          </span>
          {canWrite ? (
            <button
              type="button"
              className={btn.quiet}
              disabled={draining || !allowance.configured}
              onClick={async () => {
                setDraining(true);
                const r = await sendWaitingPeopleEmails().catch(() => ({ error: "Couldn't reach the server.", sent: 0, failed: 0, left: waiting }));
                setDraining(false);
                setDrainNote(r.error ? r.error : r.sent ? `${r.sent} sent${r.left ? `, ${r.left} still waiting` : ""}.` : "Today's allowance is used up. Try tomorrow.");
                router.refresh();
              }}
            >
              {draining ? <Loader2 className="animate-spin" aria-hidden /> : null} Send waiting emails
            </button>
          ) : null}
        </Notice>
      ) : null}

      {/* Quick views: each one answers "who do I connect with?" */}
      <nav aria-label="Quick views" className="min-w-0 border-b border-[var(--ds-hairline)]">
        <ul ref={viewsRef} className="-mb-px flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {QUICK_VIEWS.map((v) => (
            <li key={v.id} className="shrink-0">
              <button
                type="button"
                aria-pressed={s.view === v.id}
                onClick={() => {
                  set({ view: v.id });
                  setSelected(new Set());
                }}
                className={cn(
                  "inline-flex h-11 min-w-11 items-center justify-center gap-1.5 border-b-2 px-3 type-small font-semibold whitespace-nowrap outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] focus-visible:ring-2 focus-visible:ring-ring",
                  s.view === v.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {v.label}
                <span className="type-caption type-num text-muted-foreground">{counts[v.id]}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <label className="relative block min-w-0 flex-1 basis-56">
          <span className="sr-only">Search people</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input type="search" value={s.q} onChange={(e) => set({ q: e.target.value })} placeholder="Name, email, phone or college" className={cn(control, "w-full pr-11 pl-9")} />
          {s.q ? (
            <button type="button" onClick={() => set({ q: "" })} aria-label="Clear search" className="absolute top-1/2 right-0 flex size-11 -translate-y-1/2 items-center justify-center rounded-md outline-none hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring lg:size-9">
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </label>
        {s.view === "quiet" ? (
          <label className="min-w-0 flex-1 basis-44 sm:flex-none">
            <span className="sr-only">No contact for</span>
            <select value={s.quietDays} onChange={(e) => set({ quietDays: Number(e.target.value) })} className={cn(control, "w-full")}>
              {QUIET_DAYS.map((d) => (
                <option key={d} value={d}>
                  No contact in {d} days
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <button type="button" aria-expanded={filtersOpen} aria-controls="pipeline-filters" onClick={() => setFiltersOpen((o) => !o)} className={cn(btn.quiet, otherFilters && "border-foreground")}>
          <SlidersHorizontal aria-hidden /> Filters{otherFilters ? " (on)" : ""}
        </button>
      </div>

      <div id="pipeline-filters" hidden={!filtersOpen} className="min-w-0">
        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect label="Stage" value={s.stage} onChange={(v) => set({ stage: v as StageId | "" })} options={[{ v: "", l: "Any stage" }, ...STAGES.map((x) => ({ v: x.id, l: x.label }))]} />
          <FilterSelect label="Cohort" value={s.cohortId} onChange={(v) => set({ cohortId: v })} options={[{ v: "", l: "Any cohort" }, ...cohorts.map((c) => ({ v: c.id, l: c.name }))]} />
          <FilterSelect label="Source" value={s.source} onChange={(v) => set({ source: v })} options={[{ v: "", l: "Any source" }, ...sources.map((x) => ({ v: x, l: x }))]} />
          <FilterSelect
            label="Last contact"
            value={s.lastContact}
            onChange={(v) => set({ lastContact: v as LastContact })}
            options={[{ v: "", l: "Any time" }, ...(Object.keys(LAST_CONTACT_LABEL) as Array<Exclude<LastContact, "">>).map((k) => ({ v: k, l: LAST_CONTACT_LABEL[k] }))]}
          />
          <FilterSelect label="Follow-up" value={s.due ? "1" : ""} onChange={(v) => set({ due: v === "1" })} options={[{ v: "", l: "Any" }, { v: "1", l: "Due now" }]} />
          <label className="flex min-w-0 flex-col gap-1">
            <span className="type-caption font-semibold text-muted-foreground">First seen from</span>
            <input type="date" value={s.from} max={s.to || undefined} onChange={(e) => set({ from: e.target.value })} className={cn(control, "w-full")} />
          </label>
          <label className="flex min-w-0 flex-col gap-1">
            <span className="type-caption font-semibold text-muted-foreground">to</span>
            <input type="date" value={s.to} min={s.from || undefined} onChange={(e) => set({ to: e.target.value })} className={cn(control, "w-full")} />
          </label>
        </div>
      </div>

      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="type-small text-muted-foreground type-num" aria-live="polite">
          {shown.length} {shown.length === 1 ? "person" : "people"}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {canWrite && shown.length ? (
            <button type="button" className={btn.ghost} onClick={pickAll}>
              {allShownPicked ? "Unpick all" : `Pick all ${shown.length}`}
            </button>
          ) : null}
          {filtering ? (
            <button type="button" className={btn.ghost} onClick={() => set({ q: "", stage: "", cohortId: "", source: "", from: "", to: "", lastContact: "", due: false })}>
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      {shown.length === 0 ? (
        <Empty>{filtering || s.view !== "all" ? "Nobody here. Try another view, or clear the filters." : "Nobody in the pipeline yet."}</Empty>
      ) : (
        <>
          <table className={cn(table.root, "hidden md:table")}>
            <thead>
              <tr>
                {canWrite ? (
                  <th scope="col" className={cn(table.th, "w-11")}>
                    <span className="sr-only">Pick</span>
                  </th>
                ) : null}
                <th scope="col" className={cn(table.th, "w-[28%]")}>Name</th>
                <th scope="col" className={table.th}>Stage</th>
                <th scope="col" className={table.th}>Paid</th>
                <th scope="col" className={cn(table.th, "hidden xl:table-cell")}>What has happened</th>
                <th scope="col" className={cn(table.th, "whitespace-nowrap")}>Last contact</th>
                <th scope="col" className={table.th}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {slice.map((p) => {
                const sig = signals(p);
                const picked = selected.has(p.email);
                return (
                  <tr key={p.email} className={table.tr} aria-selected={picked || undefined}>
                    {canWrite ? (
                      <td className={table.td}>
                        <PickBox checked={picked} onChange={() => toggle(p.email)} label={`Pick ${p.name}`} />
                      </td>
                    ) : null}
                    <td className={table.td}>
                      <Link href={`/admin/people/${p.key}`} className={nameLink}>
                        {p.name}
                      </Link>
                      <span className="block text-muted-foreground [overflow-wrap:anywhere]">{p.email}</span>
                      <span className="block text-muted-foreground [overflow-wrap:anywhere]">
                        {[p.cohorts.map((c) => c.name).join(", "), sourceOf(p)].filter(Boolean).join("\u00a0· ")}
                      </span>
                      {scope === "enquiries" && p.message ? <span className="mt-1 block max-w-[60ch] whitespace-pre-line text-foreground/85 [overflow-wrap:anywhere]">{p.message}</span> : null}
                    </td>
                    <td className={cn(table.td, "whitespace-nowrap")}>
                      <Status tone={stageTone(p.stage)}>{STAGE_LABEL[p.stage]}</Status>
                    </td>
                    <td className={cn(table.td, "whitespace-nowrap")}>
                      <PaidLine p={p} ready={paymentReady} />
                    </td>
                    <td className={cn(table.td, "hidden xl:table-cell", sig.late ? "text-status-alert-fg" : "text-muted-foreground")}>{sig.text || "Nothing yet"}</td>
                    <td className={cn(table.td, "whitespace-nowrap text-muted-foreground")}>{p.lastContactAt ? fmt(p.lastContactAt) : "Never"}</td>
                    <td className={cn(table.td, "w-px")}>
                      <QuickActions p={p} canWrite={canWrite} paymentReady={paymentReady} onEmail={() => setCompose([p.email])} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Rows className="md:hidden" label="People">
            {slice.map((p) => {
              const sig = signals(p);
              return (
                <RowItem key={p.email} className="flex-row items-start gap-2">
                  {canWrite ? <PickBox checked={selected.has(p.email)} onChange={() => toggle(p.email)} label={`Pick ${p.name}`} /> : null}
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <Link href={`/admin/people/${p.key}`} className={cn(nameLink, "inline-flex min-h-11 items-center type-body")}>
                      {p.name}
                    </Link>
                    <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">{p.email}</span>
                    {scope === "enquiries" && p.message ? <span className="type-small whitespace-pre-line [overflow-wrap:anywhere]">{p.message}</span> : null}
                    <span className="mt-1 flex min-w-0 flex-wrap gap-x-4 gap-y-1">
                      <Status tone={stageTone(p.stage)}>{STAGE_LABEL[p.stage]}</Status>
                      <span className="type-small">
                        <PaidLine p={p} ready={paymentReady} />
                      </span>
                    </span>
                    <span className={cn("type-small", sig.late ? "text-status-alert-fg" : "text-muted-foreground")}>
                      {[sig.text, p.lastContactAt ? `Last contact ${fmt(p.lastContactAt)}` : "Never contacted"].filter(Boolean).join("\u00a0· ")}
                    </span>
                  </div>
                  <QuickActions p={p} canWrite={canWrite} paymentReady={paymentReady} onEmail={() => setCompose([p.email])} compact />
                </RowItem>
              );
            })}
          </Rows>
          {shown.length > limit ? (
            <button type="button" className={cn(btn.quiet, "self-start")} onClick={() => setLimit((l) => l + PAGE)}>
              Show {Math.min(PAGE, shown.length - limit)} more
            </button>
          ) : null}
        </>
      )}

      {canWrite && selected.size > 0 ? (
        <div role="region" aria-label="Picked" className="fixed inset-x-0 bottom-[var(--nav-h,0px)] z-30 border-t border-[var(--ds-hairline)] bg-background px-5 py-3 md:sticky md:bottom-0 md:px-0">
          <div className="mx-auto flex max-w-7xl min-w-0 flex-wrap items-center gap-2">
            <p className="min-w-0 flex-1 type-small font-semibold type-num">{selected.size} picked</p>
            <button type="button" className={btn.ghost} onClick={() => setSelected(new Set())}>
              Clear
            </button>
            <button type="button" className={btn.quiet} onClick={() => setWa([...selected])}>
              <MessageCircle aria-hidden /> WhatsApp
            </button>
            <button type="button" className={btn.primary} onClick={() => setCompose([...selected])}>
              <Mail aria-hidden /> Email {selected.size}
            </button>
          </div>
        </div>
      ) : null}

      {compose ? (
        <EmailCompose
          open
          onOpenChange={(o) => {
            if (!o) {
              setCompose(null);
              router.refresh();
            }
          }}
          recipients={groupOf(compose).map((p) => ({ key: p.email, name: p.name, email: p.email }))}
          allowance={allowance}
          onSend={(subject, body, designed) => emailPeople({ emails: compose, subject, body, designed })}
        />
      ) : null}
      {wa ? <WhatsAppLinks people={groupOf(wa)} onClose={() => setWa(null)} /> : null}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: Array<{ v: string; l: string }> }) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="type-caption font-semibold text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={cn(control, "w-full")}>
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </label>
  );
}

function PickBox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="-m-1 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md hover:bg-[var(--ds-tint)] lg:size-9">
      <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} className="size-5 accent-[var(--link)]" />
    </label>
  );
}

type Dlg = null | "note" | "stage" | "paid" | "invite";

/** WhatsApp, email, and (Super Admin) note, stage, invite, paid: one person at a time. */
export function QuickActions({ p, canWrite, paymentReady, onEmail, compact = false, hideContact = false }: { p: Person; canWrite: boolean; paymentReady: boolean; onEmail: () => void; compact?: boolean; /** The record page shows WhatsApp, email and call as labelled buttons already. */ hideContact?: boolean }) {
  const router = useRouter();
  const [dlg, setDlg] = React.useState<Dlg>(null);
  const [busy, setBusy] = React.useState(false);
  const [note, setNote] = React.useState<{ tone: "ok" | "alert"; text: string } | null>(null);
  const [text, setText] = React.useState("");
  const [stage, setStageValue] = React.useState<StageId>(p.stage);
  const [amount, setAmount] = React.useState("");
  const link = waLink(p.phone, waMessage("Hi {first_name}, ", p));

  async function run(fn: () => Promise<{ error: string | null }>, done: string) {
    setBusy(true);
    const r = await fn().catch(() => ({ error: "Couldn't reach the server." }));
    setBusy(false);
    if (r.error) return setNote({ tone: "alert", text: r.error });
    setDlg(null);
    setText("");
    setNote({ tone: "ok", text: done });
    router.refresh();
  }

  return (
    <div className={cn("flex items-center justify-end gap-1", compact && "flex-col items-end")}>
      <div className="flex items-center gap-1">
        {link && !hideContact && !compact ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(btn.ghost, "w-11 px-0 lg:w-9")}
            aria-label={`WhatsApp ${p.name}`}
            onClick={() => {
              if (canWrite) void logWhatsApp([p.email], "Opened WhatsApp");
            }}
          >
            <MessageCircle aria-hidden />
          </a>
        ) : null}
        {canWrite && !hideContact && !compact ? (
          <button type="button" className={cn(btn.ghost, "w-11 px-0 lg:w-9")} aria-label={`Email ${p.name}`} onClick={onEmail}>
            <Mail aria-hidden />
          </button>
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className={cn(btn.ghost, "w-11 px-0 lg:w-9")} aria-label={`More for ${p.name}`} disabled={busy}>
              {busy ? <Loader2 className="animate-spin" aria-hidden /> : <MoreHorizontal aria-hidden />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-52">
            {hideContact ? null : (
              <DropdownMenuItem asChild className="min-h-11 lg:min-h-9">
                <Link href={`/admin/people/${p.key}`}>Open record</Link>
              </DropdownMenuItem>
            )}
            {compact && link ? (
              <DropdownMenuItem asChild className="min-h-11 lg:min-h-9">
                <a href={link} target="_blank" rel="noopener noreferrer" onClick={() => canWrite && void logWhatsApp([p.email], "Opened WhatsApp")}>
                  WhatsApp
                </a>
              </DropdownMenuItem>
            ) : null}
            {compact && canWrite ? (
              <DropdownMenuItem className="min-h-11 lg:min-h-9" onSelect={onEmail}>
                Email
              </DropdownMenuItem>
            ) : null}
            {p.phone && !hideContact ? (
              <DropdownMenuItem asChild className="min-h-11 lg:min-h-9">
                <a href={`tel:${p.phone.replace(/[^\d+]/g, "")}`}>Call</a>
              </DropdownMenuItem>
            ) : null}
            {canWrite ? (
              <>
                {hideContact ? null : <DropdownMenuSeparator />}
                <DropdownMenuItem className="min-h-11 lg:min-h-9" onSelect={() => setDlg("note")}>Add a note</DropdownMenuItem>
                <DropdownMenuItem className="min-h-11 lg:min-h-9" onSelect={() => setDlg("stage")}>Move stage</DropdownMenuItem>
                {!hasJoined(p) ? (
                  <DropdownMenuItem className="min-h-11 lg:min-h-9" onSelect={() => setDlg("invite")}>
                    {p.inviteSentAt ? "Send the invite again" : "Send invite"}
                  </DropdownMenuItem>
                ) : null}
                {p.paidAt ? (
                  <DropdownMenuItem className="min-h-11 lg:min-h-9" onSelect={() => void run(() => markPaid(p.email, false), "Marked not paid.")}>Mark not paid</DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="min-h-11 lg:min-h-9" onSelect={() => setDlg("paid")}>Mark paid</DropdownMenuItem>
                )}
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {note ? (
        <span role="status" className={cn("max-w-56 text-right type-caption", note.tone === "alert" ? "text-status-alert-fg" : "text-muted-foreground")}>
          {note.text}
        </span>
      ) : null}

      <Dialog open={dlg !== null} onOpenChange={(o) => !busy && !o && setDlg(null)}>
        <DialogContent data-admin-v2>
          <DialogHeader>
            <DialogTitle>
              {dlg === "note" ? `Note on ${p.name}` : dlg === "stage" ? `Move ${p.name}` : dlg === "paid" ? `Mark ${p.name} paid` : `Send ${p.name} the login link`}
            </DialogTitle>
            <DialogDescription>
              {dlg === "note"
                ? "It goes on their timeline."
                : dlg === "stage"
                  ? `Now: ${STAGE_LABEL[p.stage]}.`
                  : dlg === "paid"
                    ? paymentReady
                      ? "The amount and note are optional."
                      : "Paste 2026_11_15_people_payment.sql in Supabase first; until then this cannot be saved."
                    : p.isStudent
                      ? `An email with a link to set up their login goes to ${p.email}.`
                      : `A student account is made for ${p.email}, then the login link is emailed.`}
            </DialogDescription>
          </DialogHeader>
          {dlg === "note" ? (
            <label className="flex flex-col gap-1.5">
              <span className="type-small font-semibold">Note</span>
              <textarea rows={4} value={text} maxLength={4000} onChange={(e) => setText(e.target.value)} className={cn(control, "h-auto min-h-24 w-full py-2 leading-normal lg:h-auto")} />
            </label>
          ) : null}
          {dlg === "stage" ? (
            <label className="flex flex-col gap-1.5">
              <span className="type-small font-semibold">Stage</span>
              <select value={stage} onChange={(e) => setStageValue(e.target.value as StageId)} className={cn(control, "w-full")}>
                {STAGES.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {dlg === "paid" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="type-small font-semibold">Amount in ₹</span>
                <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))} className={cn(control, "w-full")} disabled={!paymentReady} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="type-small font-semibold">Note</span>
                <input value={text} maxLength={300} onChange={(e) => setText(e.target.value)} placeholder="UPI, receipt number" className={cn(control, "w-full")} disabled={!paymentReady} />
              </label>
            </div>
          ) : null}
          <DialogFooter>
            <button type="button" className={btn.quiet} disabled={busy} onClick={() => setDlg(null)}>
              Cancel
            </button>
            <button
              type="button"
              className={btn.primary}
              disabled={busy || (dlg === "note" && !text.trim()) || (dlg === "stage" && stage === p.stage) || (dlg === "paid" && !paymentReady)}
              onClick={() => {
                if (dlg === "note") void run(() => logActivity(p.email, "note", text), "Note saved.");
                else if (dlg === "stage") void run(() => setStage(p.email, stage), `Moved to ${STAGE_LABEL[stage]}.`);
                else if (dlg === "paid") void run(() => markPaid(p.email, true, amount ? Number(amount) : null, text), "Marked paid.");
                else if (dlg === "invite")
                  void run(async () => {
                    const r = await sendInvite(p.email, p.name);
                    return r.error ? r : r.sent ? { error: null } : { error: `The link was not sent: ${r.reason ?? "unknown reason"}.` };
                  }, "Login link sent.");
              }}
            >
              {busy ? <Loader2 className="animate-spin" aria-hidden /> : null}
              {dlg === "note" ? "Save note" : dlg === "stage" ? "Move" : dlg === "paid" ? "Mark paid" : "Send"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** WhatsApp cannot send to a group from a link: one link per person, with the message filled in. */
function WhatsAppLinks({ people, onClose }: { people: Person[]; onClose: () => void }) {
  const [msg, setMsg] = React.useState("Hi {first_name}, ");
  const [opened, setOpened] = React.useState<Set<string>>(() => new Set());
  const withPhone = people.filter((p) => waLink(p.phone));
  const without = people.length - withPhone.length;
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent data-admin-v2 className="max-h-[92dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>WhatsApp {withPhone.length} {withPhone.length === 1 ? "person" : "people"}</DialogTitle>
          <DialogDescription>Each link opens WhatsApp with the message ready. {"{first_name}"} becomes their first name.</DialogDescription>
        </DialogHeader>
        <label className="flex flex-col gap-1.5">
          <span className="type-small font-semibold">Message</span>
          <textarea rows={3} value={msg} maxLength={1000} onChange={(e) => setMsg(e.target.value)} className={cn(control, "h-auto min-h-20 w-full py-2 leading-normal lg:h-auto")} />
        </label>
        {without ? <p className="type-small text-muted-foreground">{without} without a usable phone number: left out.</p> : null}
        <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
          {withPhone.map((p) => {
            const href = waLink(p.phone, waMessage(msg, p)) as string;
            const done = opened.has(p.email);
            return (
              <li key={p.email} className="flex min-h-12 min-w-0 items-center justify-between gap-3 py-2">
                <span className="min-w-0">
                  <span className="block type-small font-semibold [overflow-wrap:anywhere]">{p.name}</span>
                  <span className="block type-caption text-muted-foreground">{p.phone}</span>
                </span>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={done ? btn.ghost : btn.quiet}
                  onClick={() => {
                    setOpened((s) => new Set(s).add(p.email));
                    void logWhatsApp([p.email], waMessage(msg, p));
                  }}
                >
                  {done ? "Opened" : "Open WhatsApp"}
                </a>
              </li>
            );
          })}
        </ul>
        <DialogFooter>
          <button type="button" className={btn.primary} onClick={onClose}>
            Done
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
