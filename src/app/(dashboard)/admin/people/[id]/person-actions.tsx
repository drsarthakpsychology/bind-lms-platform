"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
import { STAGES } from "@/lib/crm/people";
import { convertToStudent, logActivity, setFollowUp, setStage } from "../actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const KINDS = [
  { id: "call", label: "Call" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "meeting", label: "Meeting" },
  { id: "note", label: "Note" },
] as const;

/** Stage, follow-up, and the "log what happened" box (HubSpot-style). */
export function PersonActions({ email, name, stage, followUp, isStudent, v2 = false }: { email: string; name: string; stage: string; followUp: string; isStudent: boolean; v2?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [kind, setKind] = React.useState<(typeof KINDS)[number]["id"]>("call");
  const [body, setBody] = React.useState("");

  const run = async (fn: () => Promise<{ error: string | null }>, done: string) => {
    setBusy(true);
    setMsg(null);
    const res = await fn();
    setBusy(false);
    setMsg(res.error ?? done);
    if (!res.error) router.refresh();
  };

  return (
    <div className={v2 ? "flex min-w-0 flex-col gap-4" : "space-y-4 rounded-2xl border-2 border-foreground bg-card p-5"}>
      <div className="space-y-1.5">
        <label htmlFor="stage" className={v2 ? "type-small font-semibold" : "text-eyebrow text-muted-foreground"}>Stage</label>
        <select id="stage" defaultValue={stage} disabled={busy} onChange={(e) => run(() => setStage(email, e.target.value), "Stage saved.")} className="h-11 w-full rounded-xl border-2 border-foreground bg-card px-3 text-sm font-bold">
          {STAGES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="follow" className={v2 ? "type-small font-semibold" : "text-eyebrow text-muted-foreground"}>Next follow-up</label>
        <input id="follow" type="date" defaultValue={followUp} disabled={busy} onChange={(e) => run(() => setFollowUp(email, e.target.value), e.target.value ? "Follow-up set." : "Follow-up cleared.")} className="h-11 w-full rounded-xl border-2 border-foreground bg-card px-3 text-sm font-bold" />
      </div>

      <div className="space-y-2 border-t-2 border-foreground/10 pt-4">
        <p className={v2 ? "type-small font-semibold" : "text-eyebrow text-muted-foreground"}>Log what happened</p>
        <div role="group" aria-label="Type" className="flex flex-wrap gap-1.5">
          {KINDS.map((k) => (
            <button key={k.id} type="button" aria-pressed={kind === k.id} onClick={() => setKind(k.id)} className={v2 ? cn("h-11 cursor-pointer rounded-md border px-3 type-small font-semibold lg:h-9", kind === k.id ? "border-foreground bg-foreground text-background" : "border-[var(--ds-card-line)] hover:bg-[var(--ds-tint)]") : cn("h-8 cursor-pointer rounded-full border-2 border-foreground px-3 text-xs font-bold", kind === k.id ? "bg-brand text-brand-foreground" : "bg-card")}>
              {k.label}
            </button>
          ))}
        </div>
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder={kind === "note" ? "Write a note…" : "What was said? Next step?"} rows={3} />
        <Button
          type="button"
          className="w-full"
          disabled={busy || (kind === "note" && !body.trim())}
          onClick={() => run(async () => { const r = await logActivity(email, kind, body); if (!r.error) setBody(""); return r; }, "Saved to the timeline.")}
        >
          {busy ? <Loader2 className="animate-spin" aria-hidden /> : null} Save
        </Button>
      </div>

      {!isStudent ? (
        <Button
          type="button"
          variant="brand"
          className="w-full"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            const r = await convertToStudent(email, name);
            setBusy(false);
            if (r.error) return setMsg(r.error);
            if (r.setupUrl) {
              try {
                await navigator.clipboard.writeText(r.setupUrl);
                setMsg("Student account made. Setup link copied: paste it into WhatsApp.");
              } catch {
                setMsg(`Student account made. Setup link: ${r.setupUrl}`);
              }
            }
            router.refresh();
          }}
        >
          <UserPlus aria-hidden /> Make them a student
        </Button>
      ) : null}
      {msg ? <p className={v2 ? "type-small font-semibold [overflow-wrap:anywhere]" : "text-caption font-semibold break-all"} role="status">{msg}</p> : null}
    </div>
  );
}
