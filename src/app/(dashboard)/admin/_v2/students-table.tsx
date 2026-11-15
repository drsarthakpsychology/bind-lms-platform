"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Download, KeyRound, ListFilter, Loader2, Lock, MessageSquare, Search, Unlock, X } from "lucide-react";
import { toast } from "sonner";
import { ACCOUNT_LABEL, ACCOUNT_TONE, type AccountStatus } from "@/lib/people/account-status";
import { FLAG_LABEL } from "@/lib/people/attention";
import type { Presence } from "@/lib/people/presence";
import { setAccountStatus } from "../students/actions";
import { sendLoginLink } from "../cohorts/actions";
import { LoginQuick } from "../students/login-quick";
import type { StudentRowLite } from "../students/student-table";
import { cn } from "@/lib/utils";
import { Empty, Meter, Status, Tag, btn, control, link, table, toneOf, type Tone } from "./kit";

const PRESENCE_LABEL: Record<Presence, string> = { now: "On now", today: "Today", week: "This week", quiet: "Quiet 7+ days", never: "Never" };
const PRESENCE_TONE: Record<Presence, Tone> = { now: "ok", today: "info", week: "info", quiet: "warn", never: "quiet" };

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
 * Students list (v2). Same filters, sorting, bulk actions and download as the
 * old list (students/student-table.tsx); only the composition is new:
 *   desktop  one filter bar, a real table with a sticky header, a row hover
 *            and a selected state, details opening under the row
 *   phones   a search box, filters behind one button, and rows that open the
 *            student's page
 * One action bar appears at the bottom only while students are ticked.
 */
export function StudentsTableV2({ rows, cohorts, canWrite, initialCohort = "", initialFilter = "" }: { rows: StudentRowLite[]; cohorts: { id: string; name: string }[]; canWrite: boolean; initialCohort?: string; initialFilter?: string }) {
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
  const [showFilters, setShowFilters] = React.useState(false);

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
  const selectFilters = [cohort, account, activity, attention ? "1" : ""].filter(Boolean).length;
  const filtersOn = Boolean(q || selectFilters);
  const togglePick = (id: string) =>
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const toggleAll = () => setPicked(allShownPicked ? new Set() : new Set(shown.map((r) => r.id)));

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
    if (bad) toast.error(`${what}: ${ok}. ${bad} didn't work: see Messages → Failed.`);
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

  const cols = canWrite ? 7 : 6;
  const check = "size-4 accent-[var(--link)]";
  /** A 44px tap area around a small checkbox. */
  const checkWrap = "grid size-11 shrink-0 cursor-pointer place-items-center lg:size-8";

  return (
    <div className="flex min-w-0 flex-col gap-3">
      {/* One filter bar */}
      <div role="search" aria-label="Filter students" className="flex min-w-0 flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
        <div className="flex min-w-0 gap-2 md:min-w-64 md:flex-1">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">Search students</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="search"
              placeholder="Name, email, roll number or mobile"
              className={cn(control, "w-full pl-9 text-base md:text-sm")}
            />
          </label>
          <button type="button" className={cn(btn.quiet, "md:hidden")} aria-expanded={showFilters} aria-controls="students-filters" onClick={() => setShowFilters((v) => !v)}>
            <ListFilter aria-hidden /> Filters{selectFilters ? ` (${selectFilters})` : ""}
          </button>
        </div>
        <div id="students-filters" className={cn("min-w-0 grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center", showFilters ? "grid" : "hidden")}>
          <select aria-label="Cohort" value={cohort} onChange={(e) => setCohort(e.target.value)} className={cn(control, "md:max-w-48")}>
            <option value="">All cohorts</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            <option value="none">Not in a cohort</option>
          </select>
          <select aria-label="Account" value={account} onChange={(e) => setAccount(e.target.value as AccountStatus | "")} className={control}>
            <option value="">Any account state</option>
            {(Object.keys(ACCOUNT_LABEL) as AccountStatus[]).map((k) => (
              <option key={k} value={k}>{ACCOUNT_LABEL[k]}</option>
            ))}
          </select>
          <select aria-label="Last active" value={activity} onChange={(e) => setActivity(e.target.value as Presence | "")} className={control}>
            <option value="">Any activity</option>
            {(Object.keys(PRESENCE_LABEL) as Presence[]).map((k) => (
              <option key={k} value={k}>{PRESENCE_LABEL[k]}</option>
            ))}
          </select>
          <select aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={control}>
            <option value="name">Sort: name</option>
            <option value="roll">Sort: roll number</option>
            <option value="active">Sort: last active</option>
            <option value="lectures">Sort: lectures finished</option>
          </select>
          <button
            type="button"
            aria-pressed={attention}
            onClick={() => setAttention((v) => !v)}
            className={cn(btn.quiet, "col-span-2 md:col-span-1", attention && "border-foreground bg-foreground text-background hover:bg-foreground hover:opacity-90")}
          >
            Needs attention
          </button>
        </div>
      </div>

      {/* Count line: what is shown, clear, select all (phones), download */}
      <div className="flex min-h-11 min-w-0 flex-wrap items-center gap-x-4 gap-y-1 lg:min-h-9">
        <label className="flex min-h-11 min-w-11 cursor-pointer items-center gap-2 type-small font-semibold md:hidden">
          <input type="checkbox" className={check} checked={allShownPicked} onChange={toggleAll} />
          All
        </label>
        <p className="type-small text-muted-foreground type-num" aria-live="polite">
          {shown.length === rows.length ? `${rows.length} students` : `${shown.length} of ${rows.length}`}
        </p>
        {filtersOn ? (
          <button type="button" className={cn(btn.ghost, "-mx-2 text-link")} onClick={() => { setQ(""); setCohort(""); setAccount(""); setActivity(""); setAttention(false); }}>
            <X aria-hidden /> Clear filters
          </button>
        ) : null}
        <button type="button" onClick={download} className={cn(btn.ghost, "ml-auto -mr-2", picked.size && "invisible")}>
          <Download aria-hidden /> Download list
        </button>
      </div>

      {shown.length === 0 ? (
        <Empty>
          {rows.length ? "No students match these filters." : "No students yet. Add students to start."}
        </Empty>
      ) : (
        <>
          {/* Desktop: a real table */}
          <table className={cn(table.root, "hidden md:table")}>
            <thead>
              <tr>
                <th scope="col" className={cn(table.th, "w-10")}>
                  <label className={checkWrap}>
                    <input type="checkbox" className={check} checked={allShownPicked} onChange={toggleAll} aria-label="Select everyone shown" />
                  </label>
                </th>
                <th scope="col" className={table.th}>Student</th>
                <th scope="col" className={cn(table.th, "hidden xl:table-cell")}>Cohort</th>
                <th scope="col" className={table.th}>Account</th>
                <th scope="col" className={table.th}>Last active</th>
                <th scope="col" className={cn(table.th, "w-36")}>Lectures</th>
                {canWrite ? <th scope="col" className={cn(table.th, "hidden lg:table-cell")}>Login</th> : null}
                <th scope="col" className={cn(table.th, "w-10")}><span className="sr-only">Details</span></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const isOpen = open === r.id;
                const pct = r.lecturesAvailable ? Math.round((r.lecturesDone / r.lecturesAvailable) * 100) : 0;
                const sel = picked.has(r.id);
                const cell = cn(table.td, isOpen && "border-b-transparent");
                return (
                  <React.Fragment key={r.id}>
                    <tr className={table.tr} aria-selected={sel}>
                      <td className={cell}>
                        <label className={checkWrap}>
                          <input type="checkbox" className={check} checked={sel} onChange={() => togglePick(r.id)} aria-label={`Select ${r.name}`} />
                        </label>
                      </td>
                      <td className={cn(cell, "max-w-0 w-[34%]")}>
                        <Link href={`/admin/students/${r.id}`} className="font-semibold underline-offset-4 outline-none hover:underline focus-visible:underline [overflow-wrap:anywhere]">{r.name}</Link>
                        <span className="block type-caption font-medium text-muted-foreground [overflow-wrap:anywhere]">
                          {r.roll ? <span className="type-num text-foreground">{r.roll}</span> : "No roll no."} · {r.email}
                        </span>
                        {r.flags.length || r.cohorts.length ? (
                          <span className="mt-1 flex flex-wrap gap-1">
                            {r.flags.map((f) => <Tag key={f} tone="warn">{FLAG_LABEL[f]}</Tag>)}
                            <span className="contents xl:hidden">{r.cohorts.map((c) => <Tag key={c.id}>{c.name}</Tag>)}</span>
                          </span>
                        ) : null}
                      </td>
                      <td className={cn(cell, "hidden xl:table-cell [overflow-wrap:anywhere]")}>
                        {r.cohorts.length ? r.cohorts.map((c) => c.name).join(", ") : <span className="text-muted-foreground">None</span>}
                      </td>
                      <td className={cell}><Status tone={toneOf(ACCOUNT_TONE[r.account])}>{ACCOUNT_LABEL[r.account]}</Status></td>
                      <td className={cn(cell, "whitespace-nowrap")}>
                        <Status tone={PRESENCE_TONE[r.presence]}>{r.presence === "now" ? "On now" : ago(r.lastSeen)}</Status>
                      </td>
                      <td className={cell}><Meter pct={pct} label={`${r.lecturesDone}/${r.lecturesAvailable}`} /></td>
                      {canWrite ? <td className={cn(cell, "hidden lg:table-cell")}><LoginQuick compact email={r.email} name={r.name} /></td> : null}
                      <td className={cell}>
                        <button
                          type="button"
                          onClick={() => setOpen(isOpen ? null : r.id)}
                          aria-expanded={isOpen}
                          aria-label={isOpen ? `Hide details for ${r.name}` : `Show details for ${r.name}`}
                          className="grid size-11 place-items-center rounded-md text-muted-foreground outline-none hover:bg-[var(--ds-hairline)] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring lg:size-8"
                        >
                          <ChevronDown className={cn("size-4 transition-transform duration-[var(--ds-state)] motion-reduce:transition-none", isOpen && "rotate-180")} aria-hidden />
                        </button>
                      </td>
                    </tr>
                    {isOpen ? (
                      <tr>
                        <td colSpan={cols + 1} className="border-b border-[var(--ds-hairline)] pt-1 pb-4 pl-11 lg:pl-8">
                          <dl className="flex flex-wrap gap-x-10 gap-y-2 type-small">
                            <div><dt className="type-caption text-muted-foreground">Mobile</dt><dd className="font-semibold">{r.mobile ? <a className={link} href={`https://wa.me/91${r.mobile}`} target="_blank" rel="noopener noreferrer">+91 {r.mobile}</a> : "Not given"}</dd></div>
                            <div><dt className="type-caption text-muted-foreground">Access</dt><dd className="font-semibold">{r.scope === "full" ? "Full platform" : "Lectures only"}</dd></div>
                            <div><dt className="type-caption text-muted-foreground">Last 7 days</dt><dd className="font-semibold type-num">{r.min7} min on VIBHA</dd></div>
                            <div><dt className="type-caption text-muted-foreground">Access ends</dt><dd className="font-semibold">{r.expiresAt ? new Date(r.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "No end date"}</dd></div>
                          </dl>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Link href={`/admin/students/${r.id}`} className={btn.ink}>Open profile</Link>
                            <Link href={`/admin/students/${r.id}?tab=access`} className={btn.quiet}>Access & login</Link>
                            <Link href={`/admin/students/${r.id}?tab=activity`} className={btn.quiet}>Activity</Link>
                            <Link href={`/admin/students/${r.id}?tab=credentials`} className={btn.quiet}>Credentials</Link>
                            {canWrite ? <LoginQuick email={r.email} name={r.name} /> : null}
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {/* Phones: rows; the row opens the student's page */}
          <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)] md:hidden">
            {shown.map((r) => {
              const sel = picked.has(r.id);
              return (
                <li key={r.id} className={cn("-mx-2 flex min-w-0 items-center gap-1 px-1", sel && "bg-[color-mix(in_oklab,var(--link)_9%,transparent)]")}>
                  <label className={checkWrap}>
                    <input type="checkbox" className={check} checked={sel} onChange={() => togglePick(r.id)} aria-label={`Select ${r.name}`} />
                  </label>
                  <Link href={`/admin/students/${r.id}`} className="flex min-h-16 min-w-0 flex-1 items-center gap-2 rounded-lg py-2 pr-1 outline-none focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)]">
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="type-body font-semibold [overflow-wrap:anywhere]">{r.name}</span>
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <Status tone={toneOf(ACCOUNT_TONE[r.account])}>{ACCOUNT_LABEL[r.account]}</Status>
                        <span className="type-small text-muted-foreground type-num">
                          {r.presence === "now" ? "On now" : ago(r.lastSeen)} · {r.lecturesDone}/{r.lecturesAvailable} lectures
                        </span>
                      </span>
                      {r.flags.length ? (
                        <span className="mt-0.5 flex flex-wrap gap-1">
                          {r.flags.map((f) => <Tag key={f} tone="warn">{FLAG_LABEL[f]}</Tag>)}
                        </span>
                      ) : null}
                    </span>
                    <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* One action bar, only while students are selected */}
      {picked.size ? (
        <div
          role="region"
          aria-label="Actions for selected students"
          className="sticky bottom-[calc(var(--nav-h)+0.75rem)] z-20 mx-auto flex w-full max-w-3xl min-w-0 flex-wrap items-center gap-2 rounded-xl border border-foreground bg-background p-2 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.35)]"
        >
          <span className="px-2 type-small font-bold type-num">{picked.size} selected</span>
          {canWrite ? (
            <>
              <button type="button" className={btn.quiet} disabled={Boolean(busy)} onClick={() => bulk("links")}>
                {busy === "links" ? <Loader2 className="animate-spin" aria-hidden /> : <KeyRound aria-hidden />} Send login link
              </button>
              <button type="button" className={btn.quiet} disabled={Boolean(busy)} onClick={() => bulk("lock")}>
                {busy === "lock" ? <Loader2 className="animate-spin" aria-hidden /> : <Lock aria-hidden />} Lock
              </button>
              <button type="button" className={btn.quiet} disabled={Boolean(busy)} onClick={() => bulk("unlock")}>
                {busy === "unlock" ? <Loader2 className="animate-spin" aria-hidden /> : <Unlock aria-hidden />} Unlock
              </button>
              <Link className={btn.quiet} href={`/admin/emails?folder=notify&to=${encodeURIComponent(pickedRows.map((r) => r.email).join(","))}`}>
                <MessageSquare aria-hidden /> Message
              </Link>
            </>
          ) : null}
          <button type="button" className={btn.quiet} onClick={download}>
            <Download aria-hidden /> Download
          </button>
          <button type="button" className={cn(btn.ghost, "ml-auto")} onClick={() => setPicked(new Set())}>
            <X aria-hidden /> Clear
          </button>
        </div>
      ) : null}
    </div>
  );
}
