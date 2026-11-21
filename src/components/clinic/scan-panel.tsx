"use client";

import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { SuccessMark } from "@/components/ds/motion";
import { fieldClass, labelClass, primaryButton, quietButton } from "@/components/ds/parts";
import type { ClinicDirection, ClinicScanConfirm, ClinicScanConfirmBody, ClinicScanIdentify, ClinicScanIdentifyBody } from "@/lib/clinic/types";
import { cn } from "@/lib/utils";
import { cleanCode, dayShort, duration, instantClock, scanFailure, scanStateLine, scanText, timeRange, type ScanFailure } from "./format";
import type { Res } from "./result";
import { QrScanner } from "./scanner";

/**
 * Marking attendance, one step at a time:
 *   scan     the camera reads the class QR code, or the student types the 6 characters
 *   choose   the session, the time and where the student stands; two big,
 *            well separated buttons, Mark IN above and Mark OUT below. The one
 *            that makes no sense now is off, with one line saying why
 *   confirm  "You are marking IN for <session>", Confirm or Cancel
 *   done     what was recorded and the time
 *   failed   the reason and what to do
 * Reading a code only looks the session up. Nothing is chosen for the
 * student and nothing is saved until Confirm, which sends once.
 */

type Step = { id: ClinicScanIdentify; /** When the ticket runs out, on this device's clock. */ deadline: number };
type Chosen = Step & { direction: ClinicDirection; /** One Confirm press: sent again unchanged on Retry, so it can never save twice. */ attemptId: string };
type Phase =
  | { k: "scan" }
  | { k: "identifying" }
  | ({ k: "choose" } & Step)
  | ({ k: "confirm"; sending: boolean } & Chosen)
  | ({ k: "unsent" } & Chosen)
  | { k: "done"; r: ClinicScanConfirm }
  | ({ k: "failed" } & ScanFailure);

type Props = {
  identify: (body: ClinicScanIdentifyBody) => Promise<Res<ClinicScanIdentify>>;
  confirm: (body: ClinicScanConfirmBody) => Promise<Res<ClinicScanConfirm>>;
  /** How long to wait for an answer before saying it did not go through. */
  timeoutMs?: number;
};

const WORD: Record<ClinicDirection, string> = { in: "IN", out: "OUT" };
const TOO_LONG: ScanFailure = { title: "That took too long", body: "Scan the code again." };
const SLOW = Symbol("slow");

function newAttemptId(): string {
  const c = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  const b = new Uint8Array(16);
  c.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}

/** The answer, or SLOW after `ms`. A late answer is ignored; Retry sends the same press again, which is safe. */
function within<T>(p: Promise<T>, ms: number): Promise<T | typeof SLOW> {
  return new Promise((resolve, reject) => {
    const t = window.setTimeout(() => resolve(SLOW), ms);
    p.then(
      (v) => (window.clearTimeout(t), resolve(v)),
      (e) => (window.clearTimeout(t), reject(e)),
    );
  });
}

export function ScanPanel({ identify, confirm, timeoutMs = 20_000 }: Props) {
  const [phase, setPhase] = React.useState<Phase>({ k: "scan" });
  const [code, setCode] = React.useState("");
  const [codeError, setCodeError] = React.useState<string | null>(null);
  const headRef = React.useRef<HTMLDivElement>(null);
  /** True from a press until its answer: a second press in between does nothing. */
  const lock = React.useRef(false);

  // Each new step is read out and found by the eye: focus moves to it.
  const k = phase.k;
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) first.current = false;
    else if (k !== "identifying") headRef.current?.focus();
  }, [k]);

  async function lookUp(body: ClinicScanIdentifyBody) {
    if (lock.current) return;
    lock.current = true;
    setPhase({ k: "identifying" });
    try {
      const res = await within(identify(body), timeoutMs);
      if (res === SLOW) setPhase({ k: "failed", title: "No answer", body: "The internet is slow or off. Nothing was marked. Check it and scan again." });
      else if (!res.ok) setPhase({ k: "failed", ...scanFailure(res) });
      else {
        setCode("");
        setPhase({ k: "choose", id: res.data, deadline: Date.now() + Math.max(0, Date.parse(res.data.ticketExpiresAt) - Date.parse(res.data.now)) });
      }
    } catch {
      setPhase({ k: "failed", title: "No internet", body: "Nothing was marked. Check your internet and scan again." });
    } finally {
      lock.current = false;
    }
  }

  function onRead(raw: string) {
    const token = scanText(raw);
    if (!token) return setPhase({ k: "failed", title: "That code did not work", body: "That is not a VIBHA attendance code. Scan the code on the admin's screen." });
    void lookUp({ token });
  }

  function onSubmitCode(e: React.FormEvent) {
    e.preventDefault();
    const c = cleanCode(code);
    if (!c) return setCodeError("The code has 6 letters and numbers.");
    setCodeError(null);
    void lookUp({ code: c });
  }

  function choose(step: Step, direction: ClinicDirection) {
    if (!step.id[direction].allowed) return;
    if (Date.now() > step.deadline) return setPhase({ k: "failed", ...TOO_LONG });
    setPhase({ k: "confirm", sending: false, id: step.id, deadline: step.deadline, direction, attemptId: newAttemptId() });
  }

  async function send(c: Chosen) {
    if (lock.current) return;
    if (Date.now() > c.deadline) return setPhase({ k: "failed", ...TOO_LONG });
    const { id, deadline, direction, attemptId } = c;
    const unsent: Phase = { k: "unsent", id, deadline, direction, attemptId };
    if (typeof navigator !== "undefined" && navigator.onLine === false) return setPhase(unsent);
    lock.current = true;
    setPhase({ k: "confirm", sending: true, id, deadline, direction, attemptId });
    try {
      const res = await within(confirm({ ticket: id.ticket, direction, attemptId }), timeoutMs);
      if (res === SLOW) setPhase(unsent);
      else if (res.ok) setPhase({ k: "done", r: res.data });
      else setPhase({ k: "failed", ...scanFailure(res) });
    } catch {
      setPhase(unsent);
    } finally {
      lock.current = false;
    }
  }

  const again = () => setPhase({ k: "scan" });

  return (
    <div className="flex min-w-0 flex-col gap-[var(--ds-section)]">
      <div ref={headRef} tabIndex={-1} aria-live="polite" className="min-w-0 outline-hidden">
        {phase.k === "choose" ? <Choose step={phase} onChoose={(d) => choose(phase, d)} onCancel={again} /> : null}
        {phase.k === "confirm" ? <Confirm c={phase} sending={phase.sending} onConfirm={() => void send(phase)} onCancel={() => setPhase({ k: "choose", id: phase.id, deadline: phase.deadline })} /> : null}
        {phase.k === "unsent" ? <Unsent c={phase} onRetry={() => void send(phase)} onAgain={again} /> : null}
        {phase.k === "done" ? <Done r={phase.r} /> : null}
        {phase.k === "failed" ? <Failed f={phase} onAgain={again} /> : null}
        {phase.k === "identifying" ? (
          <p role="status" className="type-body text-muted-foreground">
            Checking the code
          </p>
        ) : null}
      </div>

      {phase.k === "scan" || phase.k === "identifying" ? (
        <>
          <section aria-labelledby="scan-camera" className="flex min-w-0 flex-col gap-3">
            <h2 id="scan-camera" className="type-h3">
              Scan the code
            </h2>
            <QrScanner onRead={onRead} busy={phase.k === "identifying"} />
          </section>

          <section aria-labelledby="scan-type" className="flex min-w-0 flex-col gap-3">
            <h2 id="scan-type" className="type-h3">
              Or type the code
            </h2>
            <form onSubmit={onSubmitCode} className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex min-w-0 flex-col gap-1.5 sm:w-56">
                <span className={labelClass}>Code under the QR</span>
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase().slice(0, 8));
                    setCodeError(null);
                  }}
                  inputMode="text"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  maxLength={8}
                  aria-invalid={codeError ? true : undefined}
                  aria-describedby={codeError ? "code-error" : undefined}
                  className={cn(fieldClass, "font-mono text-xl tracking-[0.3em] uppercase")}
                />
              </label>
              <button type="submit" disabled={phase.k === "identifying" || !code.trim()} className={cn(primaryButton, "min-h-14 sm:w-auto")}>
                {phase.k === "identifying" ? "Checking" : "Check the code"}
              </button>
            </form>
            {codeError ? (
              <p id="code-error" role="alert" className="type-small text-status-alert-fg">
                {codeError}
              </p>
            ) : null}
          </section>
        </>
      ) : null}
    </div>
  );
}

/** The session this is about: name, day and time, place. */
function SessionLines({ s }: { s: ClinicScanIdentify["session"] }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <h2 className="type-h2 [overflow-wrap:anywhere]">{s.title}</h2>
      <p className="type-body text-muted-foreground [overflow-wrap:anywhere]">
        {dayShort(s.date)}, {timeRange(s.start, s.end)}
        {s.place ? `, ${s.place}` : ""}
      </p>
    </div>
  );
}

/** One of the two big choices. Off: greyed, not pressable, with its reason read out and shown under it. */
const bigChoice =
  "flex min-h-16 w-full min-w-0 cursor-pointer items-center gap-4 rounded-[var(--ds-radius)] border-2 border-foreground bg-card px-5 py-4 text-left type-h3 text-foreground outline-hidden ds-press hover:bg-[var(--ds-tint)] focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:cursor-not-allowed disabled:border-[var(--ds-card-line)] disabled:bg-transparent disabled:text-muted-foreground [&_svg]:size-7 [&_svg]:shrink-0";

function Choose({ step, onChoose, onCancel }: { step: Step; onChoose: (d: ClinicDirection) => void; onCancel: () => void }) {
  const { id } = step;
  const item = (d: ClinicDirection) => {
    const c = id[d];
    const Icon = d === "in" ? LogIn : LogOut;
    return (
      <div className="flex min-w-0 flex-col gap-1.5">
        <button type="button" disabled={!c.allowed} aria-describedby={c.reason ? `why-${d}` : undefined} onClick={() => onChoose(d)} className={bigChoice}>
          <Icon aria-hidden />
          <span>Mark {WORD[d]}</span>
        </button>
        {c.reason ? (
          <p id={`why-${d}`} className="type-small text-muted-foreground">
            {c.reason}
          </p>
        ) : null}
      </div>
    );
  };
  return (
    <section aria-label="Mark attendance" className="flex min-w-0 flex-col gap-5">
      <SessionLines s={id.session} />
      <p className="type-body font-semibold [overflow-wrap:anywhere]">{scanStateLine(id)}</p>
      {/* IN is always the upper one and OUT the lower one, a full gap apart. Neither is chosen for the student. */}
      <div className="flex min-w-0 flex-col gap-8">
        {item("in")}
        {item("out")}
      </div>
      <button type="button" onClick={onCancel} className={cn(quietButton, "min-h-14 self-start")}>
        Cancel
      </button>
    </section>
  );
}

function Confirm({ c, sending, onConfirm, onCancel }: { c: Chosen; sending: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <section aria-label="Confirm" className="flex min-w-0 flex-col gap-5">
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="type-h2 [overflow-wrap:anywhere]">
          You are marking {WORD[c.direction]} for {c.id.session.title}
        </h2>
        <p className="type-body text-muted-foreground">
          {dayShort(c.id.session.date)}, {timeRange(c.id.session.start, c.id.session.end)}
        </p>
      </div>
      <div className="flex min-w-0 flex-col gap-6">
        <button type="button" onClick={onConfirm} disabled={sending} aria-busy={sending || undefined} className={cn(primaryButton, "min-h-14")}>
          {sending ? "Sending" : `Confirm ${WORD[c.direction]}`}
        </button>
        <button type="button" onClick={onCancel} disabled={sending} className={cn(quietButton, "min-h-14")}>
          Cancel
        </button>
      </div>
    </section>
  );
}

/** It did not reach the server. Said plainly; never kept to send later. */
function Unsent({ c, onRetry, onAgain }: { c: Chosen; onRetry: () => void; onAgain: () => void }) {
  return (
    <section role="alert" className="flex min-w-0 flex-col gap-5">
      <div className="flex min-w-0 flex-col gap-2 border-l-4 border-status-alert-fg py-1 pl-4">
        <h2 className="type-h3 text-status-alert-fg">Not marked yet</h2>
        <p className="type-body [overflow-wrap:anywhere]">
          Your {WORD[c.direction]} for {c.id.session.title} did not go through. Check your internet, then try again. It will not be sent later on its own.
        </p>
      </div>
      <div className="flex min-w-0 flex-col gap-6">
        <button type="button" onClick={onRetry} className={cn(primaryButton, "min-h-14")}>
          Try again
        </button>
        <button type="button" onClick={onAgain} className={cn(quietButton, "min-h-14")}>
          Scan again
        </button>
      </div>
    </section>
  );
}

function Failed({ f, onAgain }: { f: ScanFailure; onAgain: () => void }) {
  return (
    <section role="alert" className="flex min-w-0 flex-col gap-5">
      <div className="flex min-w-0 flex-col gap-2 border-l-4 border-status-alert-fg py-1 pl-4">
        <h2 className="type-h3 text-status-alert-fg">{f.title}</h2>
        <p className="type-body [overflow-wrap:anywhere]">{f.body}</p>
      </div>
      <button type="button" onClick={onAgain} className={cn(primaryButton, "min-h-14 self-start")}>
        Scan again
      </button>
    </section>
  );
}

function Done({ r }: { r: ClinicScanConfirm }) {
  const inDir = r.direction === "in";
  return (
    <section className="flex min-w-0 flex-col gap-5">
      <div className="ds-success flex min-w-0 items-start gap-4">
        <SuccessMark size={48} />
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="type-h2 [overflow-wrap:anywhere]">
            {r.already ? "Already marked" : "Marked"} {WORD[r.direction]} at {instantClock(r.at)}
          </h2>
          <p className="type-body [overflow-wrap:anywhere]">{r.title}</p>
          {r.already ? <p className="type-small text-muted-foreground">Nothing was changed.</p> : null}
          {inDir && r.late ? <p className="type-small font-semibold text-status-pending-fg">Marked late.</p> : null}
          {!inDir && r.minutes !== null ? <p className="type-small text-muted-foreground">Present for {duration(r.minutes)}.</p> : null}
          {inDir && !r.already ? <p className="type-small text-muted-foreground">Scan again when you leave to mark OUT.</p> : null}
        </div>
      </div>
      <Link href="/attendance" className={cn(primaryButton, "min-h-14 self-start")}>
        Done
      </Link>
    </section>
  );
}
