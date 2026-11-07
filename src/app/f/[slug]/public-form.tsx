"use client";

import * as React from "react";
import type { FormField } from "@/lib/forms/fields";
import { FormFields } from "@/components/forms/form-fields";
import { Rule } from "@/components/landing/landing-primitives";
import { submitLinkForm } from "./actions";

/** The public form: native validation first, then the server checks again. */
export function PublicForm({ slug, fields }: { slug: string; fields: FormField[] }) {
  const [state, setState] = React.useState<"idle" | "sending" | "done" | "closed">("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    const form = e.currentTarget;
    // Pick many + must answer: the browser can't require "at least one" box, so check here.
    const missing = fields.filter((f) => f.type === "multiple_choice" && f.required && new FormData(form).getAll(f.key).length === 0);
    if (missing.length) {
      setErrors(Object.fromEntries(missing.map((f) => [f.key, "Pick at least one."])));
      setError("Please check the answers marked below.");
      return;
    }
    setState("sending");
    setError(null);
    setErrors({});
    try {
      const res = await submitLinkForm(slug, new FormData(form));
      if (res.ok) return setState("done");
      if (res.closed) return setState("closed");
      setState("idle");
      setError(res.error);
      setErrors(res.errors ?? {});
    } catch {
      setState("idle");
      setError("Could not send. Check your connection and try again.");
    }
  }

  if (state === "done" || state === "closed") {
    return (
      <div role="status" className="py-4 text-center">
        <p className="text-xl font-bold">{state === "done" ? "Thank you. Your answer is saved." : "This form is closed."}</p>
        <Rule className="mx-auto mt-5 max-w-[10rem]" />
        <p className="mt-5 text-small text-muted-foreground">{state === "done" ? "You can close this page now." : "It is not taking answers any more."}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormFields fields={fields} errors={errors} />
      {/* Honeypot: hidden from people, bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0">
        <label>
          Leave this empty
          <input type="text" name="_hp" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {error ? (
        <p role="alert" className="rounded-md border-2 border-destructive bg-status-alert-bg p-3 text-sm font-semibold text-status-alert-fg">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-md border-2 border-foreground bg-primary px-6 text-base font-bold text-primary-foreground hard-shadow-xs hover:-translate-y-0.5 hover:hard-shadow-sm active:translate-y-0 active:shadow-none disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
