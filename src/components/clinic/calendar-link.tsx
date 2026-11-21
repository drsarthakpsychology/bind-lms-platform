"use client";

import * as React from "react";
import { CalendarPlus } from "lucide-react";

import { fieldClass, quietButton, textButton } from "@/components/ds/parts";
import type { ClinicCalendarLink } from "@/lib/clinic/types";
import type { Res } from "./result";

export type CalendarActions = {
  load: () => Promise<Res<ClinicCalendarLink>>;
  reset: () => Promise<Res<ClinicCalendarLink>>;
};

/**
 * "Add to my calendar": the student's private calendar link for Google
 * Calendar or Apple Calendar, a copy button, and "Make a new link" (the old
 * one stops working). The link is fetched only when opened, so nobody gets a
 * link they never asked for.
 */
export function CalendarLinkPanel({ actions }: { actions: CalendarActions }) {
  const [open, setOpen] = React.useState(false);
  const [link, setLink] = React.useState<ClinicCalendarLink | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [said, setSaid] = React.useState<string | null>(null);
  const [confirm, setConfirm] = React.useState(false);
  const field = React.useRef<HTMLInputElement>(null);

  const run = async (fn: () => Promise<Res<ClinicCalendarLink>>, done?: string) => {
    setBusy(true);
    setError(null);
    setSaid(null);
    const r = await fn();
    setBusy(false);
    if (r.ok) {
      setLink(r.data);
      if (done) setSaid(done);
    } else setError(r.error);
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !link && !busy) void run(actions.load);
  };

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link.https);
      setSaid("Link copied.");
    } catch {
      field.current?.select();
      setSaid("Select the link and copy it.");
    }
  };

  return (
    <section aria-label="Add to my calendar" className="flex min-w-0 flex-col gap-3">
      <button type="button" className={`${quietButton} self-start`} aria-expanded={open} aria-controls="calendar-link" onClick={toggle}>
        <CalendarPlus aria-hidden />
        Add to my calendar
      </button>
      {open ? (
        <div id="calendar-link" className="flex min-w-0 flex-col gap-3 border-t border-[var(--ds-hairline)] pt-3">
          {busy && !link ? <p className="type-small text-muted-foreground">Getting your link.</p> : null}
          {error ? (
            <p role="alert" className="type-small text-destructive">
              {error}
            </p>
          ) : null}
          {link ? (
            <>
              <p className="type-small text-muted-foreground">Your classes and OPD days. It updates on its own when a session moves or is cancelled.</p>
              <div className="flex min-w-0 flex-wrap gap-2">
                <a className={quietButton} href={link.google} target="_blank" rel="noopener noreferrer">
                  Google Calendar
                </a>
                <a className={quietButton} href={link.webcal}>
                  Apple Calendar
                </a>
                <button type="button" className={quietButton} onClick={() => void copy()}>
                  Copy link
                </button>
              </div>
              <label className="flex min-w-0 flex-col gap-1">
                <span className="type-caption text-muted-foreground">Your link. Keep it to yourself.</span>
                <input ref={field} readOnly value={link.https} className={`${fieldClass} min-w-0 font-mono text-xs`} onFocus={(e) => e.currentTarget.select()} />
              </label>
              {confirm ? (
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="type-small">The old link stops working. Add the new one again.</span>
                  <button
                    type="button"
                    className={textButton}
                    disabled={busy}
                    onClick={() => {
                      setConfirm(false);
                      void run(actions.reset, "New link made. Add it to your calendar again.");
                    }}
                  >
                    Make a new link
                  </button>
                  <button type="button" className={textButton} onClick={() => setConfirm(false)}>
                    Keep this one
                  </button>
                </div>
              ) : (
                <button type="button" className={`${textButton} self-start`} onClick={() => setConfirm(true)}>
                  Make a new link
                </button>
              )}
            </>
          ) : null}
          {said ? (
            <p role="status" className="type-small">
              {said}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
