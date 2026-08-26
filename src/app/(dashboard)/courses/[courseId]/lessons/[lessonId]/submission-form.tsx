"use client";

import React, { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import { prepareSubmissionUpload, submitWithFiles, unsubmitAssignment } from "./actions";
import { haptic } from "@/lib/haptics";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

type SubmissionState = {
  status: "submitted" | "returned" | "approved";
  submittedAt: string;
  isLate: boolean;
  note: string | null;
  files: { id: string; originalName: string; storagePath: string }[];
};

/**
 * A link to re-open the student's OWN submitted file. Ownership is enforced
 * server-side by /api/media/submissions/:fileId; the signed URL lets them
 * download their own work (round-13 decision: own submissions aren't locked).
 */
function OwnFileLink({ fileId, name }: { fileId: string; name: string }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function open() {
    if (loading) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/media/submissions/${fileId}`);
      if (!res.ok) {
        setErr("Couldn't open this file.");
        return;
      }
      const data = (await res.json()) as { url: string };
      // Open the signed URL in a new tab so the student can view/download.
      window.open(data.url, "_blank", "noopener");
    } catch {
      setErr("Couldn't open this file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={open}
        disabled={loading}
        className="inline-flex items-center gap-1 text-link underline-offset-2 hover:underline disabled:opacity-50"
      >
        <Download className="size-3.5" aria-hidden />
        {name}
      </button>
      {err && <span className="text-status-alert-fg">{err}</span>}
    </span>
  );
}

/**
 * Student assignment submission. Large drop zone (click anywhere to browse),
 * selected-files list with remove, optional note, one Submit button. After
 * submitting: "Submitted on …", files listed, and an Unsubmit and edit action
 * (while the submission is pending). Late submissions are flagged.
 */
export function SubmissionForm({
  assignmentId,
  dueAt,
  allowLate,
  maxFiles,
  maxFileMb,
  existing,
}: {
  assignmentId: string;
  dueAt: string | null;
  allowLate: boolean;
  maxFiles: number;
  maxFileMb: number;
  existing: SubmissionState | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [picked, setPicked] = useState<File[]>([]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // pastDue is computed once on the client (Date.now() isn't allowed during
  // render, so it's initialised lazily in state).
  const [pastDue] = useState(() =>
    dueAt ? Date.now() > new Date(dueAt).getTime() : false,
  );

  const submission = existing;
  const isReturned = submission?.status === "returned";
  const isApproved = submission?.status === "approved";
  const isSubmitted = Boolean(submission);

  // Can the student still submit/edit?
  const canSubmit =
    !isApproved &&
    !isReturned &&
    (!pastDue || allowLate) &&
    (picked.length > 0 || (submission && !submission.files.length && !submission.note));

  // Focus management for keyboard users
  React.useEffect(() => {
    if (noteRef.current && !submitting) {
      noteRef.current.focus();
    }
  }, [submitting, isSubmitted, canSubmit]);

  const ALLOWED_EXTS = new Set(["pdf", "docx"]);

  function addFiles(list: FileList | File[]) {
    const files = Array.from(list);
    // Reject any file whose extension isn't an accepted submission type.
    const bad = files.filter((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      return !ALLOWED_EXTS.has(ext);
    });
    const good = files.filter((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      return ALLOWED_EXTS.has(ext);
    });
    if (bad.length) {
      setError("Only PDF and DOCX files can be attached to this submission.");
      return;
    }
    const remaining = maxFiles - picked.length;
    const accepted = good.slice(0, Math.max(0, remaining));
    const next = [...picked, ...accepted];
    setPicked(next);
    if (good.length > remaining) {
      setError(`You can attach up to ${maxFiles} files.`);
    } else {
      setError(null);
    }
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [picked, maxFiles],
  );

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);

    const uploads: { path: string; name: string }[] = [];
    try {
      // Upload each picked file to the submissions bucket.
      for (const f of picked) {
        const signed = await prepareSubmissionUpload(assignmentId, f.name);
        if (!signed.ok) {
          setError(signed.error);
          setSubmitting(false);
          return;
        }
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/upload/sign/${signed.path}?token=${signed.token}`;
        const xhr = new XMLHttpRequest();
        const result = await new Promise<{ ok: boolean }>((resolve) => {
          xhr.open("POST", url);
          xhr.onload = () => resolve({ ok: xhr.status >= 200 && xhr.status < 300 });
          xhr.onerror = () => resolve({ ok: false });
          const form = new FormData();
          form.append("file", f);
          xhr.send(form);
        });
        if (!result.ok) {
          setError("One of your files failed to upload. Try again.");
          setSubmitting(false);
          return;
        }
        uploads.push({ path: signed.path, name: f.name });
      }

      const result = await submitWithFiles(assignmentId, note, uploads);
      if (result.error) {
        setError(result.error);
        setSubmitting(false);
        return;
      }
      haptic("success");
      setPicked([]);
      setNote("");
      router.refresh();
    } catch {
      setError("Could not submit. Try again.");
      setSubmitting(false);
    }
  }

  async function handleUnsubmit() {
    setSubmitting(true);
    setError(null);
    const result = await unsubmitAssignment(assignmentId);
    setSubmitting(false);
    if (result.error) setError(result.error);
    else router.refresh();
  }

  // Locked states (graded / returned).
  if (isReturned || isApproved) {
    return (
      <div className="space-y-3 rounded-md border-2 border-border bg-secondary/60 p-4">
        <div className="flex items-center gap-2">
          <Badge variant={isApproved ? "graded" : "pending"}>
            {isApproved ? (
              <CheckCircle2 className="size-3" aria-hidden />
            ) : (
              <Clock className="size-3" aria-hidden />
            )}
            {isApproved ? "Graded" : "Returned for revision"}
          </Badge>
        </div>
        <p className="text-small text-foreground">
          {isApproved
            ? "Your instructor has graded this submission."
            : "Your instructor returned this submission. You'll be able to resubmit if they reopen it."}
        </p>
      </div>
    );
  }

  // Already submitted — show the submitted state + unsubmit.
  if (isSubmitted && !canSubmit) {
    return (
      <div className="space-y-3 rounded-md border-2 border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="pending">
              <Clock className="size-3" aria-hidden />
              Submitted
            </Badge>
            {submission?.isLate && <Badge variant="pending">Late</Badge>}
          </div>
          <span className="text-caption text-muted-foreground">
            Submitted on{" "}
            {new Date(submission!.submittedAt).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>

        {submission?.note && (
          <p className="whitespace-pre-wrap break-words rounded-md border-2 border-border bg-muted/50 p-3 text-small">
            {submission.note}
          </p>
        )}

        {submission?.files && submission.files.length > 0 && (
          <ul className="space-y-1.5">
            {submission.files.map((f) => (
              <li key={f.id} className="text-small text-foreground">
                <OwnFileLink fileId={f.id} name={f.originalName} />
              </li>
            ))}
          </ul>
        )}

        <Button type="button" variant="outline" size="sm" onClick={handleUnsubmit} disabled={submitting}>
          {submitting && <Loader2 className="size-3.5 animate-spin" aria-hidden />}
          Unsubmit and edit
        </Button>
      </div>
    );
  }

  // Submission zone.
  return (
    <div className="space-y-4">
      {/* Late notice */}
      {pastDue && allowLate && (
        <p className="text-caption text-status-pending-fg">
          This is past the due date. Your submission will be marked late.
        </p>
      )}
      {pastDue && !allowLate && (
        <p className="text-caption text-status-alert-fg">
          The due date has passed. Contact your instructor if you need an extension.
        </p>
      )}

      {/* Drop zone — only when submissions are still open */}
      {(!pastDue || allowLate) && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Drop files here or browse"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-muted/40 px-6 py-10 text-center transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 " +
            (dragOver ? "border-primary bg-accent" : "")
          }
        >
          <UploadCloud className="size-8 text-muted-foreground" aria-hidden />
          <p className="text-small font-medium text-foreground">
            Drag files here or <span className="text-link">browse</span>
          </p>
          <p className="text-caption text-muted-foreground">
            Up to {maxFiles} files, {maxFileMb} MB each
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {/* Selected files list */}
      {picked.length > 0 && (
        <ul className="space-y-1.5">
          {picked.map((f, i) => (
            <li key={i} className="flex items-center justify-between gap-2 rounded-md border-2 border-border bg-card px-3 py-2 text-small">
              <span className="truncate text-foreground">{f.name}</span>
              <button
                type="button"
                onClick={() => setPicked((prev) => prev.filter((_, idx) => idx !== i))}
                aria-label={`Remove ${f.name}`}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="text-caption text-status-alert-fg">
          {error}
        </p>
      )}

      {/* Note */}
      <div className="space-y-1.5">
        <label htmlFor="submission-note" className="text-small font-medium text-foreground">
          Add a note for your instructor <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          ref={noteRef}
          id="submission-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Anything you want them to know about your submission…"
        />
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit || submitting || (!pastDue && picked.length === 0)}
      >
        {submitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {submitting ? "Submitting…" : "Submit assignment"}
      </Button>
    </div>
  );
}
