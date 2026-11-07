"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { duplicateForm, removeForm, setFormOpen } from "./actions";

const btn = "inline-flex min-h-11 items-center rounded-md border-2 border-foreground bg-card px-4 text-sm font-bold hover:bg-accent disabled:opacity-50";

/** Super Admin buttons for one form: edit, open or close, copy, delete. */
export function FormRowActions({ id, title, active, responses, afterDelete }: { id: string; title: string; active: boolean; responses: number; afterDelete?: string }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState<string | null>(null);
  const [confirm, setConfirm] = React.useState(false);

  async function run(kind: string, fn: () => Promise<{ error: string | null }>, ok: string) {
    setBusy(kind);
    const res = await fn();
    setBusy(null);
    if (res.error) toast.error(res.error);
    else {
      toast.success(ok);
      router.refresh();
    }
  }

  async function toggle() {
    await run("toggle", () => setFormOpen(id, !active), active ? "Form closed" : "Form open");
  }

  async function copy() {
    setBusy("copy");
    const res = await duplicateForm(id);
    setBusy(null);
    if (res.error || !res.id) toast.error(res.error ?? "Could not copy the form.");
    else {
      toast.success("Copy made. It is closed until you open it.");
      router.push(`/admin/forms/${res.id}/edit`);
    }
  }

  async function remove(confirmed: boolean) {
    setBusy("delete");
    const res = await removeForm(id, confirmed);
    setBusy(null);
    if (res.error) return toast.error(res.error);
    if (res.outcome === "needs_confirm") return setConfirm(true);
    setConfirm(false);
    if (res.outcome === "archived") {
      toast.success("Form closed. All answers are kept.");
      router.refresh();
    } else {
      toast.success("Form deleted");
      if (afterDelete) router.push(afterDelete);
      else router.refresh();
    }
  }

  return (
    <>
      <Link href={`/admin/forms/${id}/edit`} className={btn}>
        Edit
      </Link>
      <button type="button" className={btn} disabled={busy !== null} onClick={toggle}>
        {busy === "toggle" ? "Saving…" : active ? "Close form" : "Open form"}
      </button>
      <button type="button" className={btn} disabled={busy !== null} onClick={copy}>
        {busy === "copy" ? "Copying…" : "Make a copy"}
      </button>
      <button
        type="button"
        className="inline-flex min-h-11 items-center rounded-md border-2 border-destructive bg-card px-4 text-sm font-bold text-destructive hover:bg-status-alert-bg disabled:opacity-50"
        disabled={busy !== null}
        onClick={() => (responses > 0 ? setConfirm(true) : remove(false))}
      >
        {busy === "delete" && !confirm ? "Deleting…" : "Delete"}
      </button>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>This form has answers</DialogTitle>
            <DialogDescription>
              {`"${title}" has answers, so it will not be deleted. It will be closed instead: no new answers, and every old answer stays here.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="min-h-11" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="min-h-11" disabled={busy === "delete"} onClick={() => remove(true)}>
              {busy === "delete" ? "Closing…" : "Close form"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
