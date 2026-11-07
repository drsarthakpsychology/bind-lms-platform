"use client";

import * as React from "react";
import type { FormField } from "@/lib/forms/fields";
import { cn } from "@/lib/utils";

const control =
  "h-11 w-full min-w-0 rounded-md border-2 border-input bg-card px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/60 aria-invalid:border-destructive";

function Hint({ field }: { field: FormField }) {
  return field.required ? <span className="sr-only"> (required)</span> : <span className="font-normal text-muted-foreground"> (optional)</span>;
}

function ErrorText({ id, text }: { id: string; text?: string }) {
  return text ? (
    <p id={id} className="text-small font-medium text-destructive">
      {text}
    </p>
  ) : null;
}

/**
 * The questions of a link form as plain native controls, so the browser's
 * own FormData carries the answers (names are the question keys). Used by
 * the public page and the builder preview.
 */
export function FormFields({ fields, errors = {}, idPrefix = "q" }: { fields: FormField[]; errors?: Record<string, string>; idPrefix?: string }) {
  return (
    <div className="space-y-5">
      {fields.map((f) => {
        const id = `${idPrefix}-${f.key}`;
        const errId = `${id}-error`;
        const err = errors[f.key];
        const aria = { "aria-invalid": err ? true : undefined, "aria-describedby": err ? errId : undefined } as const;

        if (f.type === "single_choice" || f.type === "multiple_choice") {
          const multi = f.type === "multiple_choice";
          return (
            <fieldset key={f.key} className="space-y-2" {...aria}>
              <legend className="text-sm font-bold">
                {f.label}
                <Hint field={f} />
              </legend>
              {multi ? <p className="text-caption text-muted-foreground">Pick all that apply.</p> : null}
              <div className="space-y-1.5">
                {(f.options ?? []).map((o, i) => (
                  <label key={o} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border-2 border-foreground/15 bg-card px-3 has-[:checked]:border-foreground has-[:checked]:bg-accent">
                    <input
                      type={multi ? "checkbox" : "radio"}
                      name={f.key}
                      value={o}
                      required={!multi && f.required && i === 0 ? true : undefined}
                      className="size-5 shrink-0 accent-primary"
                    />
                    <span className="min-w-0 break-words">{o}</span>
                  </label>
                ))}
              </div>
              <ErrorText id={errId} text={err} />
            </fieldset>
          );
        }

        if (f.type === "checkbox") {
          return (
            <div key={f.key} className="space-y-1.5">
              <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2">
                <input type="checkbox" id={id} name={f.key} value="yes" required={f.required} className="mt-0.5 size-5 shrink-0 accent-primary" {...aria} />
                <span className="min-w-0 text-sm font-semibold break-words">
                  {f.label}
                  <Hint field={f} />
                </span>
              </label>
              <ErrorText id={errId} text={err} />
            </div>
          );
        }

        return (
          <div key={f.key} className="space-y-1.5">
            <label htmlFor={id} className="block text-sm font-bold break-words">
              {f.label}
              <Hint field={f} />
            </label>
            {f.type === "long_text" ? (
              <textarea id={id} name={f.key} required={f.required} maxLength={5000} rows={4} className={cn(control, "h-auto min-h-28 py-2")} {...aria} />
            ) : f.type === "dropdown" ? (
              <select id={id} name={f.key} required={f.required} defaultValue="" className={control} {...aria}>
                <option value="" disabled={f.required}>
                  Pick one
                </option>
                {(f.options ?? []).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={id}
                name={f.key}
                required={f.required}
                maxLength={500}
                className={control}
                {...inputProps(f)}
                {...aria}
              />
            )}
            <ErrorText id={errId} text={err} />
          </div>
        );
      })}
    </div>
  );
}

function inputProps(f: FormField): React.InputHTMLAttributes<HTMLInputElement> {
  switch (f.type) {
    case "email":
      return { type: "email", autoComplete: "email", inputMode: "email" };
    case "phone":
      return { type: "tel", autoComplete: "tel", inputMode: "tel" };
    case "number":
      return { type: "text", inputMode: "decimal", pattern: "-?[0-9]+([.][0-9]+)?" };
    case "date":
      return { type: "date" };
    default:
      return { type: "text", autoComplete: /^(full |your )?name$/i.test(f.label.trim()) ? "name" : undefined };
  }
}
