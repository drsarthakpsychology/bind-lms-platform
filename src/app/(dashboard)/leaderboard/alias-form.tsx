"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveAlias } from "./actions";

/** The tiny alias setting: the name other batches see on the platform board. */
export function AliasForm({ alias, fallback }: { alias: string | null; fallback: string }) {
  const [value, setValue] = React.useState(alias ?? "");
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = React.useTransition();
  const id = React.useId();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = await saveAlias(value);
      setMsg(r.error ? { ok: false, text: r.error } : { ok: true, text: r.alias ? `Saved. Others see "${r.alias}".` : `Saved. Others see "${fallback}".` });
    });
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <label htmlFor={id} className="block text-sm font-bold">
        Name on the platform board
      </label>
      <p className="text-caption text-muted-foreground">Your cohort always sees your real name. Leave empty to show &ldquo;{fallback}&rdquo;.</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input id={id} value={value} onChange={(e) => setValue(e.target.value)} maxLength={20} placeholder={fallback} autoComplete="off" className="sm:flex-1" />
        <Button type="submit" size="lg" variant="outline" className="rounded-md" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
      <p aria-live="polite" className={msg?.ok ? "flex items-center gap-1 text-caption" : "text-caption text-status-alert-fg"}>
        {msg?.ok ? <Check className="size-3.5" aria-hidden /> : null}
        {msg?.text ?? ""}
      </p>
    </form>
  );
}
