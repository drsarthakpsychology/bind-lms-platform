"use client";

import { useActionState, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  submitTextAssignment,
  prepareSubmissionUpload,
  submitAudioAssignment,
  type SubmissionResult,
} from "./actions";

export type ExistingSubmission = {
  status: "pending_review" | "approved";
  text_content: string | null;
} | null;

const initialState: SubmissionResult = { error: null };

export function AssignmentPanel({
  assignmentId,
  promptText,
  submissionType,
  existingSubmission,
}: {
  assignmentId: string;
  promptText: string | null;
  submissionType: "text" | "audio";
  existingSubmission: ExistingSubmission;
}) {
  const isApproved = existingSubmission?.status === "approved";

  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-foreground">Assignment</h2>
        {existingSubmission && (
          <span
            className={
              isApproved
                ? "rounded-full bg-status-success-bg px-2 py-0.5 text-xs text-status-success-fg"
                : "rounded-full bg-status-pending-bg px-2 py-0.5 text-xs text-status-pending-fg"
            }
          >
            {isApproved ? "Approved" : "Submitted — pending review"}
          </span>
        )}
      </div>

      {promptText && (
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {promptText}
        </p>
      )}

      {isApproved ? (
        <p className="mt-4 text-sm text-muted-foreground">
          This submission has been reviewed and approved. No further changes needed.
        </p>
      ) : submissionType === "text" ? (
        <TextSubmissionForm
          assignmentId={assignmentId}
          defaultValue={existingSubmission?.text_content ?? ""}
        />
      ) : (
        <AudioSubmissionForm assignmentId={assignmentId} hasExisting={Boolean(existingSubmission)} />
      )}
    </div>
  );
}

function TextSubmissionForm({
  assignmentId,
  defaultValue,
}: {
  assignmentId: string;
  defaultValue: string;
}) {
  const boundAction = submitTextAssignment.bind(null, assignmentId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="mt-4 space-y-3">
      <textarea
        name="textContent"
        rows={5}
        required
        defaultValue={defaultValue}
        className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        placeholder="Write your response…"
      />
      {state.error && (
        <p role="alert" className="text-sm text-status-alert-fg">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Submitting…" : defaultValue ? "Resubmit" : "Submit"}
      </button>
    </form>
  );
}

function AudioSubmissionForm({
  assignmentId,
  hasExisting,
}: {
  assignmentId: string;
  hasExisting: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setFileName(file.name);
    setStatus("uploading");
    setErrorMsg(null);

    const signed = await prepareSubmissionUpload(assignmentId, file.name);
    if (!signed.ok) {
      setStatus("error");
      setErrorMsg(signed.error);
      return;
    }

    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from("submissions")
      .uploadToSignedUrl(signed.path, signed.token, file);

    if (uploadError) {
      setStatus("error");
      setErrorMsg(uploadError.message);
      return;
    }

    const result = await submitAudioAssignment(assignmentId, signed.path);
    if (result.error) {
      setStatus("error");
      setErrorMsg(result.error);
      return;
    }

    // A full submission-state refresh (status badge, locking) needs the
    // server data this component doesn't hold — simplest correct approach
    // is a reload rather than partial client state that could drift from
    // what actually got saved.
    window.location.reload();
  }

  return (
    <div className="mt-4">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary">
        {status === "uploading" ? "Uploading…" : hasExisting ? "Replace recording" : "Upload recording"}
        <input
          type="file"
          accept="audio/mpeg,audio/mp4,audio/wav,audio/webm,audio/ogg,audio/x-m4a"
          className="hidden"
          onChange={handleFile}
          disabled={status === "uploading"}
        />
      </label>
      {fileName && status !== "error" && (
        <p className="mt-2 text-xs text-muted-foreground">{fileName}</p>
      )}
      {status === "error" && (
        <p role="alert" className="mt-2 text-sm text-status-alert-fg">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
