"use client";

import * as React from "react";
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
import { submitEnquiry } from "./actions";

const STATUSES = [
  { value: "student", label: "Student" },
  { value: "early_career", label: "Early-career professional" },
  { value: "practitioner", label: "Practising professional" },
  { value: "other", label: "Something else" },
];

/**
 * The public enquiry form. Calls the server action (rate-limited, validated,
 * honeypot-guarded). On success shows the honest confirmation.
 */
export function EnquireForm() {
  const [state, setState] = React.useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    setError(null);
    const form = e.currentTarget;
    const res = await submitEnquiry(new FormData(form));
    if (res.ok) {
      setState("done");
    } else {
      setState("idle");
      setError(res.error ?? "Something went wrong.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-md border-2 border-foreground bg-card p-8 text-center hard-shadow-md">
        <p className="text-xl font-bold text-foreground">Thank you — we&apos;ll be in touch.</p>
        <p className="mt-2 text-small text-muted-foreground">
          Cohort One begins 20 August. If you&apos;re a fit, someone will reach you within a
          few days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" autoComplete="tel" maxLength={40} />
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

      <div className="space-y-1.5">
        <Label htmlFor="message">Anything we should know? (optional)</Label>
        <Textarea id="message" name="message" rows={4} maxLength={2000} placeholder="Course, stage, what you're hoping for…" />
      </div>

      {/* Honeypot — hidden from humans, bots fill it. */}
      <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      {error ? (
        <p className="text-small text-red-700" role="alert">{error}</p>
      ) : null}

      <Button type="submit" size="lg" disabled={state === "submitting"} className="w-full font-semibold">
        {state === "submitting" ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}
