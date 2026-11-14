"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, ShieldCheck } from "lucide-react";
import { checkMyDetails, submitMyDetails } from "@/app/(dashboard)/details-actions";
import { EMPTY_DETAILS, LABELS, OCCUPATIONS, QUALIFICATIONS, STATES, type Details } from "@/lib/profile-details/fields";
import { cn } from "@/lib/utils";
import { useUiV2 } from "@/components/v2me/ui-v2";
import { fieldClass, labelClass, primaryButton, quietButton } from "@/components/v2me/parts";

type Errors = Partial<Record<keyof Details, string>>;

/**
 * First-login details. Shows over every page until it has been filled,
 * checked and submitted once. It cannot be closed. Two steps:
 *   1. Fill the form.
 *   2. Check what you wrote, tick "these are correct", submit.
 */
export function DetailsGate({ initial }: { initial: Partial<Details> }) {
  const router = useRouter();
  const [d, setD] = React.useState<Details>({ ...EMPTY_DETAILS, ...initial });
  const [errors, setErrors] = React.useState<Errors>({});
  const [step, setStep] = React.useState<"form" | "review" | "done">("form");
  const [confirmed, setConfirmed] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [pending, start] = React.useTransition();
  const top = React.useRef<HTMLDivElement>(null);
  const v2 = useUiV2();

  // Lock the page behind the form.
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  React.useEffect(() => {
    top.current?.scrollTo({ top: 0 });
    top.current?.querySelector<HTMLElement>("input, select, button")?.focus();
  }, [step]);

  const set = (k: keyof Details) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setD({ ...d, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  };
  const outside = d.state === "Outside India";

  const toReview = () =>
    start(async () => {
      // A dropped connection must not throw: this form sits over every page.
      const r = await checkMyDetails(d).catch(() => ({ errors: undefined, value: undefined, failed: true as const }));
      if ("failed" in r) return void setMsg("That did not go through. Check your connection and try again.");
      if (r.errors) {
        setErrors(r.errors);
        setMsg("Some details need fixing.");
        return;
      }
      setMsg(null);
      setD(r.value!);
      setConfirmed(false);
      setStep("review");
    });

  const submit = () =>
    start(async () => {
      const r = await submitMyDetails(d, confirmed).catch(() => ({ errors: undefined, error: "That did not go through. Check your connection and try again." }));
      if (r.errors) {
        setErrors(r.errors);
        setStep("form");
      }
      if (r.error) return void setMsg(r.error);
      setStep("done");
      setTimeout(() => router.refresh(), 900);
    });

  const input = (k: keyof Details, extra?: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="space-y-1">
      <label htmlFor={`d-${k}`} className="text-sm font-semibold">
        {LABELS[k]}
      </label>
      <input
        id={`d-${k}`}
        value={d[k]}
        onChange={set(k)}
        aria-invalid={Boolean(errors[k])}
        aria-describedby={errors[k] ? `e-${k}` : undefined}
        className={cn("h-12 w-full rounded-xl border-2 bg-card px-3 text-base", errors[k] ? "border-destructive" : "border-foreground")}
        {...extra}
      />
      {errors[k] ? (
        <p id={`e-${k}`} className="text-caption font-semibold text-destructive">
          {errors[k]}
        </p>
      ) : null}
    </div>
  );
  const select = (k: keyof Details, options: readonly string[]) => (
    <div className="space-y-1">
      <label htmlFor={`d-${k}`} className="text-sm font-semibold">
        {LABELS[k]}
      </label>
      <select
        id={`d-${k}`}
        value={d[k]}
        onChange={set(k)}
        aria-invalid={Boolean(errors[k])}
        className={cn("h-12 w-full rounded-xl border-2 bg-card px-3 text-base", errors[k] ? "border-destructive" : "border-foreground", !d[k] && "text-muted-foreground")}
      >
        <option value="" disabled>
          Choose
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {errors[k] ? <p className="text-caption font-semibold text-destructive">{errors[k]}</p> : null}
    </div>
  );

  if (v2) {
    // New design: the same two steps and the same checks, as a plain full
    // screen on phones (a centred sheet on wide screens) with the one action
    // pinned at the bottom, where the thumb is.
    const field = (k: keyof Details, extra?: React.InputHTMLAttributes<HTMLInputElement>) => (
      <div className="flex min-w-0 flex-col gap-1.5">
        <label htmlFor={`d-${k}`} className={labelClass}>
          {LABELS[k]}
        </label>
        <input id={`d-${k}`} value={d[k]} onChange={set(k)} aria-invalid={Boolean(errors[k])} aria-describedby={errors[k] ? `e-${k}` : undefined} className={fieldClass} {...extra} />
        {errors[k] ? (
          <p id={`e-${k}`} className="type-small font-semibold text-destructive">
            {errors[k]}
          </p>
        ) : null}
      </div>
    );
    const choice = (k: keyof Details, options: readonly string[]) => (
      <div className="flex min-w-0 flex-col gap-1.5">
        <label htmlFor={`d-${k}`} className={labelClass}>
          {LABELS[k]}
        </label>
        <select id={`d-${k}`} value={d[k]} onChange={set(k)} aria-invalid={Boolean(errors[k])} aria-describedby={errors[k] ? `e-${k}` : undefined} className={cn(fieldClass, !d[k] && "text-muted-foreground")}>
          <option value="" disabled>
            Choose
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {errors[k] ? (
          <p id={`e-${k}`} className="type-small font-semibold text-destructive">
            {errors[k]}
          </p>
        ) : null}
      </div>
    );
    const footer = "sticky bottom-0 z-10 -mx-5 mt-2 flex gap-3 border-t border-[var(--ds-hairline)] bg-background px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:-mx-8 md:px-8";
    return (
      <div className="fixed inset-0 z-[100] flex items-stretch justify-center bg-background md:items-center md:bg-foreground/50 md:p-6" role="dialog" aria-modal="true" aria-labelledby="details-title">
        <div ref={top} className="flex max-h-[100dvh] w-full min-w-0 flex-col overflow-y-auto bg-background px-5 pt-[max(1.5rem,env(safe-area-inset-top))] md:max-h-[90vh] md:max-w-xl md:rounded-[var(--ds-radius)] md:border-[1.5px] md:border-[var(--ds-card-line)] md:px-8 md:pt-8">
          <header className="flex min-w-0 flex-col gap-2 pb-6">
            {step !== "done" ? (
              <>
                <p className="type-caption text-muted-foreground">Step {step === "review" ? 2 : 1} of 2</p>
                <div aria-hidden className="h-1 w-full overflow-hidden rounded-full bg-[var(--ds-hairline)]">
                  <div className="h-full origin-left rounded-full bg-brand transition-transform duration-[var(--ds-fill)] ease-[var(--ds-ease-out)] motion-reduce:transition-none dark:bg-primary" style={{ transform: `scaleX(${step === "review" ? 1 : 0.5})` }} />
                </div>
              </>
            ) : null}
            <h2 id="details-title" className="pt-2 type-h1">
              {step === "review" ? "Check your details" : step === "done" ? "Thank you" : "Tell us about you"}
            </h2>
            <p className="type-body text-muted-foreground">
              {step === "review" ? "Make sure everything is right. You only do this once." : step === "done" ? "Opening VIBHA…" : "Once, before you start. It takes about a minute."}
            </p>
          </header>

          {step === "form" ? (
            <form
              className="flex min-w-0 flex-1 flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                toReview();
              }}
              noValidate
            >
              {field("full_name", { autoComplete: "name", placeholder: "First and last name" })}
              {choice("state", STATES)}
              {outside ? field("country", { autoComplete: "country-name", placeholder: "Country" }) : null}
              {field("city", { autoComplete: "address-level2", placeholder: "City or town" })}
              {field("phone", { autoComplete: "tel", inputMode: "tel", placeholder: outside ? "+44 7700 900123" : "98765 43210" })}
              {choice("qualification", QUALIFICATIONS)}
              {field("institution", { autoComplete: "organization", placeholder: "Where you study or work" })}
              {choice("occupation", OCCUPATIONS)}
              {msg ? (
                <p className="type-small font-semibold text-destructive" role="alert">
                  {msg}
                </p>
              ) : null}
              <div className={cn(footer, "mt-auto")}>
                <button type="submit" disabled={pending} className={cn(primaryButton, "w-full")}>
                  {pending ? <Loader2 className="animate-spin" aria-hidden /> : null} Check my details <ArrowRight aria-hidden />
                </button>
              </div>
            </form>
          ) : step === "review" ? (
            <div className="flex min-w-0 flex-1 flex-col gap-5">
              <dl className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
                {(Object.keys(LABELS) as (keyof Details)[])
                  .filter((k) => k !== "country" || d.country !== "India")
                  .map((k) => (
                    <div key={k} className="flex min-h-12 min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-3">
                      <dt className="type-small text-muted-foreground">{LABELS[k]}</dt>
                      <dd className="min-w-0 text-right type-body font-semibold [overflow-wrap:anywhere]">{k === "phone" && /^\d{10}$/.test(d.phone) ? `+91 ${d.phone.slice(0, 5)} ${d.phone.slice(5)}` : d[k]}</dd>
                    </div>
                  ))}
              </dl>
              <label className="flex min-h-12 min-w-0 cursor-pointer items-start gap-3">
                <input type="checkbox" className="mt-0.5 size-6 shrink-0 accent-[#1d44d8]" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
                <span className="type-body font-semibold">I have checked these details and they are correct.</span>
              </label>
              <p className="flex items-center gap-1.5 type-small text-muted-foreground">
                <ShieldCheck className="size-4 shrink-0" aria-hidden /> Only VIBHA staff can see these details.
              </p>
              {msg ? (
                <p className="type-small font-semibold text-destructive" role="alert">
                  {msg}
                </p>
              ) : null}
              <div className={cn(footer, "mt-auto")}>
                <button type="button" onClick={() => setStep("form")} className={cn(quietButton, "min-h-[3.25rem] shrink-0")}>
                  <ArrowLeft aria-hidden /> Edit
                </button>
                <button type="button" onClick={submit} disabled={pending || !confirmed} className={cn(primaryButton, "flex-1")}>
                  {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Check aria-hidden />} Submit
                </button>
              </div>
            </div>
          ) : (
            <p className="flex items-center gap-2 pb-10 type-body font-semibold" role="status">
              <Check className="size-5 shrink-0 text-status-success-fg" aria-hidden /> Saved. You won&apos;t be asked again.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-foreground/60 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="details-title">
      <div ref={top} className="max-h-[100dvh] w-full overflow-y-auto rounded-t-3xl border-2 border-foreground bg-background sm:max-h-[90vh] sm:max-w-xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 border-b-2 border-foreground bg-brand px-5 py-4 text-brand-foreground">
          <p className="text-xs font-semibold uppercase tracking-wide opacity-90">{step === "review" ? "Step 2 of 2" : step === "form" ? "Step 1 of 2" : "Done"}</p>
          <h2 id="details-title" className="text-xl font-bold leading-tight">
            {step === "review" ? "Check your details" : step === "done" ? "Thank you" : "Tell us about you"}
          </h2>
          <p className="text-sm opacity-90">
            {step === "review" ? "Make sure everything is right. You only do this once." : step === "done" ? "Opening VIBHA…" : "Once, before you start. It takes about a minute."}
          </p>
        </div>

        {step === "form" ? (
          <form
            className="space-y-4 p-5"
            onSubmit={(e) => {
              e.preventDefault();
              toReview();
            }}
            noValidate
          >
            {input("full_name", { autoComplete: "name", placeholder: "First and last name" })}
            {select("state", STATES)}
            {outside ? input("country", { autoComplete: "country-name", placeholder: "Country" }) : null}
            {input("city", { autoComplete: "address-level2", placeholder: "City or town" })}
            {input("phone", { autoComplete: "tel", inputMode: "tel", placeholder: outside ? "+44 7700 900123" : "98765 43210" })}
            {select("qualification", QUALIFICATIONS)}
            {input("institution", { autoComplete: "organization", placeholder: "Where you study or work" })}
            {select("occupation", OCCUPATIONS)}
            {msg ? (
              <p className="text-sm font-semibold text-destructive" role="alert">
                {msg}
              </p>
            ) : null}
            <button type="submit" disabled={pending} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-foreground bg-primary text-lg font-bold text-primary-foreground hard-shadow-sm disabled:opacity-60">
              {pending ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null} Check my details <ArrowRight className="size-5" aria-hidden />
            </button>
          </form>
        ) : step === "review" ? (
          <div className="space-y-4 p-5">
            <dl className="divide-y-2 divide-foreground/10 rounded-2xl border-2 border-foreground bg-card">
              {(Object.keys(LABELS) as (keyof Details)[])
                .filter((k) => k !== "country" || d.country !== "India")
                .map((k) => (
                  <div key={k} className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 px-4 py-3">
                    <dt className="text-sm text-muted-foreground">{LABELS[k]}</dt>
                    <dd className="min-w-0 break-words text-right text-sm font-bold">{k === "phone" && /^\d{10}$/.test(d.phone) ? `+91 ${d.phone.slice(0, 5)} ${d.phone.slice(5)}` : d[k]}</dd>
                  </div>
                ))}
            </dl>
            <label className="flex items-start gap-3 rounded-2xl border-2 border-foreground bg-card p-4">
              <input type="checkbox" className="mt-0.5 size-5 shrink-0 accent-[#1d44d8]" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
              <span className="text-sm font-semibold">I have checked these details and they are correct.</span>
            </label>
            {msg ? (
              <p className="text-sm font-semibold text-destructive" role="alert">
                {msg}
              </p>
            ) : null}
            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2">
              <button type="button" onClick={() => setStep("form")} className="flex h-14 items-center gap-1 rounded-2xl border-2 border-foreground bg-card px-4 font-semibold">
                <ArrowLeft className="size-4" aria-hidden /> Edit
              </button>
              <button type="button" onClick={submit} disabled={pending || !confirmed} className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-foreground bg-primary text-lg font-bold text-primary-foreground hard-shadow-sm disabled:opacity-50">
                {pending ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Check className="size-5" aria-hidden />} Submit
              </button>
            </div>
            <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
              <ShieldCheck className="size-4" aria-hidden /> Only VIBHA staff can see these details.
            </p>
          </div>
        ) : (
          <div className="grid place-items-center gap-3 p-10 text-center" role="status">
            <span className="grid size-14 place-items-center rounded-full border-2 border-foreground bg-primary">
              <Check className="size-7" aria-hidden />
            </span>
            <p className="font-semibold">Saved. You won&apos;t be asked again.</p>
          </div>
        )}
      </div>
    </div>
  );
}
