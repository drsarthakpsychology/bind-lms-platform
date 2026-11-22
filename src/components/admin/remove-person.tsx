"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw, Trash2, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";
import { deletePersonAccount, removePersonAccess, restorePersonAccess } from "@/app/(dashboard)/admin/remove/actions";
import { nameMatches, REMOVE_WORDS } from "@/lib/people/removal-rules";

export type RemoveTarget = {
  id: string;
  name: string;
  /** The word to type to delete (their name, or their email when no name). */
  confirmWord: string;
  state: "active" | "locked" | "removed";
  /** Set when this comes from an app deletion request. */
  requestId?: string | null;
};

type Step = "menu" | "remove" | "delete" | "restore";

function Lines({ title, items, tone }: { title: string; items: readonly string[]; tone?: "keep" }) {
  if (!items.length) return null;
  return (
    <div className="space-y-1">
      <p className="type-caption font-semibold text-muted-foreground">{title}</p>
      <ul className="space-y-1">
        {items.map((t) => (
          <li key={t} className="flex gap-2 type-small">
            <span aria-hidden className={tone === "keep" ? "text-status-success-fg" : "text-muted-foreground"}>
              {tone === "keep" ? "✓" : "•"}
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The one sheet for taking someone off VIBHA, on the website. Opens on the
 * choice (Remove access, the default; Delete account), then a confirm step
 * that says exactly what happens and what is kept. Delete asks for the name
 * typed out. The server checks every rule again.
 */
export function RemovePersonSheet({ target, open, onOpenChange, start }: { target: RemoveTarget; open: boolean; onOpenChange: (o: boolean) => void; start?: Step }) {
  const router = useRouter();
  const first: Step = start ?? (target.state === "removed" ? "restore" : "menu");
  const [step, setStep] = useState<Step>(first);
  const [note, setNote] = useState("");
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function close(o: boolean) {
    if (!o) {
      setStep(first);
      setNote("");
      setTyped("");
      setError(null);
      setDone(null);
    }
    onOpenChange(o);
  }

  function run(call: () => Promise<{ error: string | null }>, ok: string) {
    setError(null);
    startTransition(async () => {
      try {
        const r = await call();
        if (r.error) setError(r.error);
        else {
          setDone(ok);
          router.refresh();
        }
      } catch {
        setError("Something went wrong. Nothing was changed. Try again.");
      }
    });
  }

  const canDelete = nameMatches(typed, { name: target.confirmWord });
  const words = step === "remove" || step === "delete" || step === "restore" ? REMOVE_WORDS[step] : null;
  const title = done ? "Done" : step === "menu" ? `Remove ${target.name} from VIBHA` : step === "remove" ? `Remove ${target.name}'s access?` : step === "delete" ? `Delete ${target.name}'s account?` : `Restore ${target.name}'s access?`;

  const footer = done ? (
    <Button type="button" className="w-full" onClick={() => close(false)}>
      Close
    </Button>
  ) : step === "menu" ? undefined : (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant={step === "restore" ? "default" : "destructive"}
        className="w-full"
        disabled={pending || (step === "delete" && !canDelete)}
        data-testid="remove-confirm"
        onClick={() =>
          step === "remove"
            ? run(() => removePersonAccess(target.id, note), `${target.name} no longer has access. You can restore them from Remove people.`)
            : step === "delete"
              ? run(() => deletePersonAccount(target.id, typed, target.requestId ?? null), `${target.name}'s account is deleted.`)
              : run(() => restorePersonAccess(target.id), `${target.name} can sign in again.`)
        }
      >
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {step === "remove" ? "Remove access" : step === "delete" ? "Delete account for good" : "Restore access"}
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={() => (start || target.state === "removed" ? close(false) : setStep("menu"))}>
        {start || target.state === "removed" ? "Cancel" : "Back"}
      </Button>
    </div>
  );

  return (
    <MobileBottomSheet open={open} onOpenChange={close} title={title} footer={footer}>
      {error ? (
        <p role="alert" className="mb-3 type-small text-status-alert-fg">
          {error}
        </p>
      ) : null}
      {done ? (
        <p role="status" className="type-small">
          {done}
        </p>
      ) : step === "menu" ? (
        <div className="flex flex-col gap-2">
          <button type="button" data-testid="remove-pick-access" onClick={() => setStep("remove")} className="flex min-h-14 w-full items-start gap-3 rounded-md border border-[var(--ds-card-line)] px-3 py-3 text-left transition-colors hover:bg-accent">
            <UserX className="mt-0.5 size-5 shrink-0" aria-hidden />
            <span className="min-w-0">
              <span className="block type-small font-semibold">{REMOVE_WORDS.remove.title}</span>
              <span className="block type-caption text-muted-foreground">{REMOVE_WORDS.remove.short}. Signs them out and keeps their records.</span>
            </span>
          </button>
          <button type="button" data-testid="remove-pick-delete" onClick={() => setStep("delete")} className="flex min-h-14 w-full items-start gap-3 rounded-md border border-[var(--ds-card-line)] px-3 py-3 text-left text-status-alert-fg transition-colors hover:bg-accent">
            <Trash2 className="mt-0.5 size-5 shrink-0" aria-hidden />
            <span className="min-w-0">
              <span className="block type-small font-semibold">{REMOVE_WORDS.delete.title}</span>
              <span className="block type-caption text-muted-foreground">{REMOVE_WORDS.delete.short}. Removes their sign-in and personal details.</span>
            </span>
          </button>
        </div>
      ) : words ? (
        <div className="space-y-4">
          <Lines title="This will" items={words.does} />
          <Lines title="Kept" items={words.keeps} tone="keep" />
          <p className="type-small font-semibold">{words.after}</p>
          {step === "remove" ? (
            <div className="space-y-1.5">
              <label htmlFor="remove-note" className="type-small font-medium">
                Why? (only admins see this)
              </label>
              <Input id="remove-note" value={note} maxLength={200} onChange={(e) => setNote(e.target.value)} placeholder="For example: left the course" />
            </div>
          ) : null}
          {step === "delete" ? (
            <div className="space-y-1.5">
              <label htmlFor="remove-typed" className="type-small font-medium">
                Type <span className="font-bold">{target.confirmWord}</span> to confirm
              </label>
              <Input id="remove-typed" value={typed} autoComplete="off" onChange={(e) => setTyped(e.target.value)} data-testid="remove-typed" />
            </div>
          ) : null}
        </div>
      ) : null}
    </MobileBottomSheet>
  );
}

/** The button that opens the sheet, for a person's page or a list row. */
export function RemovePersonButton({ target, label, start }: { target: RemoveTarget; label?: string; start?: Step }) {
  const [open, setOpen] = useState(false);
  const removed = target.state === "removed";
  return (
    <>
      <Button type="button" variant={removed ? "outline" : "danger"} onClick={() => setOpen(true)} className="min-h-11" data-testid="remove-open">
        {removed ? <RotateCcw className="size-4" aria-hidden /> : <UserX className="size-4" aria-hidden />}
        {label ?? (removed ? "Restore access" : "Remove from VIBHA")}
      </Button>
      <RemovePersonSheet target={target} open={open} onOpenChange={setOpen} start={start} />
    </>
  );
}
