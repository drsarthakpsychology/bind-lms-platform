"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveSubmission, getSubmissionAudioUrl } from "./actions";

export function SubmissionRow({
  submissionId,
  studentEmail,
  courseTitle,
  lessonTitle,
  promptText,
  textContent,
  audioStoragePath,
  status,
}: {
  submissionId: string;
  studentEmail: string;
  courseTitle: string;
  lessonTitle: string;
  promptText: string | null;
  textContent: string | null;
  audioStoragePath: string | null;
  status: "pending_review" | "approved";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);

  function handleApprove() {
    setError(null);
    startTransition(async () => {
      const result = await approveSubmission(submissionId);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  async function handleListen() {
    if (!audioStoragePath) return;
    setLoadingAudio(true);
    setError(null);
    const result = await getSubmissionAudioUrl(audioStoragePath);
    setLoadingAudio(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setAudioUrl(result.url);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-foreground">{studentEmail}</p>
          <p className="text-xs text-muted-foreground">
            {courseTitle} · {lessonTitle}
          </p>
        </div>
        <span
          className={
            status === "approved"
              ? "rounded-full bg-status-success-bg px-2 py-0.5 text-xs text-status-success-fg"
              : "rounded-full bg-status-pending-bg px-2 py-0.5 text-xs text-status-pending-fg"
          }
        >
          {status === "approved" ? "Approved" : "Pending review"}
        </span>
      </div>

      {promptText && (
        <p className="mt-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Prompt: </span>
          {promptText}
        </p>
      )}

      {textContent && (
        <p className="mt-2 whitespace-pre-wrap rounded-lg bg-secondary p-3 text-sm text-foreground">
          {textContent}
        </p>
      )}

      {audioStoragePath && (
        <div className="mt-2">
          {audioUrl ? (
            <audio controls src={audioUrl} className="mt-1 w-full" />
          ) : (
            <button
              type="button"
              onClick={handleListen}
              disabled={loadingAudio}
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-foreground hover:bg-secondary disabled:opacity-60"
            >
              {loadingAudio ? "Preparing…" : "Listen to recording"}
            </button>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 text-xs text-status-alert-fg">
          {error}
        </p>
      )}

      {status !== "approved" && (
        <button
          type="button"
          onClick={handleApprove}
          disabled={isPending}
          className="mt-3 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? "Approving…" : "Approve"}
        </button>
      )}
    </div>
  );
}
