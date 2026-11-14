"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Loader2, Minus, Plus, Search, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CERT_KINDS, DEFAULT_SIGNATORIES, KIND_DEFAULTS, longDate, type CertKind } from "@/lib/certificates/kinds";
import type { IssueReport } from "@/lib/certificates/issue";
import type { StudioIssueInput, StudioSignatory } from "@/lib/certificates/issue-input";
import type { CertificateDoc } from "@/lib/certificates/layout";
import { issueStudioCertificates } from "./actions";

const StudioPreview = dynamic(() => import("./studio-preview"), {
  ssr: false,
  loading: () => <div className="aspect-[842/595] w-full animate-pulse bg-muted" aria-label="Loading the certificate" />,
});

export type StudioStudent = { id: string; name: string; email: string; roll: string | null; cohortIds: string[] };
export type StudioSeed = {
  replaces?: string;
  kind?: CertKind;
  title?: string;
  heading?: string;
  lead?: string;
  connector?: string;
  citation?: string;
  courseLabel?: string;
  moduleLabel?: string;
  issuedOn?: string;
  expiresOn?: string;
  signatories?: StudioSignatory[];
  recipient?: { userId: string; name: string };
};

type Props = {
  canWrite: boolean;
  /** The database step has been pasted (provisional, expiry and the email queue need it). */
  ready: boolean;
  today: string;
  siteUrl: string;
  students: StudioStudent[];
  cohorts: Array<{ id: string; name: string; count: number }>;
  courses: Array<{ id: string; title: string }>;
  signatures: Array<{ id: string; label: string; url: string | null }>;
  email: { configured: boolean; remaining: number; limit: number };
  seed: StudioSeed | null;
};

const STEPS = ["Type", "People", "Wording", "Preview", "Send"] as const;
const KIND_HELP: Record<CertKind, string> = {
  completion: "Finished a course or a module.",
  provisional: "Temporary. Runs out on a date you pick.",
  recognition: "For something that stood out.",
  custom: "You write every line.",
};
const field = "h-11 w-full min-w-0 rounded-md border-2 border-input bg-card px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/60 md:text-sm";

function SectionTitle({ n, children, hint }: { n: number; children: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-3">
      <h2 className="text-h2 lg:text-h3">
        <span className="mr-2 hidden tabular-nums text-muted-foreground lg:inline">{n}</span>
        {children}
      </h2>
      {hint ? <span className="text-caption text-muted-foreground">{hint}</span> : null}
    </div>
  );
}

export function Studio({ canWrite, ready, today, siteUrl, students, cohorts, courses, signatures, email, seed }: Props) {
  const [step, setStep] = React.useState(0);
  const [kind, setKind] = React.useState<CertKind>(seed?.kind ?? "completion");
  const [title, setTitle] = React.useState(seed?.title ?? "");
  const [heading, setHeading] = React.useState(seed?.heading ?? "");
  const [lead, setLead] = React.useState(seed?.lead ?? "");
  const [connector, setConnector] = React.useState(seed?.connector ?? "");
  const [linesOpen, setLinesOpen] = React.useState(false);
  const [citation, setCitation] = React.useState(seed?.citation ?? "");
  const [courseLabel, setCourseLabel] = React.useState(seed?.courseLabel ?? "");
  const [moduleLabel, setModuleLabel] = React.useState(seed?.moduleLabel ?? "");
  const [issuedOn, setIssuedOn] = React.useState(seed?.replaces ? (seed.issuedOn ?? today) : today);
  const [expiresOn, setExpiresOn] = React.useState(seed?.expiresOn ?? "");
  const [signatories, setSignatories] = React.useState<StudioSignatory[]>(() => (seed?.signatories?.length ? seed.signatories : DEFAULT_SIGNATORIES.map((s) => ({ ...s, signatureFrom: null }))));
  const [picked, setPicked] = React.useState<Array<{ userId: string; name: string }>>(() => (seed?.recipient ? [seed.recipient] : []));
  const [cohortId, setCohortId] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [showing, setShowing] = React.useState(0);
  const [alsoEmail, setAlsoEmail] = React.useState(true);
  const [zoomOpen, setZoomOpen] = React.useState(false);
  const [zoom, setZoom] = React.useState(1.5);
  const [confirm, setConfirm] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [report, setReport] = React.useState<IssueReport | null>(null);
  const [tried, setTried] = React.useState(false);

  const def = KIND_DEFAULTS[kind];
  const byId = React.useMemo(() => new Map(students.map((s) => [s.id, s])), [students]);
  const pickedIds = React.useMemo(() => new Set(picked.map((p) => p.userId)), [picked]);
  const locked = Boolean(seed?.replaces);

  const matches = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return students.filter((s) => !pickedIds.has(s.id) && `${s.name} ${s.email} ${s.roll ?? ""}`.toLowerCase().includes(q)).slice(0, 6);
  }, [query, students, pickedIds]);

  const add = (s: StudioStudent) => {
    setPicked((p) => (p.some((x) => x.userId === s.id) ? p : [...p, { userId: s.id, name: s.name }]));
    setQuery("");
  };
  const addCohort = (id: string) => {
    const members = students.filter((s) => s.cohortIds.includes(id));
    setPicked((p) => {
      const have = new Set(p.map((x) => x.userId));
      return [...p, ...members.filter((m) => !have.has(m.id)).map((m) => ({ userId: m.id, name: m.name }))];
    });
    setCohortId(id);
  };

  const shown = picked[Math.min(showing, Math.max(0, picked.length - 1))];
  const doc: CertificateDoc = {
    kind,
    heading,
    lead,
    connector,
    recipientName: shown?.name ?? "",
    title,
    citation,
    course: courseLabel,
    module: moduleLabel,
    issuedOn,
    expiresOn: expiresOn || null,
    signatories: signatories.map((s, i) => ({ name: s.name, role: s.role, signature: s.signatureFrom ? `sig${i}` : null })),
    credentialId: "VIBHA-0000-0000-0000",
    verifyUrl: `${siteUrl}/verify/VIBHA-0000-0000-0000`,
  };
  const deferredDoc = React.useDeferredValue(doc);
  const images: Record<string, string | null> = {};
  signatories.forEach((s, i) => {
    if (s.signatureFrom) images[`sig${i}`] = signatures.find((x) => x.id === s.signatureFrom)?.url ?? null;
  });

  // What still stops this from being issued, by step.
  const problems: Array<{ step: number; text: string }> = [];
  if (kind === "provisional" && !ready) problems.push({ step: 0, text: "Provisional certificates need the database step first (2026_11_14_certificate_studio.sql)." });
  if (!picked.length) problems.push({ step: 1, text: "Pick at least one student." });
  if (picked.some((p) => !p.name.trim())) problems.push({ step: 1, text: "Every certificate needs a name to print." });
  if (!title.trim()) problems.push({ step: 2, text: "Give the certificate a title." });
  if (def.needsExpiry && !expiresOn) problems.push({ step: 2, text: "Pick the date this provisional certificate runs out." });
  if (expiresOn && expiresOn < issuedOn) problems.push({ step: 2, text: "The expiry date is before the issue date." });
  else if (expiresOn && expiresOn < today) problems.push({ step: 2, text: "The expiry date has already passed." });
  if (!signatories.some((s) => s.name.trim())) problems.push({ step: 2, text: "Add at least one signatory." });
  const stepProblem = (i: number) => problems.find((p) => p.step === i)?.text ?? null;

  const withEmail = picked.filter((p) => byId.get(p.userId)?.email).length;
  const emailNow = alsoEmail && email.configured ? Math.min(withEmail, email.remaining) : 0;
  const emailWait = alsoEmail && email.configured ? withEmail - emailNow : 0;
  const count = picked.length;
  const noun = `${count} certificate${count === 1 ? "" : "s"}`;

  async function issue() {
    setBusy(true);
    const input: StudioIssueInput = {
      kind,
      title,
      heading,
      lead,
      connector,
      citation,
      courseId: courses.find((c) => c.title === courseLabel)?.id ?? null,
      courseLabel,
      moduleLabel,
      issuedOn,
      expiresOn: expiresOn || null,
      signatories,
      recipients: picked,
      // Kept only when everyone picked is still in that cohort's list.
      cohortId: cohortId && picked.every((p) => byId.get(p.userId)?.cohortIds.includes(cohortId)) ? cohortId : null,
      email: alsoEmail,
    };
    let r: IssueReport;
    try {
      r = await issueStudioCertificates(input, seed?.replaces ?? null);
    } catch {
      r = { error: "Couldn't reach the server. Check your connection, then look in Issued certificates before trying again.", issued: [], skipped: [], delivery: null, batchId: null };
    }
    setBusy(false);
    setConfirm(false);
    setReport(r);
  }

  if (report && !report.error) return <Result report={report} onAgain={() => { setReport(null); setPicked([]); setStep(0); setTried(false); }} />;

  const visible = (i: number) => cn(step === i ? "block" : "hidden", "lg:block");
  const next = () => {
    if (stepProblem(step)) return setTried(true);
    setTried(false);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  return (
    <div className="pb-24 lg:pb-0">
      <header className="mb-6 lg:mb-10">
        <h1 className="text-h1">Certificate studio</h1>
        {seed?.replaces ? (
          <p className="mt-2 max-w-[60ch] text-small text-muted-foreground">
            Correcting <span className="font-mono text-foreground">{seed.replaces}</span>. Issuing makes a new certificate and revokes the old one.
          </p>
        ) : null}
        {/* Phone: where you are in the five steps. */}
        <div className="mt-4 lg:hidden" aria-live="polite">
          <p className="text-small font-semibold tabular-nums text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </p>
          <div className="mt-2 h-1 w-full bg-foreground/10" aria-hidden>
            <div className="h-1 bg-brand transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>
      </header>

      {report?.error ? (
        <p role="alert" className="mb-6 border-l-4 border-destructive pl-3 text-small font-semibold text-status-alert-fg">{report.error}</p>
      ) : null}

      <div className="lg:grid lg:grid-cols-[minmax(0,27rem)_minmax(0,1fr)] lg:items-start lg:gap-14">
        <div className="min-w-0 lg:space-y-12">
          {/* 1. Type */}
          <section className={visible(0)} aria-labelledby="st-type">
            <SectionTitle n={1}><span id="st-type">Type</span></SectionTitle>
            <div role="radiogroup" aria-labelledby="st-type" className="divide-y divide-foreground/10 border-y border-foreground/10">
              {CERT_KINDS.map((k) => {
                const on = kind === k;
                const off = k === "provisional" && !ready;
                return (
                  <button
                    key={k}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    disabled={off}
                    onClick={() => {
                      setKind(k);
                      if (k === "custom") setLinesOpen(true);
                      if (!KIND_DEFAULTS[k].needsExpiry && kind === "provisional") setExpiresOn("");
                    }}
                    className="flex min-h-14 w-full items-center gap-3 py-3 text-left outline-none transition-colors duration-150 hover:bg-foreground/[0.03] focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:opacity-50"
                  >
                    <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border-2 border-foreground", on && "bg-brand")} aria-hidden>
                      {on ? <span className="size-2 rounded-full bg-white" /> : null}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold">{KIND_DEFAULTS[k].label}</span>
                      <span className="block text-small text-muted-foreground">{off ? "Needs the database step first." : KIND_HELP[k]}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {!ready ? (
              <p className="mt-3 max-w-[60ch] text-caption text-muted-foreground">
                Paste <span className="font-mono">2026_11_14_certificate_studio.sql</span> in Supabase to turn on provisional certificates, expiry dates and the email queue.
              </p>
            ) : null}
          </section>

          {/* 2. People */}
          <section className={visible(1)} aria-labelledby="st-people">
            <SectionTitle n={2} hint={count ? `${count} picked` : undefined}><span id="st-people">People</span></SectionTitle>
            {locked ? null : (
              <div className="space-y-3">
                <div className="relative">
                  <Label htmlFor="st-search" className="sr-only">Search by name, email or roll number</Label>
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <Input id="st-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, email or roll number" className="pl-9" autoComplete="off" />
                </div>
                {query.trim() ? (
                  matches.length ? (
                    <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
                      {matches.map((s) => (
                        <li key={s.id}>
                          <button type="button" onClick={() => add(s)} className="flex min-h-12 w-full items-center gap-3 py-2 text-left hover:bg-foreground/[0.03] focus-visible:outline-2 focus-visible:outline-ring">
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-semibold">{s.name}</span>
                              <span className="block truncate text-caption text-muted-foreground">{s.roll ?? "No roll number"} · {s.email}</span>
                            </span>
                            <Plus className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-small text-muted-foreground">No student matches.</p>
                  )
                ) : null}
                {cohorts.length ? (
                  <div>
                    <Label htmlFor="st-cohort" className="mb-1.5 block">Or add a whole cohort</Label>
                    <select id="st-cohort" className={field} value="" onChange={(e) => e.target.value && addCohort(e.target.value)}>
                      <option value="">Choose a cohort</option>
                      {cohorts.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} ({c.count})</option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </div>
            )}
            {count ? (
              <div className="mt-5">
                <div className="mb-1 flex items-baseline justify-between gap-3">
                  <p className="text-small font-semibold">Name printed on each certificate</p>
                  {locked ? null : (
                    <button type="button" className="inline-flex min-h-11 items-center text-small font-semibold text-link underline-offset-4 hover:underline" onClick={() => { setPicked([]); setCohortId(null); }}>Clear all</button>
                  )}
                </div>
                <ul className="max-h-[22rem] divide-y divide-foreground/10 overflow-y-auto overscroll-contain border-y border-foreground/10">
                  {picked.map((p, i) => {
                    const s = byId.get(p.userId);
                    return (
                      <li key={p.userId} className="flex items-center gap-2 py-2">
                        <div className="min-w-0 flex-1">
                          <Label htmlFor={`st-name-${p.userId}`} className="sr-only">Printed name for {s?.name ?? p.name}</Label>
                          <Input
                            id={`st-name-${p.userId}`}
                            value={p.name}
                            maxLength={80}
                            aria-invalid={!p.name.trim() || undefined}
                            onFocus={() => setShowing(i)}
                            onChange={(e) => setPicked((list) => list.map((x) => (x.userId === p.userId ? { ...x, name: e.target.value } : x)))}
                          />
                          <p className="mt-1 truncate text-caption text-muted-foreground">{s?.roll ?? "No roll number"} · {s?.email || "no email on file"}</p>
                        </div>
                        {locked ? null : (
                          <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${p.name}`} onClick={() => setPicked((list) => list.filter((x) => x.userId !== p.userId))}>
                            <X className="size-4" aria-hidden />
                          </Button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </section>

          {/* 3. Wording */}
          <section className={visible(2)} aria-labelledby="st-wording">
            <SectionTitle n={3}><span id="st-wording">Wording</span></SectionTitle>
            <div className="space-y-5">
              <div>
                <Label htmlFor="st-title" className="mb-1.5 block">Title</Label>
                <Input id="st-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder={def.titleHint} aria-invalid={(tried && !title.trim()) || undefined} />
              </div>
              <div>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <Label htmlFor="st-citation">Description</Label>
                  <span className={cn("text-caption tabular-nums text-muted-foreground", citation.length > 420 && "text-status-alert-fg")}>{citation.length} / 420</span>
                </div>
                <Textarea id="st-citation" rows={4} value={citation} onChange={(e) => setCitation(e.target.value)} maxLength={700} placeholder="What this person did, in two or three lines." />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="st-course" className="mb-1.5 block">Course <span className="font-normal text-muted-foreground">(optional)</span></Label>
                  <Input id="st-course" list="st-course-list" value={courseLabel} onChange={(e) => setCourseLabel(e.target.value)} maxLength={90} />
                  <datalist id="st-course-list">
                    {courses.map((c) => <option key={c.id} value={c.title} />)}
                    {cohorts.map((c) => <option key={c.id} value={c.name} />)}
                  </datalist>
                </div>
                <div>
                  <Label htmlFor="st-module" className="mb-1.5 block">Module <span className="font-normal text-muted-foreground">(optional)</span></Label>
                  <Input id="st-module" value={moduleLabel} onChange={(e) => setModuleLabel(e.target.value)} maxLength={90} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="st-issued" className="mb-1.5 block">Issue date</Label>
                  <Input id="st-issued" type="date" value={issuedOn} onChange={(e) => setIssuedOn(e.target.value || today)} />
                </div>
                <div>
                  <Label htmlFor="st-expires" className="mb-1.5 block">
                    {def.needsExpiry ? "Runs out on" : <>Expiry <span className="font-normal text-muted-foreground">(optional)</span></>}
                  </Label>
                  <Input id="st-expires" type="date" value={expiresOn} min={issuedOn > today ? issuedOn : today} disabled={!ready} onChange={(e) => setExpiresOn(e.target.value)} aria-invalid={(tried && def.needsExpiry && !expiresOn) || undefined} />
                </div>
              </div>

              <div>
                <p className="mb-1 text-small font-semibold">Signed by</p>
                <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
                  {signatories.map((s, i) => (
                    <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 gap-y-2 py-3">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <Label htmlFor={`st-sig-n-${i}`} className="sr-only">Signatory {i + 1} name</Label>
                          <Input id={`st-sig-n-${i}`} value={s.name} placeholder="Name" maxLength={60} onChange={(e) => setSignatories((l) => l.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                        </div>
                        <div>
                          <Label htmlFor={`st-sig-r-${i}`} className="sr-only">Signatory {i + 1} role</Label>
                          <Input id={`st-sig-r-${i}`} value={s.role} placeholder="Role" maxLength={60} onChange={(e) => setSignatories((l) => l.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))} />
                        </div>
                        {signatures.length ? (
                          <div className="sm:col-span-2">
                            <Label htmlFor={`st-sig-i-${i}`} className="sr-only">Signature image for signatory {i + 1}</Label>
                            <select id={`st-sig-i-${i}`} className={field} value={s.signatureFrom ?? ""} onChange={(e) => setSignatories((l) => l.map((x, j) => (j === i ? { ...x, signatureFrom: e.target.value || null } : x)))}>
                              <option value="">No signature image</option>
                              {signatures.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
                            </select>
                          </div>
                        ) : null}
                      </div>
                      <Button type="button" variant="ghost" size="icon" aria-label={`Remove signatory ${i + 1}`} disabled={signatories.length <= 1} onClick={() => setSignatories((l) => l.filter((_, j) => j !== i))}>
                        <X className="size-4" aria-hidden />
                      </Button>
                    </li>
                  ))}
                </ul>
                {signatories.length < 3 ? (
                  <button type="button" className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-small font-semibold text-link underline-offset-4 hover:underline" onClick={() => setSignatories((l) => [...l, { name: "", role: "", signatureFrom: null }])}>
                    <Plus className="size-4" aria-hidden /> Add a signatory
                  </button>
                ) : null}
              </div>

              <div>
                <button type="button" aria-expanded={linesOpen} className="inline-flex min-h-11 items-center gap-1.5 text-small font-semibold text-link underline-offset-4 hover:underline" onClick={() => setLinesOpen((o) => !o)}>
                  <ChevronRight className={cn("size-4 transition-transform duration-150", linesOpen && "rotate-90")} aria-hidden /> Change the small lines
                </button>
                {linesOpen ? (
                  <div className="mt-2 space-y-4">
                    <div>
                      <Label htmlFor="st-heading" className="mb-1.5 block">Heading at the top</Label>
                      <Input id="st-heading" value={heading} onChange={(e) => setHeading(e.target.value)} maxLength={60} placeholder={def.heading} />
                    </div>
                    <div>
                      <Label htmlFor="st-lead" className="mb-1.5 block">Line above the name</Label>
                      <Input id="st-lead" value={lead} onChange={(e) => setLead(e.target.value)} maxLength={80} placeholder={def.lead} />
                    </div>
                    <div>
                      <Label htmlFor="st-connector" className="mb-1.5 block">Line under the name</Label>
                      <Input id="st-connector" value={connector} onChange={(e) => setConnector(e.target.value)} maxLength={80} placeholder={def.connector} />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          {/* 5. Send (phone step 5; on desktop it closes the form) */}
          <section className={visible(4)} aria-labelledby="st-send">
            <SectionTitle n={4}><span id="st-send">Send</span></SectionTitle>
            <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
              <li className="flex min-h-14 items-center gap-3 py-3">
                <Check className="size-4 shrink-0" aria-hidden />
                <span className="min-w-0">
                  <span className="block font-semibold">Notification in the app</span>
                  <span className="block text-small text-muted-foreground">Always sent. It opens the certificate.</span>
                </span>
              </li>
              <li className="flex min-h-14 items-center gap-3 py-3">
                <span className="min-w-0 flex-1">
                  <Label htmlFor="st-email" className="block text-base font-semibold">Email with the link</Label>
                  <span className="block text-small text-muted-foreground">
                    {!email.configured
                      ? "Email isn't set up on this site."
                      : !alsoEmail
                        ? `${email.remaining} left today.`
                        : emailWait > 0
                          ? `${emailNow} go now. ${emailWait} wait for tomorrow's allowance.`
                          : `${email.remaining} left today.`}
                  </span>
                </span>
                <Switch id="st-email" className="origin-right scale-150" checked={alsoEmail && email.configured} disabled={!email.configured} onCheckedChange={setAlsoEmail} />
              </li>
            </ul>
            {emailWait > 0 ? (
              <p className="mt-3 max-w-[60ch] text-small text-muted-foreground">Waiting emails are kept. Send them later from Issued certificates, with the Send waiting emails button.</p>
            ) : null}
            {count && withEmail < count ? (
              <p className="mt-3 text-small text-muted-foreground">{count - withEmail} of them {count - withEmail === 1 ? "has" : "have"} no email on file.</p>
            ) : null}

            {problems.length ? (
              <ul className="mt-5 space-y-1">
                {problems.map((p) => (
                  <li key={p.text} className="text-small">
                    <button type="button" className="text-left font-semibold text-status-alert-fg underline-offset-4 hover:underline" onClick={() => { setStep(p.step); setTried(true); }}>{p.text}</button>
                  </li>
                ))}
              </ul>
            ) : null}

            {canWrite ? (
              <Button type="button" size="lg" className="mt-6 hidden w-full lg:inline-flex" disabled={problems.length > 0 || busy} onClick={() => setConfirm(true)}>
                {seed?.replaces ? "Issue the corrected certificate" : `Issue ${count ? noun : "certificates"}`}
              </Button>
            ) : (
              <p className="mt-6 text-small text-muted-foreground">Only the Super Admin can issue certificates.</p>
            )}
          </section>
        </div>

        {/* Preview: phone step 4, desktop beside the form. */}
        <aside className={cn(visible(3), "min-w-0 lg:sticky lg:top-[calc(var(--top-h,3.5rem)+1.5rem)]")} aria-label="Certificate preview">
          <div className="overflow-hidden rounded-xl border-[1.5px] border-foreground/25 bg-white">
            <StudioPreview doc={deferredDoc} images={images} />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="min-w-0 text-small text-muted-foreground">
              {shown ? <>Showing <span className="font-semibold text-foreground">{shown.name || "no name"}</span></> : "Pick someone to see their name here."}
            </p>
            <div className="flex items-center gap-1">
              {count > 1 ? (
                <>
                  <Button type="button" variant="ghost" size="icon" aria-label="Previous person" onClick={() => setShowing((i) => (Math.min(i, count - 1) - 1 + count) % count)}><ChevronLeft className="size-4" aria-hidden /></Button>
                  <span className="min-w-12 text-center text-small tabular-nums text-muted-foreground">{Math.min(showing, count - 1) + 1} / {count}</span>
                  <Button type="button" variant="ghost" size="icon" aria-label="Next person" onClick={() => setShowing((i) => (Math.min(i, count - 1) + 1) % count)}><ChevronRight className="size-4" aria-hidden /></Button>
                </>
              ) : null}
              <Button type="button" variant="outline" size="sm" onClick={() => setZoomOpen(true)}><ZoomIn className="size-4" aria-hidden /> Zoom</Button>
            </div>
          </div>
          <p className="mt-2 text-caption text-muted-foreground">A4 landscape. The ID and QR code are filled in when it is issued.</p>
        </aside>
      </div>

      {/* Phone: Back and Next, in thumb reach. */}
      <div className="fixed inset-x-0 bottom-[var(--nav-h,0px)] z-30 flex items-center gap-3 border-t border-foreground/15 bg-background px-5 py-3 lg:hidden">
        <Button type="button" variant="outline" size="lg" className="shrink-0" disabled={step === 0} onClick={() => { setTried(false); setStep((s) => Math.max(0, s - 1)); }}>
          <ArrowLeft className="size-4" aria-hidden /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" size="lg" className="min-w-0 flex-1" onClick={next}>
            {STEPS[step + 1]} <ArrowRight className="size-4" aria-hidden />
          </Button>
        ) : canWrite ? (
          <Button type="button" size="lg" className="min-w-0 flex-1" disabled={problems.length > 0 || busy} onClick={() => setConfirm(true)}>
            Issue {count ? noun : ""}
          </Button>
        ) : null}
      </div>
      {tried && stepProblem(step) ? (
        <p role="alert" className="fixed inset-x-0 bottom-[calc(var(--nav-h,0px)+4.5rem)] z-30 bg-status-alert-bg px-5 py-2 text-small font-semibold text-status-alert-fg lg:hidden">{stepProblem(step)}</p>
      ) : null}

      <Dialog open={confirm} onOpenChange={(o) => !busy && setConfirm(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{seed?.replaces ? "Issue the corrected certificate?" : `Issue ${noun}?`}</DialogTitle>
            <DialogDescription>
              {def.label}: {title.trim() || def.titleHint}
              {expiresOn ? `, until ${longDate(expiresOn)}` : ""}.
            </DialogDescription>
          </DialogHeader>
          <ul className="divide-y divide-foreground/10 border-y border-foreground/10 text-small">
            <li className="flex justify-between gap-3 py-2"><span>App notifications</span><span className="font-semibold tabular-nums">{count}</span></li>
            <li className="flex justify-between gap-3 py-2"><span>Emails now</span><span className="font-semibold tabular-nums">{emailNow}</span></li>
            {emailWait > 0 ? <li className="flex justify-between gap-3 py-2"><span>Emails waiting</span><span className="font-semibold tabular-nums">{emailWait}</span></li> : null}
          </ul>
          {seed?.replaces ? <p className="text-small text-muted-foreground">The old certificate will show as revoked and point to the new one.</p> : null}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={busy} onClick={() => setConfirm(false)}>Not yet</Button>
            <Button type="button" disabled={busy} onClick={() => void issue()}>
              {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null} {busy ? "Issuing" : "Issue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="flex h-dvh max-h-dvh w-screen max-w-none flex-col gap-0 rounded-none border-0 p-0 sm:max-w-none">
          <DialogHeader className="flex-row items-center justify-between gap-3 border-b border-foreground/15 py-2 pl-5 pr-14">
            <DialogTitle className="text-h3">Preview</DialogTitle>
            <DialogDescription className="sr-only">The certificate at a larger size. Scroll to move around.</DialogDescription>
            <div className="flex items-center gap-1">
              <Button type="button" variant="outline" size="icon" aria-label="Smaller" disabled={zoom <= 1} onClick={() => setZoom((z) => Math.max(1, z - 0.5))}><Minus className="size-4" aria-hidden /></Button>
              <span className="min-w-12 text-center text-small tabular-nums">{Math.round(zoom * 100)}%</span>
              <Button type="button" variant="outline" size="icon" aria-label="Larger" disabled={zoom >= 4} onClick={() => setZoom((z) => Math.min(4, z + 0.5))}><Plus className="size-4" aria-hidden /></Button>
            </div>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-muted p-4 [touch-action:pan-x_pan-y_pinch-zoom]">
            <div className="mx-auto bg-white" style={{ width: `${zoom * 100}%`, minWidth: 320 }}>
              {zoomOpen ? <StudioPreview doc={deferredDoc} images={images} /> : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Result({ report, onAgain }: { report: IssueReport; onAgain: () => void }) {
  const d = report.delivery;
  const n = report.issued.length;
  const rows: Array<{ label: string; names: string[]; note?: string }> = [];
  if (d?.emailed.length) rows.push({ label: "Emailed", names: d.emailed });
  if (d?.queued.length) rows.push({ label: "Email waiting", names: d.queued, note: d.queueMissing ? "The queue isn't in the database yet. Use Resend on each one tomorrow." : "Send them from Issued certificates when today's allowance is back." });
  if (d?.failed.length) rows.push({ label: "Email failed", names: d.failed.map((f) => `${f.name} (${f.reason})`) });
  if (d?.noEmail.length && !d.emailOff) rows.push({ label: "No email on file", names: d.noEmail });
  if (report.skipped.length) rows.push({ label: "Not issued", names: report.skipped.map((s) => `${s.name} (${s.reason})`) });
  return (
    <div className="max-w-2xl">
      <h1 className="text-h1">{n} certificate{n === 1 ? "" : "s"} issued</h1>
      <p className="mt-2 text-small text-muted-foreground">
        Everyone has a notification in the app.{d?.emailOff ? " Email isn't set up on this site, so no emails went out." : ""}
        {report.replaced ? ` ${report.replaced} is now revoked.` : ""}
      </p>
      {rows.length ? (
        <dl className="mt-6 divide-y divide-foreground/10 border-y border-foreground/10">
          {rows.map((r) => (
            <div key={r.label} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
              <dt className="text-small font-semibold">{r.label} <span className="tabular-nums text-muted-foreground">{r.names.length}</span></dt>
              <dd className="min-w-0 text-small">
                <span className="[overflow-wrap:anywhere]">{r.names.join(", ")}</span>
                {r.note ? <span className="mt-1 block text-muted-foreground">{r.note}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
      <ul className="mt-6 divide-y divide-foreground/10 border-y border-foreground/10">
        {report.issued.slice(0, 100).map((i) => (
          <li key={i.credentialId}>
            <Link href={`/verify/${i.credentialId}`} target="_blank" className="flex min-h-12 items-center justify-between gap-3 py-2 hover:bg-foreground/[0.03]">
              <span className="min-w-0 truncate font-semibold">{i.name}</span>
              <span className="shrink-0 font-mono text-caption text-muted-foreground">{i.credentialId}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild><Link href="/admin/credentials/issued">See issued certificates</Link></Button>
        <Button type="button" variant="outline" onClick={onAgain}>Make another</Button>
      </div>
    </div>
  );
}
