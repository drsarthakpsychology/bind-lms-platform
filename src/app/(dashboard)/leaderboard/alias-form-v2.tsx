"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { fieldClass, labelClass, quietButton } from "@/components/ds";
import { cn } from "@/lib/utils";
import { saveAlias } from "./actions";

/** The name other batches see on the platform board (new design look, same save). */
export function AliasFormV2({ alias, fallback }: { alias: string | null; fallback: string }) {
  const [value, setValue] = React.useState(alias ?? "");
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = React.useTransition();
  const id = React.useId();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = await saveAlias(value).catch(() => ({ error: "Not saved. Check your connection and try again.", alias: null }));
      setMsg(r.error ? { ok: false, text: r.error } : { ok: true, text: r.alias ? `Saved. Others see "${r.alias}".` : `Saved. Others see "${fallback}".` });
    });
  }

  return (
    <form onSubmit={submit} className="flex min-w-0 max-w-xl flex-col gap-2">
      <label htmlFor={id} className={labelClass}>
        Name on the platform board
      </label>
      <div className="flex min-w-0 gap-2">
        <input id={id} value={value} onChange={(e) => setValue(e.target.value)} maxLength={20} placeholder={fallback} autoComplete="off" className={cn(fieldClass, "flex-1")} />
        <button type="submit" disabled={pending} className={cn(quietButton, "min-h-12 shrink-0")}>
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
      <p className="type-small text-muted-foreground">Your batch always sees your real name. Leave it empty to show &ldquo;{fallback}&rdquo;.</p>
      <p aria-live="polite" className={cn("type-small", msg?.ok ? "flex items-center gap-1 text-status-success-fg" : "text-status-alert-fg")}>
        {msg?.ok ? <Check className="size-4" aria-hidden /> : null}
        {msg?.text ?? ""}
      </p>
    </form>
  );
}
