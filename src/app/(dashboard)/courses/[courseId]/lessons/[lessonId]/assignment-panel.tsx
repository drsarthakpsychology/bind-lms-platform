"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AudioLines, CheckCircle2, Clock, Loader2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  submitTextAssignment,
  prepareSubmissionUpload,
  submitAudioAssignment,
  getSubmissionAudioUrl,
  type SubmissionResult,
} from "./actions";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ExistingSubmission = {
  status: "pending_review" | "approved";
  text_content: string | null;
  audio_storage_path: string | null;
} | null;

const initialState: SubmissionResult = { error: null };

/** Human-readable labels for the allowed submission types. */
const SUBMISSION_TYPE_LABELS = [
  { value: "text", label: "Written response" },
  { value: "rich_text", label: "Rich text" },
  { value: "audio", label: "Voice recording" },
  { value: "video", label: "Video" },
  { value: "pdf", label: "PDF" },
  { value: "docx", label: "DOCX" },
  { value: "ppt", label: "PPT" },
  { value: "zip", label: "ZIP" },
  { value: "url", label: "Link" },
] as const;

export function AssignmentPanel({
  assignmentId,
  promptText,
  submissionTypes,
  existingSubmission,
}: {
  assignmentId: string;
  promptText: string | null;
  /** Comma-separated list of allowed types, e.g. "text,audio". */
  submissionTypes: string;
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

  // Allowed submission methods from the comma-separated types. Rich text
  // falls back to the plain text input for now; URL/other types are
  // reserved until their upload paths ship.
  const types = submissionTypes.split(",").map((t) => t.trim());
  const canText = types.includes("text") || types.includes("rich_text");
  const canAudio = types.includes("audio");
  const canUpload = types.some((t) => ["video", "pdf", "docx", "ppt", "zip"].includes(t));
  const canLink = types.includes("url");

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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-small text-muted-foreground">
          {SUBMISSION_TYPE_LABELS.filter((l) => types.includes(l.value))
            .map((l) => l.label)
            .join(" · ") || "Assignment"}
        </span>
        {submission && (
          <Badge variant={isApproved ? "success" : "pending"}>
            {isApproved ? (
              <CheckCircle2 className="size-3" aria-hidden />
            ) : (
              <Clock className="size-3" aria-hidden />
            )}
            {isApproved ? "Approved" : "Pending review"}
          </Badge>
        )}
      </div>

      {promptText && (
        <div className="whitespace-pre-wrap rounded-md border-2 border-border bg-muted/50 p-4 text-small leading-relaxed text-foreground">
          {promptText}
        </div>
      )}

      {!submission && (
        <Alert variant="info">
          <AudioLines className="size-4" aria-hidden />
          <AlertDescription>
            Submit this assignment to unlock the next lesson. It doesn&apos;t need to be reviewed
            first.
          </AlertDescription>
        </Alert>
      )}

      {isApproved ? (
        <div className="rounded-md border-2 border-border bg-secondary/60 p-4 text-small text-foreground">
          {submission?.text_content && (
            <p className="whitespace-pre-wrap">{submission.text_content}</p>
          )}
          {playbackUrl && <audio controls src={playbackUrl} className="mt-2 w-full" />}
        </div>
      ) : (
        <div className="space-y-5">
          {/* Text / rich text */}
          {canText && (
            <form action={formAction} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="textContent">Written response</Label>
                <Textarea
                  id="textContent"
                  name="textContent"
                  rows={5}
                  defaultValue={submission?.text_content ?? ""}
                  placeholder="Write your response…"
                />
              </div>
              {state.error && (
                <p role="alert" className="text-caption text-status-alert-fg">
                  {state.error}
                </p>
              )}
              <Button type="submit" disabled={pending}>
                {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
                {pending ? "Submitting…" : submission ? "Resubmit" : "Submit"}
              </Button>
            </form>
          )}

          {/* Audio recording / upload */}
          {canAudio && (
            <div className="space-y-3">
              {submission?.audio_storage_path && playbackUrl && (
                <audio controls src={playbackUrl} className="w-full" />
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border-2 border-border bg-card px-3 py-2 text-small font-medium text-foreground transition-[transform,box-shadow] hover:bg-accent active:translate-y-px">
                {audioStatus === "uploading" ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Upload className="size-4" aria-hidden />
                )}
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
              {audioError && (
                <p role="alert" className="text-caption text-status-alert-fg">
                  {audioError}
                </p>
              )}
            </div>
          )}

          {/* Reserved formats — surfaced so the UI is honest about what's allowed */}
          {(canUpload || canLink) && (
            <div className="rounded-md border-2 border-dashed border-border bg-muted/40 p-3 text-caption text-muted-foreground">
              Also accepted:{" "}
              {[
                canUpload ? "file upload (PDF / DOCX / PPT / ZIP)" : null,
                canLink ? "external URL / GitHub / Google Drive link" : null,
              ]
                .filter(Boolean)
                .join(" and ")}
              . The upload form for these arrives with the next release.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
