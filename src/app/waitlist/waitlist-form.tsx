"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CONTACT } from "@/components/home/content";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { submitWaitlist } from "./actions";

const STATUSES = [
  { value: "student", label: "Student" },
  { value: "early_career", label: "Early-career professional" },
  { value: "practitioner", label: "Practising professional" },
  { value: "other", label: "Something else" },
] as const;

const linkCls = "font-medium text-link underline underline-offset-4 hover:text-foreground";

/**
 * The invitation request. Same server action and field names as before
 * (rate-limited, validated, honeypot-guarded); only the presentation changed:
 *
 * - One column, in the order people answer: who, how to reach you, about
 *   you, a note, the terms, one button. Phone keyboards match each field
 *   (name capitalises, email and phone get their own keyboards, Next moves on).
 * - "You are" is four tap targets instead of a dropdown: everything visible,
 *   one tap, no popover on a phone.
 * - States: sending (spinner, button locked), error (an alert with the
 *   server's message, focus moved to it), done (an in-place confirmation
 *   that is focused and scrolled into view, with what happens next).
 */
export function WaitlistForm() {
  const [state, setState] = React.useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = React.useState<string | null>(null);
  const doneRef = React.useRef<HTMLHeadingElement>(null);
  const errorRef = React.useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const res = await submitWaitlist(data);
    if (res.ok) {
      // Funnel event. Non-identifying only: the status bucket is useful for
      // cohort mix; name/email/phone never leave the DB as events.
      trackEvent("waitlist_joined", { status: data.get("status") ?? "unknown" });
      setState("done");
      requestAnimationFrame(() => {
        doneRef.current?.focus();
        doneRef.current?.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
      });
    } else {
      setState("idle");
      setError(res.error ?? "Something went wrong. Please try again.");
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  }

  if (state === "done") {
    return (
      <motion.div
        className="py-4 text-center sm:py-6"
        initial={reduceMotion === false ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <span
          aria-hidden
          className="mx-auto flex size-14 items-center justify-center rounded-full border-2 border-foreground bg-primary text-primary-foreground hard-shadow-sm"
        >
          <Check className="size-7" strokeWidth={3} />
        </span>
        <h2 ref={doneRef} tabIndex={-1} className="mt-5 text-h2 text-foreground outline-none">
          Request sent
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-body text-muted-foreground">
          We reply personally. If you&apos;re a fit, someone will reach you within a few days.
        </p>
        <div className="mt-6 flex flex-col items-stretch gap-2 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <a href={CONTACT.whatsappHref}>Message us on WhatsApp</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">Back to the homepage</Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  const busy = state === "submitting";

  return (
    <form onSubmit={onSubmit} className="space-y-5" aria-busy={busy || undefined}>
      <div className="space-y-1.5">
        <Label htmlFor="name">Your name</Label>
        <Input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={120}
          autoComplete="name"
          autoCapitalize="words"
          enterKeyHint="next"
          placeholder="First and last name"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            required
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="next"
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">
            Phone <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="next"
            maxLength={40}
            placeholder="+91"
          />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm leading-none font-medium">You are</legend>
        <div className="grid grid-cols-2 gap-2">
          {STATUSES.map((s, i) => (
            <label key={s.value} className="relative">
              <input
                type="radio"
                name="status"
                value={s.value}
                defaultChecked={i === 0}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "flex min-h-12 cursor-pointer items-center rounded-md border-2 border-foreground/25 bg-card px-3 py-2 text-small font-semibold leading-snug text-foreground transition-[background-color,border-color,box-shadow] duration-150",
                  "hover:border-foreground",
                  "peer-checked:border-foreground peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:hard-shadow-xs",
                  "peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/60"
                )}
              >
                {s.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <Label htmlFor="message">
          Anything we should know? <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={3}
          maxLength={2000}
          placeholder="Your course, your stage, what you hope to learn"
        />
      </div>

      {/* Terms acceptance: required and unticked. The browser blocks submit
          until it's checked, and the server action re-validates before saving
          the acceptance time and policy version with the request. */}
      <label className="flex cursor-pointer items-start gap-3 rounded-md border-2 border-foreground/15 bg-background p-3 text-small leading-relaxed text-foreground has-[:checked]:border-foreground">
        <input
          type="checkbox"
          name="policyAccepted"
          value="true"
          required
          aria-required="true"
          className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[var(--brand)]"
        />
        <span>
          I accept the{" "}
          <a href="/policies/terms" target="_blank" rel="noopener noreferrer" className={linkCls}>
            Terms
          </a>
          ,{" "}
          <a href="/policies/refund" target="_blank" rel="noopener noreferrer" className={linkCls}>
            Refund and Cancellation Policy
          </a>{" "}
          and{" "}
          <a href="/policies/privacy" target="_blank" rel="noopener noreferrer" className={linkCls}>
            Privacy Policy
          </a>
          , and I understand fees are non-refundable.
        </span>
      </label>

      {/* Honeypot: hidden from humans, bots fill it. */}
      <input
        type="text"
        name="honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {error ? (
        <Alert variant="destructive" role="alert" ref={errorRef} tabIndex={-1} className="outline-none">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-3">
        <Button type="submit" size="lg" disabled={busy} className="w-full font-semibold">
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {busy ? "Sending…" : "Send my request"}
          {busy ? null : <ArrowRight className="size-4" aria-hidden />}
        </Button>
        <p className="text-center text-caption text-muted-foreground">
          Your details go only to the admissions team.
        </p>
      </div>
    </form>
  );
}
