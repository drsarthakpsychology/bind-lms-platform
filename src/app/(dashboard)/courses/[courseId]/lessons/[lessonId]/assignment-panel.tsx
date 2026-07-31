"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  submitTextAssignment,
  prepareSubmissionUpload,
  submitAudioAssignment,
  getSubmissionAudioUrl,
  type SubmissionResult,
} from "./actions";

type ExistingSubmission = {
  status: "pending_review" | "approved";
  text_content: string | null;
  audio_storage_path: string | null;
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
  const router = useRouter();
  const submission = existingSubmission;
  const boundTextAction = submitTextAssignment.bind(null, assignmentId);
  const [state, formAction, pending] = useActionState(boundTextAction, initialState);

  const [audioStatus, setAudioStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [audioError, setAudioError] = useState<string | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) {
      router.refresh();
    }
    wasPending.current = pending;
  }, [pending, state.error, router]);

  useEffect(() => {
    if (submission?.audio_storage_path) {
      getSubmissionAudioUrl(assignmentId, submission.audio_storage_path).then((result) => {
        if (result.ok) setPlaybackUrl(result.url);
      });
    }
  }, [assignmentId, submission?.audio_storage_path]);

  const isApproved = submission?.status === "approved";

  async function handleAudioFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioStatus("uploading");
    setAudioError(null);

    const signed = await prepareSubmissionUpload(assignmentId, file.name);
    if (!signed.ok) {
      setAudioStatus("error");
      setAudioError(signed.error);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.storage
      .from("submissions")
      .uploadToSignedUrl(signed.path, signed.token, file);

    if (error) {
      setAudioStatus("error");
      setAudioError(error.message);
      return;
    }

    const result = await submitAudioAssignment(assignmentId, signed.path);
    if (result.error) {
      setAudioStatus("error");
      setAudioError(result.error);
      return;
    }

    setAudioStatus("idle");
    router.refresh();
  }

  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-foreground">Assignment</h2>
        {submission && (
          <span
            className={
              isApproved
                ? "rounded-full bg-status-success-bg px-2 py-0.5 text-xs text-status-success-fg"
                : "rounded-full bg-status-pending-bg px-2 py-0.5 text-xs text-status-pending-fg"
            }
          >
            {isApproved ? "Approved" : "Pending review"}
          </span>
        )}
      </div>

      {promptText && (
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {promptText}
        </p>
      )}

      {!submission && (
        <p className="mt-3 rounded-lg bg-status-info-bg px-3 py-2 text-xs text-status-info-fg">
          Submit this assignment to unlock the next lesson. It doesn&apos;t need to be reviewed first.
        </p>
      )}

      {isApproved ? (
        <div className="mt-4 rounded-lg bg-secondary p-3 text-sm text-foreground">
          {submission?.text_content && (
            <p className="whitespace-pre-wrap">{submission.text_content}</p>
          )}
          {playbackUrl && <audio controls src={playbackUrl} className="mt-1 w-full" />}
        </div>
      ) : submissionType === "text" ? (
        <form action={formAction} className="mt-4 space-y-3">
          <textarea
            name="textContent"
            rows={5}
            defaultValue={submission?.text_content ?? ""}
            required
            className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            placeholder="Write your response…"
          />
          {state.error && (
            <p role="alert" className="text-xs text-status-alert-fg">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Submitting…" : submission ? "Resubmit" : "Submit"}
          </button>
        </form>
      ) : (
        <div className="mt-4 space-y-2">
          {submission?.audio_storage_path && playbackUrl && (
            <audio controls src={playbackUrl} className="w-full" />
          )}
          <label className="inline-block cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary">
            {audioStatus === "uploading"
              ? "Uploading…"
              : submission
                ? "Replace recording"
                : "Upload recording"}
            <input
              type="file"
              accept="audio/mpeg,audio/mp4,audio/wav,audio/webm,audio/ogg,audio/x-m4a"
              className="hidden"
              onChange={handleAudioFile}
              disabled={audioStatus === "uploading"}
            />
          </label>
          {audioError && <p className="text-xs text-status-alert-fg">{audioError}</p>}
        </div>
      )}
    </div>
  );
}
