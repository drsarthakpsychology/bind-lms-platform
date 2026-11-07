"use client";

/**
 * Team pieces shared by Ward Week and the Escape Room: the join box, the
 * team code with a copy button, and the member list (icon + word for each
 * status, never colour alone).
 */
import * as React from "react";
import { Check, CircleDashed, Copy, LogIn, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { normaliseCode } from "../teams";
import { Btn, Panel } from "./kit";

export function JoinBox({ onJoin, label = "Join a team" }: { onJoin: (code: string) => Promise<string | null>; label?: string }) {
  const [code, setCode] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const inputId = React.useId();
  async function go(e: React.FormEvent) {
    e.preventDefault();
    const c = normaliseCode(code);
    if (c.length < 4) {
      setErr("Type the code your classmate shared.");
      return;
    }
    setBusy(true);
    setErr(null);
    const problem = await onJoin(c).catch(() => "Couldn't join. Try again.");
    setBusy(false);
    if (problem) setErr(problem);
  }
  return (
    <form onSubmit={go} className="space-y-2">
      <label htmlFor={inputId} className="text-small font-semibold">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Code, like K7RQ2"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={8}
          className="min-h-11 min-w-0 flex-1 rounded-md border-2 border-foreground bg-card px-3 font-mono text-body tracking-widest uppercase outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
        />
        <Btn type="submit" variant="ink" disabled={busy}>
          <LogIn aria-hidden /> Join
        </Btn>
      </div>
      {err ? (
        <p className="text-small text-destructive" role="alert">
          {err}
        </p>
      ) : null}
    </form>
  );
}

export function TeamCode({ code, name, message }: { code: string; name: string; message: string }) {
  const [copied, setCopied] = React.useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(`${message} Code: ${code}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the code is on screen */
    }
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 font-semibold">
        <Users className="size-4" aria-hidden /> {name}
      </span>
      <span className="rounded-md border-2 border-foreground bg-card px-2 py-0.5 font-mono text-body-strong tracking-widest" aria-label={`Team code ${code.split("").join(" ")}`}>
        {code}
      </span>
      <Btn variant="ghost" className="min-h-11 px-2" onClick={copy} aria-label="Copy the invite">
        {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
        <span className="text-small">{copied ? "Copied" : "Copy invite"}</span>
      </Btn>
    </div>
  );
}

export type MemberLine = { name: string; me: boolean; done?: boolean; doneWord?: string; waitWord?: string };

export function Members({ members, max, className }: { members: MemberLine[]; max: number; className?: string }) {
  return (
    <Panel className={cn("p-3", className)}>
      <p className="mb-2 text-caption font-semibold uppercase">
        Team {members.length}/{max}
      </p>
      <ul className="flex flex-wrap gap-2">
        {members.map((m, i) => (
          <li key={`${m.name}-${i}`} className="flex items-center gap-1.5 rounded-md border-2 border-foreground/30 bg-card px-2 py-1 text-small">
            <span className="font-semibold">
              {m.name}
              {m.me ? " (you)" : ""}
            </span>
            {m.done !== undefined ? (
              m.done ? (
                <span className="inline-flex items-center gap-0.5 text-status-success-fg">
                  <Check className="size-3.5" aria-hidden />
                  {m.doneWord ?? "Done"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-muted-foreground">
                  <CircleDashed className="size-3.5" aria-hidden />
                  {m.waitWord ?? "Waiting"}
                </span>
              )
            ) : null}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/**
 * Poll a loader every `ms` while `on`. The loader result is handed to
 * `apply` from the timer callback (never synchronously inside the effect).
 */
export function usePoll<T>(on: boolean, ms: number, load: () => Promise<T>, apply: (v: T) => void) {
  const ref = React.useRef({ load, apply });
  React.useEffect(() => {
    ref.current = { load, apply };
  });
  React.useEffect(() => {
    if (!on) return;
    let alive = true;
    let busy = false;
    const tick = () => {
      if (busy || document.visibilityState === "hidden") return;
      busy = true;
      ref.current
        .load()
        .then((v) => {
          if (alive) ref.current.apply(v);
        })
        .catch(() => undefined)
        .finally(() => {
          busy = false;
        });
    };
    const first = setTimeout(tick, 0);
    const t = setInterval(tick, ms);
    return () => {
      alive = false;
      clearTimeout(first);
      clearInterval(t);
    };
  }, [on, ms]);
}
