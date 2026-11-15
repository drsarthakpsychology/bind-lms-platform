"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Loader2, MoreHorizontal, Search, SlidersHorizontal, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  countByType,
  filterIssued,
  issuedDay,
  issuedStatus,
  issuedStatusLine,
  ISSUED_STATUSES,
  ISSUED_STATUS_LABEL,
  TYPE_FILTERS,
  TYPE_FILTER_LABEL,
  typeLabel,
  type IssuedFilters,
  type IssuedRow,
  type IssuedStatus,
} from "@/lib/certificates/issued";
import { btn, control, Empty, nameLink, Notice, RowItem, Rows, Status, table, type Tone } from "../../_v2/kit";
import { issueCertificate } from "../../achievements/actions";
import { resendStudioCertificate, revokeStudioCertificate, sendWaitingCertificateEmails } from "../studio/actions";
import { area } from "../_ui/parts";

const TONE: Record<IssuedStatus, Tone> = { valid: "ok", provisional: "info", expired: "quiet", revoked: "alert", draft: "warn" };
const EMAIL_LABEL: Record<string, string> = { sent: "Emailed", queued: "Email waiting", failed: "Email failed", none: "App only" };
const PAGE = 100;

type Initial = { q: string; type: string; status: string; cohortId: string; userId: string };

/** Keep the filters in the address, so a view can be shared or bookmarked (no reload). */
function writeUrl(f: Initial) {
  try {
    const p = new URLSearchParams();
    if (f.q) p.set("q", f.q);
    if (f.type) p.set("type", f.type);
    if (f.status) p.set("status", f.status);
    if (f.cohortId) p.set("cohort", f.cohortId);
    if (f.userId) p.set("student", f.userId);
    const s = p.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${s ? `?${s}` : ""}`);
  } catch {
    /* fine */
  }
}

/**
 * Everything issued, certificates and badges. One filter bar (search stays
 * visible on phones; the rest sit behind Filters there), a table from 768px,
 * rows on phones. Actions per line in one menu, so the list stays calm.
 */
export function IssuedList({
  rows,
  cohorts,
  canWrite,
  waiting,
  emailOn,
  initial,
  person,
}: {
  rows: IssuedRow[];
  cohorts: { id: string; name: string }[];
  canWrite: boolean;
  waiting: number;
  emailOn: boolean;
  initial: Initial;
  person: { id: string; name: string } | null;
}) {
  const [f, setF] = React.useState<Initial>(initial);
  const [open, setOpen] = React.useState(Boolean(initial.type || initial.status || initial.cohortId));
  const [limit, setLimit] = React.useState(PAGE);
  const set = (patch: Partial<Initial>) => {
    const next = { ...f, ...patch };
    setF(next);
    setLimit(PAGE);
    writeUrl(next);
  };
  // `now` is fixed for this render pass of the list (statuses depend on it).
  const [now] = React.useState(() => new Date());
  const shown = React.useMemo(() => {
    const filters: IssuedFilters = { q: f.q, type: f.type || null, status: f.status || null, cohortId: f.cohortId || null, userId: f.userId || null };
    return filterIssued(rows, filters, now);
  }, [rows, f, now]);
  const counts = React.useMemo(() => countByType(rows), [rows]);
  const filtering = Boolean(f.q || f.type || f.status || f.cohortId || f.userId);
  const slice = shown.slice(0, limit);

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {waiting > 0 ? <SendWaiting waiting={waiting} canWrite={canWrite} emailOn={emailOn} /> : null}

      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <label className="relative block min-w-0 flex-1 basis-56">
          <span className="sr-only">Search name, title, roll number or ID</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input type="search" value={f.q} onChange={(e) => set({ q: e.target.value })} placeholder="Name, title, roll number or ID" className={cn(control, "w-full pr-11 pl-9")} />
          {f.q ? (
            <button type="button" onClick={() => set({ q: "" })} aria-label="Clear search" className="absolute top-1/2 right-0 flex size-11 -translate-y-1/2 items-center justify-center rounded-md outline-none hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring lg:size-9">
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </label>
        <button type="button" aria-expanded={open} aria-controls="issued-filters" onClick={() => setOpen((o) => !o)} className={cn(btn.quiet, "md:hidden")}>
          <SlidersHorizontal aria-hidden /> Filters{f.type || f.status || f.cohortId ? " (on)" : ""}
        </button>
        <div id="issued-filters" className={cn("min-w-0 basis-full flex-wrap gap-2 md:flex md:basis-auto", open ? "flex" : "hidden")}>
          <label className="min-w-0 flex-1 basis-40 md:flex-none">
            <span className="sr-only">Type</span>
            <select value={f.type} onChange={(e) => set({ type: e.target.value })} className={cn(control, "w-full")}>
              <option value="">Everything ({rows.length})</option>
              {TYPE_FILTERS.map((t) => (
                <option key={t} value={t}>
                  {TYPE_FILTER_LABEL[t]} ({counts[t]})
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-0 flex-1 basis-40 md:flex-none">
            <span className="sr-only">Status</span>
            <select value={f.status} onChange={(e) => set({ status: e.target.value })} className={cn(control, "w-full")}>
              <option value="">Any status</option>
              {ISSUED_STATUSES.map((s) => (
                <option key={s} value={s}>{ISSUED_STATUS_LABEL[s]}</option>
              ))}
            </select>
          </label>
          {cohorts.length ? (
            <label className="min-w-0 flex-1 basis-40 md:flex-none">
              <span className="sr-only">Cohort</span>
              <select value={f.cohortId} onChange={(e) => set({ cohortId: e.target.value })} className={cn(control, "w-full")}>
                <option value="">Every cohort</option>
                {cohorts.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      </div>

      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="type-small text-muted-foreground type-num" aria-live="polite">
          {shown.length} {shown.length === 1 ? "item" : "items"}
          {person && f.userId ? (
            <>
              {" "}for <span className="font-semibold text-foreground">{person.name}</span>
            </>
          ) : null}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {person && f.userId ? (
            <>
              {canWrite ? (
                <Link href={`/admin/credentials/studio?student=${person.id}`} className={btn.quiet}>
                  Issue to {person.name.split(" ")[0]}
                </Link>
              ) : null}
              <button type="button" className={btn.ghost} onClick={() => set({ userId: "" })}>
                Show everyone
              </button>
            </>
          ) : filtering ? (
            <button type="button" className={btn.ghost} onClick={() => set({ q: "", type: "", status: "", cohortId: "", userId: "" })}>
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      {shown.length === 0 ? (
        <Empty>
          {filtering ? "Nothing matches these filters." : "Nothing issued yet."}
          {!filtering && canWrite ? (
            <>
              {" "}
              <Link href="/admin/credentials/studio" className="font-semibold text-link underline underline-offset-4">Issue the first one</Link>.
            </>
          ) : null}
        </Empty>
      ) : (
        <>
          <table className={cn(table.root, "hidden md:table")}>
            <thead>
              <tr>
                <th scope="col" className={cn(table.th, "w-[24%]")}>Name</th>
                <th scope="col" className={table.th}>What</th>
                <th scope="col" className={table.th}>Status</th>
                <th scope="col" className={cn(table.th, "whitespace-nowrap")}>Issued</th>
                <th scope="col" className={table.th}><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {slice.map((r) => {
                const st = issuedStatus(r, now);
                return (
                  <tr key={r.credentialId} className={table.tr}>
                    <td className={table.td}>
                      {r.userId ? (
                        <Link href={`/admin/students/${r.userId}`} className={nameLink}>{r.name}</Link>
                      ) : (
                        <span className="font-semibold [overflow-wrap:anywhere]">{r.name}</span>
                      )}
                      <span className="block text-muted-foreground [overflow-wrap:anywhere]">{r.roll ?? r.email ?? "No account"}</span>
                    </td>
                    <td className={table.td}>
                      <span className="block [overflow-wrap:anywhere]">{r.title}</span>
                      <span className="block text-muted-foreground">
                        {typeLabel(r)}
                        {r.emailStatus && EMAIL_LABEL[r.emailStatus] ? ` · ${EMAIL_LABEL[r.emailStatus]}` : ""}
                      </span>
                    </td>
                    <td className={table.td}>
                      <Status tone={TONE[st]}>{issuedStatusLine(r, now)}</Status>
                      {st === "revoked" && r.revokeReason ? <span className="block pl-3.5 text-muted-foreground [overflow-wrap:anywhere]">{r.revokeReason}</span> : null}
                    </td>
                    <td className={cn(table.td, "whitespace-nowrap text-muted-foreground type-num")}>{issuedDay(r)}</td>
                    <td className={cn(table.td, "w-px")}>
                      <RowActions row={r} status={st} canWrite={canWrite} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Rows className="md:hidden" label="Issued">
            {slice.map((r) => {
              const st = issuedStatus(r, now);
              return (
                <RowItem key={r.credentialId} className="flex-row items-start gap-3">
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="type-body font-semibold [overflow-wrap:anywhere]">{r.name}</span>
                    <span className="type-small [overflow-wrap:anywhere]">{r.title}</span>
                    <span className="type-small text-muted-foreground">
                      {typeLabel(r)} · {issuedDay(r)}
                    </span>
                    <Status tone={TONE[st]} className="mt-1">{issuedStatusLine(r, now)}</Status>
                  </div>
                  <RowActions row={r} status={st} canWrite={canWrite} compact />
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
    </div>
  );
}

/** Download, verify page and (Super Admin) send again, correct, issue a draft, revoke. */
function RowActions({ row, status, canWrite, compact = false }: { row: IssuedRow; status: IssuedStatus; canWrite: boolean; compact?: boolean }) {
  const router = useRouter();
  const [revoking, setRevoking] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [note, setNote] = React.useState<{ tone: "ok" | "alert"; text: string } | null>(null);
  const live = status === "valid" || status === "provisional" || status === "expired";
  const cert = row.type === "certificate";

  async function revoke() {
    setBusy(true);
    const r = await revokeStudioCertificate(row.credentialId, reason).catch(() => ({ error: "Couldn't reach the server." }));
    setBusy(false);
    if (r.error) return setNote({ tone: "alert", text: r.error });
    setRevoking(false);
    setReason("");
    setNote({ tone: "ok", text: "Revoked. The verify page now says so." });
    router.refresh();
  }
  async function resend() {
    setBusy(true);
    const r = await resendStudioCertificate(row.credentialId, true).catch(() => ({ error: "Couldn't reach the server.", notified: false, delivery: null }));
    setBusy(false);
    if (r.error) return setNote({ tone: "alert", text: r.error });
    const d = r.delivery;
    setNote({ tone: "ok", text: d?.emailed.length ? "Sent again by app and email." : d?.queued.length ? "App notice sent. The email waits for tomorrow." : d?.failed.length ? `App notice sent. Email failed: ${d.failed[0].reason}` : "App notice sent." });
    router.refresh();
  }
  async function issueDraft() {
    setBusy(true);
    const r = await issueCertificate(row.credentialId).catch(() => ({ error: "Couldn't reach the server." }));
    setBusy(false);
    if (r.error) return setNote({ tone: "alert", text: r.error });
    setNote({ tone: "ok", text: "Issued." });
    router.refresh();
  }

  return (
    <div className={cn("flex items-center justify-end gap-1", compact && "flex-col items-end")}>
      <div className="flex items-center gap-1">
        {cert && status !== "draft" ? (
          <a href={`/api/certificates/${encodeURIComponent(row.credentialId)}/pdf`} className={cn(btn.quiet, compact && "w-11 px-0")} aria-label={`Download the PDF for ${row.name}`}>
            <Download aria-hidden />
            {compact ? null : "PDF"}
          </a>
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className={cn(btn.ghost, "w-11 px-0 lg:w-9")} aria-label={`More for ${row.name}`} disabled={busy}>
              {busy ? <Loader2 className="animate-spin" aria-hidden /> : <MoreHorizontal aria-hidden />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-52">
            <DropdownMenuItem asChild className="min-h-11 lg:min-h-9">
              <Link href={`/verify/${encodeURIComponent(row.credentialId)}`} target="_blank">Open verify page</Link>
            </DropdownMenuItem>
            {row.userId ? (
              <DropdownMenuItem asChild className="min-h-11 lg:min-h-9">
                <Link href={`/admin/students/${row.userId}`}>Open student</Link>
              </DropdownMenuItem>
            ) : null}
            {canWrite && cert && status === "draft" ? (
              <DropdownMenuItem className="min-h-11 lg:min-h-9" onSelect={() => void issueDraft()}>Issue now</DropdownMenuItem>
            ) : null}
            {canWrite && cert && live ? (
              <>
                <DropdownMenuItem className="min-h-11 lg:min-h-9" onSelect={() => void resend()}>Send again</DropdownMenuItem>
                {row.userId ? (
                  <DropdownMenuItem asChild className="min-h-11 lg:min-h-9">
                    <Link href={`/admin/credentials/studio?reissue=${encodeURIComponent(row.credentialId)}`}>Correct and reissue</Link>
                  </DropdownMenuItem>
                ) : null}
              </>
            ) : null}
            {canWrite && status !== "revoked" ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" className="min-h-11 lg:min-h-9" onSelect={() => setRevoking(true)}>Revoke</DropdownMenuItem>
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

      <Dialog open={revoking} onOpenChange={(o) => !busy && setRevoking(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke this {cert ? "certificate" : "badge"}?</DialogTitle>
            <DialogDescription>
              {row.name}, {row.title}. It stays on record and its verify page will say Revoked. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div>
            <label htmlFor={`rv-${row.credentialId}`} className="mb-1.5 block type-small font-semibold">
              Reason <span className="font-normal text-muted-foreground">(kept private)</span>
            </label>
            <textarea id={`rv-${row.credentialId}`} rows={3} className={area} value={reason} maxLength={300} onChange={(e) => setReason(e.target.value)} />
          </div>
          <DialogFooter>
            <button type="button" className={btn.quiet} disabled={busy} onClick={() => setRevoking(false)}>Keep it</button>
            <button type="button" className={btn.danger} disabled={busy || !reason.trim()} onClick={() => void revoke()}>
              {busy ? <Loader2 className="animate-spin" aria-hidden /> : null} Revoke
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Emails that went over the daily limit wait in a queue; this sends what today allows. */
export function SendWaiting({ waiting, canWrite, emailOn }: { waiting: number; canWrite: boolean; emailOn: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [note, setNote] = React.useState<string | null>(null);
  return (
    <Notice className="flex-wrap items-center justify-between">
      <span className="min-w-0">
        <span className="font-semibold type-num">{waiting}</span> certificate email{waiting === 1 ? " is" : "s are"} waiting.
        {note ? <span className="ml-2" role="status">{note}</span> : null}
      </span>
      {canWrite ? (
        <button
          type="button"
          className={btn.quiet}
          disabled={busy || !emailOn}
          onClick={async () => {
            setBusy(true);
            const r = await sendWaitingCertificateEmails().catch(() => ({ error: "Couldn't reach the server.", sent: 0, left: waiting }));
            setBusy(false);
            setNote(r.error ? r.error : r.sent ? `${r.sent} sent${r.left ? `, ${r.left} still waiting` : ""}.` : "Today's email allowance is used up. Try tomorrow.");
            router.refresh();
          }}
        >
          {busy ? <Loader2 className="animate-spin" aria-hidden /> : null} Send waiting emails
        </button>
      ) : null}
    </Notice>
  );
}
