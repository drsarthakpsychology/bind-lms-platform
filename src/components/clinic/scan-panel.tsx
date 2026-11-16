"use client";

import * as React from "react";

import { SuccessMark } from "@/components/ds/motion";
import { fieldClass, labelClass, primaryButton, quietButton } from "@/components/ds/parts";
import type { ClinicDirection, ClinicScanBody, ClinicScanResult } from "@/lib/clinic/types";
import { cn } from "@/lib/utils";
import { cleanCode, duration, instantClock, scanText } from "./format";
import type { Res } from "./result";
import { QrScanner } from "./scanner";

/**
 * The student's attendance screen: the camera reads the class QR code, or
 * the student types the 6-character code (online classes, a camera that
 * will not open). One result at a time: IN or OUT, the time, late or not.
 */

type Shown = { kind: "done"; r: ClinicScanResult } | { kind: "error"; text: string } | null;

export function ScanPanel({ scan }: { scan: (body: ClinicScanBody) => Promise<Res<ClinicScanResult>> }) {
  const [busy, setBusy] = React.useState(false);
  const [shown, setShown] = React.useState<Shown>(null);
  const [code, setCode] = React.useState("");
  const [direction, setDirection] = React.useState<ClinicDirection | null>(null);
  const [codeError, setCodeError] = React.useState<string | null>(null);
  const resultRef = React.useRef<HTMLDivElement>(null);

  async function send(body: ClinicScanBody) {
    if (busy) return;
    setBusy(true);
    try {
      const res = await scan(direction ? { ...body, direction } : body);
      setShown(res.ok ? { kind: "done", r: res.data } : { kind: "error", text: res.error });
      if (res.ok) setCode("");
    } catch {
      setShown({ kind: "error", text: "Could not reach the server. Check your internet and try again." });
    } finally {
      setBusy(false);
      // Move focus to the answer so screen readers hear it and the eye finds it.
      window.setTimeout(() => resultRef.current?.focus(), 0);
    }
  }

  function onRead(raw: string) {
    const token = scanText(raw);
    if (!token) {
      setShown({ kind: "error", text: "That QR code is not a VIBHA attendance code." });
      return;
    }
    void send({ token });
  }

  function onSubmitCode(e: React.FormEvent) {
    e.preventDefault();
    const c = cleanCode(code);
    if (!c) {
      setCodeError("The code has 6 letters and numbers.");
      return;
    }
    setCodeError(null);
    void send({ code: c });
  }

  return (
    <div className="flex min-w-0 flex-col gap-[var(--ds-section)]">
      <div ref={resultRef} tabIndex={-1} aria-live="polite" className="min-w-0 outline-hidden">
        {shown ? <ScanResult shown={shown} onAgain={() => setShown(null)} /> : null}
      </div>

      <section aria-labelledby="scan-camera" className="flex min-w-0 flex-col gap-3">
        <h2 id="scan-camera" className="type-h3">
          Scan the code
        </h2>
        <QrScanner onRead={onRead} busy={busy} />
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
          <button type="submit" disabled={busy || !code.trim()} className={cn(primaryButton, "sm:w-auto")}>
            {busy ? "Checking" : "Send"}
          </button>
        </form>
        {codeError ? (
          <p id="code-error" role="alert" className="type-small text-status-alert-fg">
            {codeError}
          </p>
        ) : null}
      </section>

      <fieldset className="flex min-w-0 flex-col gap-2">
        <legend className={cn(labelClass, "pb-1")}>Count this scan as</legend>
        <div className="flex min-w-0 flex-wrap gap-2">
          {([null, "in", "out"] as const).map((d) => (
            <button
              key={String(d)}
              type="button"
              aria-pressed={direction === d}
              onClick={() => setDirection(d)}
              className={cn(
                "ds-press inline-flex min-h-11 items-center rounded-full border-[1.5px] px-4 type-small font-semibold outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                direction === d ? "border-foreground bg-foreground text-background" : "border-[var(--ds-card-line)] hover:border-foreground",
              )}
            >
              {d === null ? "Next step" : d === "in" ? "In" : "Out"}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function ScanResult({ shown, onAgain }: { shown: NonNullable<Shown>; onAgain: () => void }) {
  if (shown.kind === "error") {
    return (
      <div role="alert" className="flex min-w-0 flex-col gap-2 border-l-4 border-status-alert-fg py-1 pl-4">
        <p className="type-h3 text-status-alert-fg">Not counted</p>
        <p className="type-body [overflow-wrap:anywhere]">{shown.text}</p>
        <button type="button" onClick={onAgain} className={cn(quietButton, "self-start")}>
          Try again
        </button>
      </div>
    );
  }
  const r = shown.r;
  const inDir = r.direction === "in";
  return (
    <div className="ds-success flex min-w-0 items-start gap-4">
      <SuccessMark size={48} />
      <div className="flex min-w-0 flex-col gap-1">
        <p className="type-caption font-semibold text-muted-foreground">{inDir ? "IN" : "OUT"}</p>
        <p className="type-h2 [overflow-wrap:anywhere]">
          {inDir ? "You are in" : "You are out"} at {instantClock(r.at)}
        </p>
        <p className="type-body [overflow-wrap:anywhere]">{r.title}</p>
        {r.late ? <p className="type-small font-semibold text-status-pending-fg">Marked late.</p> : null}
        {!inDir && r.minutes !== null ? <p className="type-small text-muted-foreground">Present for {duration(r.minutes)}.</p> : null}
        {inDir ? <p className="type-small text-muted-foreground">Scan again when you leave.</p> : null}
      </div>
    </div>
  );
}
