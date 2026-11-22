"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Loader2, Minus, Plus, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { CERT_KINDS, KIND_DEFAULTS, longDate, type CertKind } from "@/lib/certificates/kinds";
import type { IssueReport } from "@/lib/certificates/issue";
import type { StudioIssueInput, StudioSignatory } from "@/lib/certificates/issue-input";
import type { CertificateDoc } from "@/lib/certificates/layout";
import { btn, link, Notice } from "../../_v2/kit";
import { area, field, label, RemoveButton, ResultList, Step, StudentFinder, type PickCohort, type PickStudent } from "../_ui/parts";
import { issueStudioCertificates } from "./actions";

const StudioPreview = dynamic(() => import("./studio-preview"), {
  ssr: false,
  loading: () => <div className="aspect-[842/595] w-full animate-pulse bg-[var(--ds-tint)] motion-reduce:animate-none" aria-label="Loading the certificate" />,
});

export type StudioStudent = PickStudent;
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
  cohorts: PickCohort[];
  courses: Array<{ id: string; title: string }>;
  signatures: Array<{ id: string; label: string; url: string | null }>;
  email: { configured: boolean; remaining: number; limit: number };
  seed: StudioSeed | null;
  /** Who signs a new certificate (Certificates, Settings). */
  defaultSignatories: StudioSignatory[];
};

const STEPS = ["Type", "People", "Wording", "Preview", "Send"] as const;
const KIND_HELP: Record<CertKind, string> = {
  completion: "Finished a course or a module.",
  provisional: "Temporary. Runs out on a date you pick.",
  recognition: "For something that stood out.",
  custom: "You write every line.",
};

/**
 * The certificate studio: pick a type, the people, the wording; see the
 * certificate exactly as the student will; issue and send. The form is on the
 * left and the live certificate on the right on wide screens; phones go one
 * step at a time with Back and Next in thumb reach.
 */
export function Studio({ canWrite, ready, today, siteUrl, students, cohorts, courses, signatures, email, seed, defaultSignatories }: Props) {
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
  const [signatories, setSignatories] = React.useState<StudioSignatory[]>(() => (seed?.signatories?.length ? seed.signatories : defaultSignatories.map((s) => ({ ...s }))));
  const [picked, setPicked] = React.useState<Array<{ userId: string; name: string }>>(() => (seed?.recipient ? [seed.recipient] : []));
  const [cohortId, setCohortId] = React.useState<string | null>(null);
  const [showing, setShowing] = React.useState(0);
  // Once-only key: a double tap or a retry after a slow answer issues once.
  const issueKey = React.useRef<string | null>(null);
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

  const add = (s: StudioStudent) => setPicked((p) => (p.some((x) => x.userId === s.id) ? p : [...p, { userId: s.id, name: s.name }]));
  const addCohort = (id: string, members: StudioStudent[]) => {
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
      key: (issueKey.current ??= crypto.randomUUID()),
    };
    let r: IssueReport;
    try {
      r = await issueStudioCertificates(input, seed?.replaces ?? null);
    } catch {
      r = { error: "Couldn't reach the server. Check your connection, then look in Issued before trying again.", issued: [], skipped: [], delivery: null, batchId: null };
    }
    setBusy(false);
    setConfirm(false);
    // A new key for the next, different batch. A failed try keeps its key, so trying again cannot double up.
    if (!r.error) issueKey.current = null;
    setReport(r);
  }

  if (report && !report.error)
    return (
      <Result
        report={report}
        onAgain={() => {
          setReport(null);
          setPicked([]);
          setStep(0);
          setTried(false);
        }}
      />
    );

  const visible = (i: number) => cn(step === i ? "block" : "hidden", "lg:block");
  const next = () => {
    if (stepProblem(step)) return setTried(true);
    setTried(false);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  return (
    <div className="pb-28 lg:pb-0">
      {seed?.replaces ? (
        <p className="mb-6 max-w-[60ch] type-small text-muted-foreground">
          Correcting <span className="font-mono text-foreground">{seed.replaces}</span>. Issuing makes a new certificate and revokes the old one.
        </p>
      ) : null}
      {/* Phone: where you are in the five steps. */}
      <div className="mb-6 lg:hidden" aria-live="polite">
        <p className="type-small font-semibold text-muted-foreground type-num">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </p>
        <div className="mt-2 h-1 w-full rounded-full bg-[var(--ds-hairline)]" aria-hidden>
          <div className="h-1 rounded-full bg-link transition-[width] duration-[var(--ds-fill)] motion-reduce:transition-none" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      {report?.error ? (
        <Notice tone="alert" className="mb-6">
          {report.error}
        </Notice>
      ) : null}

      <div className="lg:grid lg:grid-cols-[minmax(0,27rem)_minmax(0,1fr)] lg:items-start lg:gap-14">
        <div className="min-w-0 lg:space-y-12">
          {/* 1. Type */}
          <section className={visible(0)} aria-labelledby="st-type">
            <Step n={1} id="st-type">Type</Step>
            <div role="radiogroup" aria-labelledby="st-type" className="flex flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
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
                    className="-mx-2 flex min-h-14 w-[calc(100%+1rem)] items-center gap-3 rounded-md px-2 py-3 text-left outline-none transition-colors duration-[var(--ds-state)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  >
                    <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border-[1.5px] border-foreground", on && "border-link bg-link")} aria-hidden>
                      {on ? <span className="size-2 rounded-full bg-background" /> : null}
                    </span>
                    <span className="min-w-0">
                      <span className="block type-body font-semibold">{KIND_DEFAULTS[k].label}</span>
                      <span className="block type-small text-muted-foreground">{off ? "Needs the database step first." : KIND_HELP[k]}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {!ready ? (
              <p className="mt-3 max-w-[60ch] type-caption text-muted-foreground">
                Paste <span className="font-mono">2026_11_14_certificate_studio.sql</span> in Supabase to turn on provisional certificates, expiry dates and the email queue.
              </p>
            ) : null}
          </section>

          {/* 2. People */}
          <section className={visible(1)} aria-labelledby="st-people">
            <Step n={2} id="st-people" hint={count ? `${count} picked` : undefined}>People</Step>
            {locked ? null : <StudentFinder idPrefix="st" students={students} cohorts={cohorts} pickedIds={pickedIds} onAdd={add} onAddCohort={addCohort} />}
            {count ? (
              <div className="mt-5">
                <div className="mb-1 flex items-baseline justify-between gap-3">
                  <p className="type-small font-semibold">Name printed on each certificate</p>
                  {locked ? null : (
                    <button
                      type="button"
                      className={cn(link, "inline-flex min-h-11 items-center type-small")}
                      onClick={() => {
                        setPicked([]);
                        setCohortId(null);
                      }}
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <ul className="flex max-h-[22rem] flex-col divide-y divide-[var(--ds-hairline)] overflow-y-auto overscroll-contain border-y border-[var(--ds-hairline)]">
                  {picked.map((p, i) => {
                    const s = byId.get(p.userId);
                    return (
                      <li key={p.userId} className="flex items-center gap-2 py-2">
                        <div className="min-w-0 flex-1">
                          <label htmlFor={`st-name-${p.userId}`} className="sr-only">Printed name for {s?.name ?? p.name}</label>
                          <input
                            id={`st-name-${p.userId}`}
                            value={p.name}
                            maxLength={80}
                            className={field}
                            aria-invalid={!p.name.trim() || undefined}
                            onFocus={() => setShowing(i)}
                            onChange={(e) => setPicked((list) => list.map((x) => (x.userId === p.userId ? { ...x, name: e.target.value } : x)))}
                          />
                          <p className="mt-1 type-caption text-muted-foreground [overflow-wrap:anywhere]">{s?.roll ?? "No roll number"} · {s?.email || "no email on file"}</p>
                        </div>
                        {locked ? null : <RemoveButton name={p.name} onClick={() => setPicked((list) => list.filter((x) => x.userId !== p.userId))} />}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </section>

          {/* 3. Wording */}
          <section className={visible(2)} aria-labelledby="st-wording">
            <Step n={3} id="st-wording">Wording</Step>
            <div className="space-y-5">
              <div>
                <label htmlFor="st-title" className={label}>Title</label>
                <input id="st-title" className={field} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder={def.titleHint} aria-invalid={(tried && !title.trim()) || undefined} />
              </div>
              <div>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <label htmlFor="st-citation" className="type-small font-semibold">Description</label>
                  <span className={cn("type-caption text-muted-foreground type-num", citation.length > 420 && "text-status-alert-fg")}>{citation.length} / 420</span>
                </div>
                <textarea id="st-citation" rows={4} className={area} value={citation} onChange={(e) => setCitation(e.target.value)} maxLength={700} placeholder="What this person did, in two or three lines." />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="st-course" className={label}>Course <span className="font-normal text-muted-foreground">(optional)</span></label>
                  <input id="st-course" className={field} list="st-course-list" value={courseLabel} onChange={(e) => setCourseLabel(e.target.value)} maxLength={90} />
                  <datalist id="st-course-list">
                    {courses.map((c) => <option key={c.id} value={c.title} />)}
                    {cohorts.map((c) => <option key={c.id} value={c.name} />)}
                  </datalist>
                </div>
                <div>
                  <label htmlFor="st-module" className={label}>Module <span className="font-normal text-muted-foreground">(optional)</span></label>
                  <input id="st-module" className={field} value={moduleLabel} onChange={(e) => setModuleLabel(e.target.value)} maxLength={90} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="st-issued" className={label}>Issue date</label>
                  <input id="st-issued" type="date" className={field} value={issuedOn} onChange={(e) => setIssuedOn(e.target.value || today)} />
                </div>
                <div>
                  <label htmlFor="st-expires" className={label}>
                    {def.needsExpiry ? "Runs out on" : <>Expiry <span className="font-normal text-muted-foreground">(optional)</span></>}
                  </label>
                  <input id="st-expires" type="date" className={field} value={expiresOn} min={issuedOn > today ? issuedOn : today} disabled={!ready} onChange={(e) => setExpiresOn(e.target.value)} aria-invalid={(tried && def.needsExpiry && !expiresOn) || undefined} />
                </div>
              </div>

              <div>
                <p className="mb-1 type-small font-semibold">Signed by</p>
                <ul className="flex flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
                  {signatories.map((s, i) => (
                    <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 gap-y-2 py-3">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <label htmlFor={`st-sig-n-${i}`} className="sr-only">Signatory {i + 1} name</label>
                          <input id={`st-sig-n-${i}`} className={field} value={s.name} placeholder="Name" maxLength={60} onChange={(e) => setSignatories((l) => l.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                        </div>
                        <div>
                          <label htmlFor={`st-sig-r-${i}`} className="sr-only">Signatory {i + 1} role</label>
                          <input id={`st-sig-r-${i}`} className={field} value={s.role} placeholder="Role" maxLength={60} onChange={(e) => setSignatories((l) => l.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))} />
                        </div>
                        {signatures.length ? (
                          <div className="sm:col-span-2">
                            <label htmlFor={`st-sig-i-${i}`} className="sr-only">Signature image for signatory {i + 1}</label>
                            <select id={`st-sig-i-${i}`} className={field} value={s.signatureFrom ?? ""} onChange={(e) => setSignatories((l) => l.map((x, j) => (j === i ? { ...x, signatureFrom: e.target.value || null } : x)))}>
                              <option value="">No signature image</option>
                              {signatures.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
                            </select>
                          </div>
                        ) : null}
                      </div>
                      <RemoveButton name={`signatory ${i + 1}`} disabled={signatories.length <= 1} onClick={() => setSignatories((l) => l.filter((_, j) => j !== i))} />
                    </li>
                  ))}
                </ul>
                {signatories.length < 3 ? (
                  <button type="button" className={cn(link, "mt-2 inline-flex min-h-11 items-center gap-1.5 type-small")} onClick={() => setSignatories((l) => [...l, { name: "", role: "", signatureFrom: null }])}>
                    <Plus className="size-4" aria-hidden /> Add a signatory
                  </button>
                ) : null}
              </div>

              <div>
                <button type="button" aria-expanded={linesOpen} className={cn(link, "inline-flex min-h-11 items-center gap-1.5 type-small")} onClick={() => setLinesOpen((o) => !o)}>
                  <ChevronRight className={cn("size-4 transition-transform duration-[var(--ds-state)] motion-reduce:transition-none", linesOpen && "rotate-90")} aria-hidden /> Change the small lines
                </button>
                {linesOpen ? (
                  <div className="mt-2 space-y-4">
                    <div>
                      <label htmlFor="st-heading" className={label}>Heading at the top</label>
                      <input id="st-heading" className={field} value={heading} onChange={(e) => setHeading(e.target.value)} maxLength={60} placeholder={def.heading} />
                    </div>
                    <div>
                      <label htmlFor="st-lead" className={label}>Line above the name</label>
                      <input id="st-lead" className={field} value={lead} onChange={(e) => setLead(e.target.value)} maxLength={80} placeholder={def.lead} />
                    </div>
                    <div>
                      <label htmlFor="st-connector" className={label}>Line under the name</label>
                      <input id="st-connector" className={field} value={connector} onChange={(e) => setConnector(e.target.value)} maxLength={80} placeholder={def.connector} />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          {/* 4. Send (phone step 5; on desktop it closes the form) */}
          <section className={visible(4)} aria-labelledby="st-send">
            <Step n={4} id="st-send">Send</Step>
            <ul className="flex flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
              <li className="flex min-h-14 items-center gap-3 py-3">
                <Check className="size-4 shrink-0" aria-hidden />
                <span className="min-w-0">
                  <span className="block type-body font-semibold">Notification in the app</span>
                  <span className="block type-small text-muted-foreground">Always sent. It opens the certificate.</span>
                </span>
              </li>
              <li className="flex min-h-14 items-center gap-3 py-3">
                <span className="min-w-0 flex-1">
                  <label htmlFor="st-email" className="block type-body font-semibold">Email with the link</label>
                  <span className="block type-small text-muted-foreground">
                    {!email.configured
                      ? "Email isn't set up on this site."
                      : alsoEmail && emailWait > 0
                        ? `${emailNow} go now. ${emailWait} wait for tomorrow's allowance.`
                        : `${email.remaining} left today.`}
                  </span>
                </span>
                <Switch id="st-email" className="origin-right scale-150" checked={alsoEmail && email.configured} disabled={!email.configured} onCheckedChange={setAlsoEmail} />
              </li>
            </ul>
            {emailWait > 0 ? <p className="mt-3 max-w-[60ch] type-small text-muted-foreground">Waiting emails are kept. Send them later from Issued.</p> : null}
            {count && withEmail < count ? (
              <p className="mt-3 type-small text-muted-foreground">
                {count - withEmail} of them {count - withEmail === 1 ? "has" : "have"} no email on file.
              </p>
            ) : null}

            {problems.length ? (
              <ul className="mt-5 space-y-1">
                {problems.map((p) => (
                  <li key={p.text} className="type-small">
                    <button
                      type="button"
                      className="min-h-11 text-left font-semibold text-status-alert-fg underline-offset-4 hover:underline lg:min-h-0"
                      onClick={() => {
                        setStep(p.step);
                        setTried(true);
                      }}
                    >
                      {p.text}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            {canWrite ? (
              <button type="button" className={cn(btn.primary, "mt-6 hidden w-full lg:inline-flex lg:h-11")} disabled={problems.length > 0 || busy} onClick={() => setConfirm(true)}>
                {seed?.replaces ? "Issue the corrected certificate" : `Issue ${count ? noun : "certificates"}`}
              </button>
            ) : (
              <p className="mt-6 type-small text-muted-foreground">Only the Super Admin can issue certificates.</p>
            )}
          </section>
        </div>

        {/* Preview: phone step 4, desktop beside the form. */}
        <aside className={cn(visible(3), "min-w-0 lg:sticky lg:top-[calc(var(--top-h,3.5rem)+1.5rem)]")} aria-label="Certificate preview">
          <div className="overflow-hidden rounded-[var(--ds-radius)] border-[1.5px] border-[var(--ds-card-line)] bg-white">
            <StudioPreview doc={deferredDoc} images={images} />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="min-w-0 type-small text-muted-foreground [overflow-wrap:anywhere]">
              {shown ? (
                <>
                  Showing <span className="font-semibold text-foreground">{shown.name || "no name"}</span>
                </>
              ) : (
                "Pick someone to see their name here."
              )}
            </p>
            <div className="flex items-center gap-1">
              {count > 1 ? (
                <>
                  <button type="button" className={cn(btn.ghost, "w-11 px-0 lg:w-9")} aria-label="Previous person" onClick={() => setShowing((i) => (Math.min(i, count - 1) - 1 + count) % count)}>
                    <ChevronLeft aria-hidden />
                  </button>
                  <span className="min-w-12 text-center type-small text-muted-foreground type-num">
                    {Math.min(showing, count - 1) + 1} / {count}
                  </span>
                  <button type="button" className={cn(btn.ghost, "w-11 px-0 lg:w-9")} aria-label="Next person" onClick={() => setShowing((i) => (Math.min(i, count - 1) + 1) % count)}>
                    <ChevronRight aria-hidden />
                  </button>
                </>
              ) : null}
              <button type="button" className={btn.quiet} onClick={() => setZoomOpen(true)}>
                <ZoomIn aria-hidden /> Zoom
              </button>
            </div>
          </div>
          <p className="mt-2 type-caption text-muted-foreground">A4 landscape. The ID and QR code are filled in when it is issued.</p>
        </aside>
      </div>

      {/* Phone: Back and Next, in thumb reach. */}
      <div className="fixed inset-x-0 bottom-[var(--nav-h,0px)] z-30 flex items-center gap-3 border-t border-[var(--ds-hairline)] bg-background px-5 py-3 lg:hidden">
        <button
          type="button"
          className={cn(btn.quiet, "h-12")}
          disabled={step === 0}
          onClick={() => {
            setTried(false);
            setStep((s) => Math.max(0, s - 1));
          }}
        >
          <ArrowLeft aria-hidden /> Back
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" className={cn(btn.primary, "h-12 flex-1")} onClick={next}>
            {STEPS[step + 1]} <ArrowRight aria-hidden />
          </button>
        ) : canWrite ? (
          <button type="button" className={cn(btn.primary, "h-12 flex-1")} disabled={problems.length > 0 || busy} onClick={() => setConfirm(true)}>
            Issue {count ? noun : ""}
          </button>
        ) : null}
      </div>
      {tried && stepProblem(step) ? (
        <p role="alert" className="fixed inset-x-0 bottom-[calc(var(--nav-h,0px)+4.5rem)] z-30 bg-status-alert-bg px-5 py-2 type-small font-semibold text-status-alert-fg lg:hidden">
          {stepProblem(step)}
        </p>
      ) : null}

      <Dialog open={confirm} onOpenChange={(o) => !busy && setConfirm(o)}>
        <DialogContent data-admin-v2>
          <DialogHeader>
            <DialogTitle>{seed?.replaces ? "Issue the corrected certificate?" : `Issue ${noun}?`}</DialogTitle>
            <DialogDescription>
              {def.label}: {title.trim() || def.titleHint}
              {expiresOn ? `, until ${longDate(expiresOn)}` : ""}.
            </DialogDescription>
          </DialogHeader>
          <ul className="flex flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)] type-small">
            <li className="flex justify-between gap-3 py-2">
              <span>App notifications</span>
              <span className="font-semibold type-num">{count}</span>
            </li>
            <li className="flex justify-between gap-3 py-2">
              <span>Emails now</span>
              <span className="font-semibold type-num">{emailNow}</span>
            </li>
            {emailWait > 0 ? (
              <li className="flex justify-between gap-3 py-2">
                <span>Emails waiting</span>
                <span className="font-semibold type-num">{emailWait}</span>
              </li>
            ) : null}
          </ul>
          {seed?.replaces ? <p className="type-small text-muted-foreground">The old certificate will show as revoked and point to the new one.</p> : null}
          <DialogFooter>
            <button type="button" className={btn.quiet} disabled={busy} onClick={() => setConfirm(false)}>
              Not yet
            </button>
            <button type="button" className={btn.primary} disabled={busy} onClick={() => void issue()}>
              {busy ? <Loader2 className="animate-spin" aria-hidden /> : null} {busy ? "Issuing" : "Issue"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent data-admin-v2 className="flex h-dvh max-h-dvh w-screen max-w-none flex-col gap-0 rounded-none border-0 p-0 sm:max-w-none">
          <DialogHeader className="flex-row items-center justify-between gap-3 border-b border-[var(--ds-hairline)] py-2 pr-14 pl-5">
            <DialogTitle className="type-h3">Preview</DialogTitle>
            <DialogDescription className="sr-only">The certificate at a larger size. Scroll to move around.</DialogDescription>
            <div className="flex items-center gap-1">
              <button type="button" className={cn(btn.quiet, "w-11 px-0 lg:w-9")} aria-label="Smaller" disabled={zoom <= 1} onClick={() => setZoom((z) => Math.max(1, z - 0.5))}>
                <Minus aria-hidden />
              </button>
              <span className="min-w-12 text-center type-small type-num">{Math.round(zoom * 100)}%</span>
              <button type="button" className={cn(btn.quiet, "w-11 px-0 lg:w-9")} aria-label="Larger" disabled={zoom >= 4} onClick={() => setZoom((z) => Math.min(4, z + 0.5))}>
                <Plus aria-hidden />
              </button>
            </div>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-[var(--ds-tint)] p-4 [touch-action:pan-x_pan-y_pinch-zoom]">
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
  if (d?.queued.length) rows.push({ label: "Email waiting", names: d.queued, note: d.queueMissing ? "The queue isn't in the database yet. Use Send again on each one tomorrow." : "Send them from Issued when today's allowance is back." });
  if (d?.failed.length) rows.push({ label: "Email failed", names: d.failed.map((f) => `${f.name} (${f.reason})`) });
  if (d?.noEmail.length && !d.emailOff) rows.push({ label: "No email on file", names: d.noEmail });
  if (report.skipped.length) rows.push({ label: "Not issued", names: report.skipped.map((s) => `${s.name} (${s.reason})`) });
  if (report.warnings?.length) rows.push({ label: "Please check", names: report.warnings });
  return (
    <div className="flex max-w-2xl min-w-0 flex-col gap-6" role="status">
      <div>
        <h2 className="type-h2">
          {n} certificate{n === 1 ? "" : "s"} {report.repeat ? "already issued" : "issued"}
        </h2>
        {report.repeat ? <p className="mt-2 type-small">This was sent twice. Nothing new was issued, here is the first result.</p> : null}
        <p className="mt-2 type-small text-muted-foreground">
          Everyone has a notification in the app.{d?.emailOff ? " Email isn't set up on this site, so no emails went out." : ""}
          {report.replaced ? ` ${report.replaced} is now revoked.` : ""}
        </p>
      </div>
      <ResultList rows={rows} />
      <ul className="flex flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
        {report.issued.slice(0, 100).map((i) => (
          <li key={i.credentialId}>
            <Link href={`/verify/${i.credentialId}`} target="_blank" className="-mx-2 flex min-h-12 items-center justify-between gap-3 rounded-md px-2 py-2 outline-none hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring">
              <span className="min-w-0 type-small font-semibold [overflow-wrap:anywhere]">{i.name}</span>
              <span className="shrink-0 font-mono type-caption text-muted-foreground">{i.credentialId}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/credentials/issued" className={btn.primary}>
          See what was issued
        </Link>
        <button type="button" className={btn.quiet} onClick={onAgain}>
          Make another
        </button>
      </div>
    </div>
  );
}
