"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { setMasterEnabled, setMasterPassword } from "./master-actions";

/**
 * The admin support key. On the normal sign-in page, the admin can type a
 * student's email with this key to open that student's account and help them.
 * It only opens student accounts, every use is listed below, and it can be
 * switched off here at any time.
 */
export function MasterPasswordCard({
  state,
  uses,
}: {
  state: { ready: boolean; set: boolean; enabled: boolean; updatedAt: string | null };
  uses: { email: string; at: string }[];
}) {
  const router = useRouter();
  const [pw, setPw] = React.useState("");
  const [again, setAgain] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);

  const save = async () => {
    setBusy(true);
    setMsg(null);
    const res = await setMasterPassword(pw, again);
    setBusy(false);
    if (res.error) setMsg({ ok: false, text: res.error });
    else {
      setPw("");
      setAgain("");
      setShow(false);
      setMsg({ ok: true, text: "Saved. Use it with any student's email on the sign-in page." });
      router.refresh();
    }
  };

  const toggle = async (on: boolean) => {
    setBusy(true);
    setMsg(null);
    const res = await setMasterEnabled(on);
    setBusy(false);
    if (res.error) setMsg({ ok: false, text: res.error });
    else router.refresh();
  };

  const when = (iso: string) => new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 text-base font-bold">
          <KeyRound className="size-4 text-link" aria-hidden /> Support key
        </span>
        {state.set ? (
          <span className={`rounded-full border-2 border-foreground px-2.5 py-0.5 text-xs font-bold ${state.enabled ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
            {state.enabled ? "On" : "Off"}
          </span>
        ) : (
          <span className="rounded-full border-2 border-dashed border-foreground px-2.5 py-0.5 text-xs font-bold">Not set yet</span>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Type a student&apos;s email with this key on the normal sign-in page to open their account and help them. It opens student accounts only, never another admin&apos;s, and every use is listed below. Keep it to yourself.
      </p>

      {!state.ready ? (
        <p className="rounded-xl border-2 border-foreground bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
          Run the new database step (2026_11_access_doubts.sql) first, then set the key here.
        </p>
      ) : null}

      <div className="space-y-2">
        <label className="block text-sm font-semibold">
          {state.set ? "New key" : "Set a key"}
          <div className="relative mt-1">
            <input
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete="new-password"
              placeholder="At least 12 characters, with a number"
              className="h-11 w-full rounded-xl border-2 border-foreground bg-card pr-11 pl-3 text-base outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
            />
            <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide" : "Show"} className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-md hover:bg-muted">
              {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
            </button>
          </div>
        </label>
        <label className="block text-sm font-semibold">
          Type it again
          <input
            type={show ? "text" : "password"}
            value={again}
            onChange={(e) => setAgain(e.target.value)}
            autoComplete="new-password"
            className="mt-1 h-11 w-full rounded-xl border-2 border-foreground bg-card px-3 text-base outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          />
        </label>
      </div>

      {msg ? (
        <p role="status" className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold ${msg.ok ? "border-foreground bg-muted" : "border-destructive bg-status-alert-bg text-status-alert-fg"}`}>
          {msg.text}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={save}
          disabled={busy || !pw || !again || !state.ready}
          className="inline-flex h-10 items-center gap-1.5 rounded-md border-2 border-foreground bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <KeyRound className="size-4" aria-hidden />}
          {state.set ? "Change key" : "Set key"}
        </button>
        {state.set ? (
          <button type="button" onClick={() => toggle(!state.enabled)} disabled={busy} className="inline-flex h-10 items-center rounded-md border-2 border-foreground bg-card px-4 text-sm font-bold disabled:opacity-50">
            {state.enabled ? "Switch off" : "Switch on"}
          </button>
        ) : null}
      </div>

      {uses.length ? (
        <div className="rounded-xl border-2 border-foreground/15 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent uses</p>
          <ul className="mt-1.5 space-y-1 text-sm">
            {uses.map((u, i) => (
              <li key={i} className="flex justify-between gap-2">
                <span className="truncate font-medium">{u.email}</span>
                <span className="shrink-0 text-caption text-muted-foreground">{when(u.at)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
