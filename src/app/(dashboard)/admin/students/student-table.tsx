"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Download, KeyRound, Loader2, Lock, MessageSquare, Search, Unlock, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ACCOUNT_LABEL, ACCOUNT_TONE, type AccountStatus } from "@/lib/people/account-status";
import { FLAG_LABEL, type AttentionFlag } from "@/lib/people/attention";
import type { Presence } from "@/lib/people/presence";
import { setAccountStatus } from "./actions";
import { sendLoginLink } from "../cohorts/actions";
import { cn } from "@/lib/utils";

export type StudentRowLite = {
  id: string;
  name: string;
  email: string;
  roll: string | null;
  mobile: string | null;
  account: AccountStatus;
  presence: Presence;
  lastSeen: string | null;
  cohorts: { id: string; name: string }[];
  min7: number;
  lecturesDone: number;
  lecturesAvailable: number;
  scope: "full" | "lectures_only";
  expiresAt: string | null;
  flags: AttentionFlag[];
};

const PRESENCE_LABEL: Record<Presence, string> = { now: "On now", today: "Today", week: "This week", quiet: "Quiet 7+ days", never: "Never" };
const PRESENCE_DOT: Record<Presence, string> = { now: "bg-status-success-fg", today: "bg-link", week: "bg-foreground/50", quiet: "bg-status-pending-fg", never: "bg-foreground/20" };

function ago(iso: string | null): string {
  if (!iso) return "Never";
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 2) return "Just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d < 31 ? `${d} d ago` : new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function csv(rows: StudentRowLite[]): string {
  const head = ["Name", "Roll number", "Email", "Mobile", "Cohorts", "Account", "Last active", "Minutes (7 days)", "Lectures finished", "Lectures available", "Access", "Needs attention"];
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  return [head, ...rows.map((r) => [r.name, r.roll ?? "", r.email, r.mobile ?? "", r.cohorts.map((c) => c.name).join("; "), ACCOUNT_LABEL[r.account], r.lastSeen ?? "", r.min7, r.lecturesDone, r.lecturesAvailable, r.scope === "full" ? "Full" : "Lectures only", r.flags.map((f) => FLAG_LABEL[f]).join("; ")])]
    .map((line) => line.map(esc).join(","))
    .join("\n");
}

type Sort = "name" | "active" | "lectures" | "roll";

/**
 * Students list. No sideways scrolling at any width: on wide screens each
 * student is one row of columns; the less-used facts (mobile, access level,
 * expiry, minutes) open in the row's details. On phones each student is a
 * card. Search covers name, email, roll number and mobile. Tick students to
 * lock, unlock, send login links, message, or download them as a spreadsheet.
 */
export function StudentTable({ rows, cohorts, canWrite, initialCohort = "", initialFilter = "" }: { rows: StudentRowLite[]; cohorts: { id: string; name: string }[]; canWrite: boolean; initialCohort?: string; initialFilter?: string }) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [cohort, setCohort] = React.useState(initialCohort);
  const [account, setAccount] = React.useState<"" | AccountStatus>("");
  const [activity, setActivity] = React.useState<"" | Presence>("");
  const [attention, setAttention] = React.useState(initialFilter === "attention");
  const [sort, setSort] = React.useState<Sort>("name");
  const [open, setOpen] = React.useState<string | null>(null);
  const [picked, setPicked] = React.useState<Set<string>>(new Set());
  const [busy, setBusy] = React.useState<string | null>(null);

  const needle = q.trim().toLowerCase().replace(/\s+/g, " ");
  const shown = React.useMemo(() => {
    const list = rows.filter((r) => {
      if (cohort === "none" ? r.cohorts.length > 0 : cohort && !r.cohorts.some((c) => c.id === cohort)) return false;
      if (account && r.account !== account) return false;
      if (activity && r.presence !== activity) return false;
      if (attention && !r.flags.length) return false;
      if (!needle) return true;
      return `${r.name} ${r.email} ${r.roll ?? ""} ${r.mobile ?? ""}`.toLowerCase().includes(needle);
    });
    const by: Record<Sort, (a: StudentRowLite, b: StudentRowLite) => number> = {
      name: (a, b) => a.name.localeCompare(b.name),
      roll: (a, b) => (a.roll ?? "~").localeCompare(b.roll ?? "~"),
      active: (a, b) => (b.lastSeen ?? "").localeCompare(a.lastSeen ?? ""),
      lectures: (a, b) => b.lecturesDone - a.lecturesDone,
    };
    return [...list].sort(by[sort]);
  }, [rows, cohort, account, activity, attention, needle, sort]);

  const pickedRows = rows.filter((r) => picked.has(r.id));
  const allShownPicked = shown.length > 0 && shown.every((r) => picked.has(r.id));
  const filtersOn = Boolean(q || cohort || account || activity || attention);
  const togglePick = (id: string) =>
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  async function bulk(kind: "lock" | "unlock" | "links") {
    if (busy || !pickedRows.length) return;
    if (kind === "lock" && !window.confirm(`Lock ${pickedRows.length} account${pickedRows.length === 1 ? "" : "s"}? They can't sign in until unlocked.`)) return;
    setBusy(kind);
    let ok = 0;
    let bad = 0;
    for (const r of pickedRows) {
      const res = kind === "links" ? await sendLoginLink(r.email) : await setAccountStatus(r.id, kind === "lock" ? "blocked" : "active", kind === "lock" ? "Locked from Students (bulk)" : undefined);
      if (res.error) bad++;
      else ok++;
    }
    setBusy(null);
    const what = kind === "links" ? "Login links sent" : kind === "lock" ? "Locked" : "Unlocked";
    if (bad) toast.error(`${what}: ${ok}. ${bad} didn't work — see Messages → Failed.`);
    else toast.success(`${what}: ${ok}.`);
    setPicked(new Set());
    router.refresh();
  }

  function download() {
    const list = pickedRows.length ? pickedRows : shown;
    const blob = new Blob([csv(list)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `vibha-students-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const select = "h-10 rounded-full border-2 border-foreground bg-background px-3 text-sm font-semibold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60";

  return (
    <div className="space-y-4">
      {/* Search + filters */}
      <div className="space-y-2">
        <label className="relative block">
          <span className="sr-only">Search students</span>
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="search"
            placeholder={`Search ${rows.length} students by name, email, roll number or mobile`}
            className="h-11 w-full rounded-full border-2 border-foreground bg-background pr-4 pl-10 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Cohort" value={cohort} onChange={(e) => setCohort(e.target.value)} className={select}>
            <option value="">All cohorts</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            <option value="none">Not in a cohort</option>
          </select>
          <select aria-label="Account" value={account} onChange={(e) => setAccount(e.target.value as AccountStatus | "")} className={select}>
            <option value="">Any account state</option>
            {(Object.keys(ACCOUNT_LABEL) as AccountStatus[]).map((k) => (
              <option key={k} value={k}>{ACCOUNT_LABEL[k]}</option>
            ))}
          </select>
          <select aria-label="Last active" value={activity} onChange={(e) => setActivity(e.target.value as Presence | "")} className={select}>
            <option value="">Any activity</option>
            {(Object.keys(PRESENCE_LABEL) as Presence[]).map((k) => (
              <option key={k} value={k}>{PRESENCE_LABEL[k]}</option>
            ))}
          </select>
          <button
            type="button"
            aria-pressed={attention}
            onClick={() => setAttention((v) => !v)}
            className={cn(select, attention ? "bg-primary text-primary-foreground" : "")}
          >
            Needs attention
          </button>
          <select aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={cn(select, "ml-auto")}>
            <option value="name">Sort: name</option>
            <option value="roll">Sort: roll number</option>
            <option value="active">Sort: last active</option>
            <option value="lectures">Sort: lectures finished</option>
          </select>
        </div>
        <p className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
          Showing {shown.length} of {rows.length}
          {filtersOn ? (
            <button type="button" className="inline-flex items-center gap-1 font-bold text-link" onClick={() => { setQ(""); setCohort(""); setAccount(""); setActivity(""); setAttention(false); }}>
              <X className="size-3.5" aria-hidden /> Clear filters
            </button>
          ) : null}
        </p>
      </div>

      {/* Bulk bar */}
      <div className="sticky top-16 z-10 flex flex-wrap items-center gap-2 rounded-2xl border-2 border-foreground bg-background/95 p-2 backdrop-blur">
        <label className="flex h-9 items-center gap-2 px-2 text-sm font-semibold">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={allShownPicked}
            onChange={() => setPicked(allShownPicked ? new Set() : new Set(shown.map((r) => r.id)))}
            aria-label="Tick everyone shown"
          />
          {picked.size ? `${picked.size} ticked` : "Tick all shown"}
        </label>
        {canWrite ? (
          <>
            <Button size="sm" variant="outline" disabled={!picked.size || Boolean(busy)} onClick={() => bulk("links")}>
              {busy === "links" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <KeyRound className="size-4" aria-hidden />} Send login link
            </Button>
            <Button size="sm" variant="outline" disabled={!picked.size || Boolean(busy)} onClick={() => bulk("lock")}>
              {busy === "lock" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Lock className="size-4" aria-hidden />} Lock
            </Button>
            <Button size="sm" variant="outline" disabled={!picked.size || Boolean(busy)} onClick={() => bulk("unlock")}>
              {busy === "unlock" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Unlock className="size-4" aria-hidden />} Unlock
            </Button>
            <Button size="sm" variant="outline" disabled={!picked.size} asChild={picked.size > 0}>
              {picked.size ? (
                <Link href={`/admin/emails?folder=notify&to=${encodeURIComponent(pickedRows.map((r) => r.email).join(","))}`}>
                  <MessageSquare className="size-4" aria-hidden /> Message
                </Link>
              ) : (
                <span><MessageSquare className="size-4" aria-hidden /> Message</span>
              )}
            </Button>
          </>
        ) : null}
        <Button size="sm" variant="secondary" onClick={download} className="ml-auto">
          <Download className="size-4" aria-hidden /> {picked.size ? "Download ticked" : "Download list"}
        </Button>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-foreground/30 p-6 text-center text-sm text-muted-foreground">No students match these filters.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border-2 border-foreground bg-card">
          {/* Column heads (wide screens only) */}
          <div className="hidden grid-cols-[2rem_minmax(0,2.2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_2.5rem] items-center gap-3 border-b-2 border-foreground bg-muted px-4 py-2 text-eyebrow text-muted-foreground lg:grid">
            <span />
            <span>Student</span>
            <span>Cohort</span>
            <span>Account</span>
            <span>Last active</span>
            <span>Lectures</span>
            <span className="sr-only">Details</span>
          </div>
          <ul className="divide-y-2 divide-foreground/10">
            {shown.map((r) => {
              const isOpen = open === r.id;
              const pct = r.lecturesAvailable ? Math.round((r.lecturesDone / r.lecturesAvailable) * 100) : 0;
              return (
                <li key={r.id} className={cn(picked.has(r.id) && "bg-status-success-bg/50")}>
                  <div className="grid grid-cols-[2rem_minmax(0,1fr)_2.5rem] items-center gap-x-3 gap-y-2 px-3 py-3 sm:px-4 lg:grid-cols-[2rem_minmax(0,2.2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_2.5rem]">
                    <input type="checkbox" className="size-4 accent-primary" checked={picked.has(r.id)} onChange={() => togglePick(r.id)} aria-label={`Tick ${r.name}`} />
                    <div className="min-w-0">
                      <Link href={`/admin/students/${r.id}`} className="block truncate text-sm font-bold underline-offset-4 hover:underline">{r.name}</Link>
                      <span className="block truncate text-caption text-muted-foreground">
                        {r.roll ? <span className="font-mono font-semibold text-foreground">{r.roll}</span> : <span>No roll no.</span>} · {r.email}
                      </span>
                      {/* Phone/tablet: the other columns fold under the name */}
                      <span className="mt-1.5 flex flex-wrap items-center gap-1.5 lg:hidden">
                        <Badge variant={ACCOUNT_TONE[r.account]}>{ACCOUNT_LABEL[r.account]}</Badge>
                        <span className="inline-flex items-center gap-1 text-caption"><span className={cn("size-2 rounded-full", PRESENCE_DOT[r.presence])} aria-hidden />{ago(r.lastSeen)}</span>
                        <span className="text-caption text-muted-foreground">· {r.lecturesDone}/{r.lecturesAvailable} lectures</span>
                        {r.cohorts.map((c) => <span key={c.id} className="rounded-full border-2 border-foreground/20 px-1.5 text-[0.7rem] font-semibold">{c.name}</span>)}
                      </span>
                    </div>
                    <div className="hidden min-w-0 flex-wrap gap-1 lg:flex">
                      {r.cohorts.length ? r.cohorts.map((c) => <span key={c.id} className="truncate rounded-full border-2 border-foreground/20 px-2 py-0.5 text-caption font-semibold">{c.name}</span>) : <span className="text-caption text-muted-foreground">None</span>}
                    </div>
                    <div className="hidden lg:block"><Badge variant={ACCOUNT_TONE[r.account]}>{ACCOUNT_LABEL[r.account]}</Badge></div>
                    <div className="hidden items-center gap-1.5 text-sm lg:flex">
                      <span className={cn("size-2.5 shrink-0 rounded-full", PRESENCE_DOT[r.presence])} aria-hidden />
                      <span className="truncate">{r.presence === "now" ? "On now" : ago(r.lastSeen)}</span>
                    </div>
                    <div className="hidden lg:block">
                      <span className="text-sm font-semibold tabular-nums">{r.lecturesDone}/{r.lecturesAvailable}</span>
                      <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden><span className="block h-full bg-link" style={{ width: `${pct}%` }} /></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : r.id)}
                      aria-expanded={isOpen}
                      aria-label={isOpen ? `Hide details for ${r.name}` : `Show details for ${r.name}`}
                      className="grid size-10 place-items-center rounded-full border-2 border-foreground/20 hover:bg-accent"
                    >
                      <ChevronDown className={cn("size-4 transition-transform", isOpen && "rotate-180")} aria-hidden />
                    </button>
                  </div>
                  {r.flags.length ? (
                    <div className="flex flex-wrap gap-1 px-3 pb-3 pl-14 sm:px-4 sm:pl-[3.75rem]">
                      {r.flags.map((f) => <span key={f} className="rounded-full bg-status-pending-bg px-2 py-0.5 text-[0.7rem] font-bold text-status-pending-fg">{FLAG_LABEL[f]}</span>)}
                    </div>
                  ) : null}
                  {isOpen ? (
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t-2 border-foreground/10 bg-background px-4 py-3 text-sm sm:grid-cols-4 sm:pl-[3.75rem]">
                      <div><dt className="text-eyebrow text-muted-foreground">Mobile</dt><dd className="font-semibold">{r.mobile ? <a className="text-link underline" href={`https://wa.me/91${r.mobile}`} target="_blank" rel="noopener noreferrer">+91 {r.mobile}</a> : "Not given"}</dd></div>
                      <div><dt className="text-eyebrow text-muted-foreground">Access</dt><dd className="font-semibold">{r.scope === "full" ? "Full platform" : "Lectures only"}</dd></div>
                      <div><dt className="text-eyebrow text-muted-foreground">Last 7 days</dt><dd className="font-semibold">{r.min7} min on VIBHA</dd></div>
                      <div><dt className="text-eyebrow text-muted-foreground">Access ends</dt><dd className="font-semibold">{r.expiresAt ? new Date(r.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "No end date"}</dd></div>
                      <div className="col-span-2 flex flex-wrap gap-2 sm:col-span-4">
                        <Link href={`/admin/students/${r.id}`} className="inline-flex h-9 items-center rounded-full border-2 border-foreground bg-primary px-3 text-sm font-bold text-primary-foreground">Open profile</Link>
                        <Link href={`/admin/students/${r.id}?tab=access`} className="inline-flex h-9 items-center rounded-full border-2 border-foreground px-3 text-sm font-bold">Access & login</Link>
                        <Link href={`/admin/students/${r.id}?tab=activity`} className="inline-flex h-9 items-center rounded-full border-2 border-foreground px-3 text-sm font-bold">Activity</Link>
                        <Link href={`/admin/students/${r.id}?tab=credentials`} className="inline-flex h-9 items-center rounded-full border-2 border-foreground px-3 text-sm font-bold">Credentials</Link>
                      </div>
                    </dl>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
