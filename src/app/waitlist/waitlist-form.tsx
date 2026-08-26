"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Rule, Stamp } from "@/components/landing/landing-primitives";
import { cohortDeadlineText } from "@/lib/brand";
import { trackEvent } from "@/lib/analytics";
import { submitWaitlist } from "./actions";

const STATUSES = [
  { value: "student", label: "Student" },
  { value: "early_career", label: "Early-career professional" },
  { value: "practitioner", label: "Practising professional" },
  { value: "other", label: "Something else" },
];

/**
 * A field-group label. The left pitch already carries the 01/02/03 process
 * steps, so the form sections use the eyebrow's dot marker instead — same
 * editorial language, no competing number sequences on one screen.
 */
function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-eyebrow text-muted-foreground">
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
      {children}
    </p>
  );
}

/**
 * The public waitlist form. Calls the server action (rate-limited, validated,
 * honeypot-guarded). On success shows the honest confirmation.
 */
export function WaitlistForm() {
  const [state, setState] = React.useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    setError(null);
    const form = e.currentTarget;
    const res = await submitWaitlist(new FormData(form));
    if (res.ok) {
      // Funnel event. Non-identifying only — the applicant's status bucket is
      // useful for cohort mix; name/email/phone never leave the DB as events.
      trackEvent("waitlist_joined", {
        status: new FormData(form).get("status") ?? "unknown",
      });
      setState("done");
    } else {
      setState("idle");
      setError(res.error ?? "Something went wrong.");
    }
  }

  // A one-shot state-transition entrance: the confirmation rises in when the
  // submission lands. Reduced-motion renders it in place.
  const reduceMotion = useReducedMotion();
  if (state === "done") {
    return (
      <motion.div
        className="py-2 text-center"
        initial={reduceMotion === false ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Stamp className="rotate-[6deg]">Invite-only</Stamp>
        <p className="mt-6 text-xl font-bold text-foreground">You&apos;re on the waitlist.</p>
        <Rule className="mx-auto mt-5 max-w-[10rem]" />
        <p className="mx-auto mt-5 max-w-sm text-small text-muted-foreground">
          {cohortDeadlineText()}. If you&apos;re a fit, someone will reach you within a few
          days.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Sheet header: the invite mark over the first score line. */}
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Join the waitlist
          </p>
          <Stamp>Invite-only</Stamp>
        </div>
        <Rule className="mt-3" />
      </div>

      {/* Your details */}
      <fieldset className="space-y-3">
        <legend className="sr-only">Your details</legend>
        <GroupLabel>Your details</GroupLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required minLength={2} maxLength={120} autoComplete="name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
        </div>
      </fieldset>

      {/* About you */}
      <fieldset className="space-y-3">
        <legend className="sr-only">About you</legend>
        <GroupLabel>About you</GroupLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={40}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status">You are…</Label>
            <Select name="status" defaultValue="student">
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Pick one" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </fieldset>

      {/* A note */}
      <fieldset className="space-y-3">
        <legend className="sr-only">A note</legend>
        <GroupLabel>A note</GroupLabel>
        <div className="space-y-1.5">
          <Label htmlFor="message">Anything we should know? (optional)</Label>
          <Textarea
            id="message"
            name="message"
            rows={4}
            maxLength={2000}
            placeholder="Course, stage, what you're hoping for…"
          />
        </div>
      </fieldset>

      {/* Terms acceptance — required and unticked. The browser's native
          constraint validation blocks submit until it's checked, and the
          server action re-validates (defense-in-depth) before persisting the
          acceptance timestamp + policy version with the enquiry. */}
      <fieldset className="space-y-3">
        <legend className="sr-only">Terms acceptance</legend>
        <GroupLabel>Before you join</GroupLabel>
        <label className="flex items-start gap-3 text-small leading-relaxed text-foreground">
          <input
            type="checkbox"
            name="policyAccepted"
            value="true"
            required
            aria-required="true"
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-primary"
          />
          <span>
            I have read and accept the{" "}
            <a
              href="/policies/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link underline underline-offset-4 hover:text-foreground"
            >
              Terms and Conditions
            </a>
            ,{" "}
            <a
              href="/policies/refund"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link underline underline-offset-4 hover:text-foreground"
            >
              Refund and Cancellation Policy
            </a>{" "}
            and{" "}
            <a
              href="/policies/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link underline underline-offset-4 hover:text-foreground"
            >
              Privacy Policy
            </a>
            . I understand that fees are non-refundable.
          </span>
        </label>
      </fieldset>

      {/* Honeypot — hidden from humans, bots fill it. */}
      <input
        type="text"
        name="honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {error ? (
        <p className="text-small font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={state === "submitting"} className="w-full font-semibold">
        {state === "submitting" ? "Joining…" : "Join waitlist"}
      </Button>
    </form>
  );
}
