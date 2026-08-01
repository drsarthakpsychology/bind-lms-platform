"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronDown, Clock, FileText, Loader2, Play } from "lucide-react";
import { approveSubmission, returnFeedback, getSubmissionAudioUrl, getSubmissionFileUrl } from "./actions";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type ReviewFile = {
  id: string;
  originalName: string;
  storagePath: string;
  format: string | null;
};

/**
 * A submission row in the admin review queue. Clicking expands the detail:
 * the student's files (inline preview for PDF/images), their note, a Feedback
 * box, an optional Score, and Return feedback as the primary action.
 */
export function SubmissionReviewRow({
  submissionId,
  studentEmail,
  courseTitle,
  lessonTitle,
  assignmentTitle,
  submittedAt,
  isLate,
  status,
  textContent,
  audioStoragePath,
  note,
  score,
  feedback,
  files,
}: {
  submissionId: string;
  studentEmail: string;
  courseTitle: string;
  lessonTitle: string;
  assignmentTitle: string;
  submittedAt: string;
  isLate: boolean;
  status: "pending_review" | "approved" | "returned";
  textContent: string | null;
  audioStoragePath: string | null;
  note: string | null;
  score: number | null;
  feedback: string | null;
  files: ReviewFile[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [feedbackDraft, setFeedbackDraft] = useState(feedback ?? "");
  const [scoreDraft, setScoreDraft] = useState(score?.toString() ?? "");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});
  const [loadingFile, setLoadingFile] = useState<string | null>(null);

  const graded = status !== "pending_review";

  function handleApprove() {
    setError(null);
    startTransition(async () => {
      const result = await approveSubmission(submissionId);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  async function handleReturn() {
    setError(null);
    startTransition(async () => {
      const parsedScore = scoreDraft === "" ? null : Number(scoreDraft);
      if (scoreDraft !== "" && (Number.isNaN(parsedScore) || parsedScore! < 0 || parsedScore! > 100)) {
        setError("Score must be a number between 0 and 100.");
        return;
      }
      const result = await returnFeedback(submissionId, feedbackDraft, parsedScore);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  async function handleListen() {
    if (!audioStoragePath) return;
    setError(null);
    const result = await getSubmissionAudioUrl(audioStoragePath);
    if (result.error) {
      setError(result.error);
      return;
    }
    setAudioUrl(result.url);
  }

  async function handleFilePreview(f: ReviewFile) {
    if (fileUrls[f.id]) return;
    setLoadingFile(f.id);
    setError(null);
    const result = await getSubmissionFileUrl(f.storagePath);
    setLoadingFile(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    setFileUrls((prev) => ({ ...prev, [f.id]: result.url! }));
  }

  return (
    <Card variant="flat">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-small font-semibold text-foreground">{studentEmail}</span>
          <span className="block truncate text-caption text-muted-foreground">
            {courseTitle} · {lessonTitle} · {assignmentTitle}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="text-caption text-muted-foreground">{submittedAt}</span>
          {isLate && <Badge variant="pending">Late</Badge>}
          <Badge variant={graded ? "graded" : "pending"}>
            {graded ? <CheckCircle2 className="size-3" aria-hidden /> : <Clock className="size-3" aria-hidden />}
            {status === "pending_review" ? "Pending" : "Graded"}
          </Badge>
          <ChevronDown className={"size-4 text-muted-foreground transition-transform " + (open ? "rotate-180" : "")} aria-hidden />
        </span>
      </button>

      {open && (
        <CardContent className="space-y-4 border-t-2 border-border">
          {/* Student's submission */}
          {textContent && (
            <div className="whitespace-pre-wrap rounded-md border-2 border-border bg-secondary/60 p-3 text-small text-foreground">
              {textContent}
            </div>
          )}
          {note && (
            <div className="rounded-md border-2 border-border bg-muted/50 p-3 text-small text-muted-foreground">
              <span className="font-semibold text-foreground">Note: </span>
              {note}
            </div>
          )}

          {/* Files */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-small font-medium text-foreground">Files</p>
              {files.map((f) => {
                const isPreviewable = f.format === "pdf" || ["png", "jpg", "jpeg", "webp"].includes(f.format ?? "");
                return (
                  <div key={f.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 rounded-md border-2 border-border bg-card px-3 py-2 text-small">
                      <span className="truncate text-foreground">{f.originalName}</span>
                      {!fileUrls[f.id] && (
                        <Button type="button" variant="outline" size="xs" onClick={() => handleFilePreview(f)} disabled={loadingFile === f.id}>
                          {loadingFile === f.id ? <Loader2 className="size-3 animate-spin" aria-hidden /> : <FileText className="size-3" aria-hidden />}
                          {isPreviewable ? "Preview" : "Get link"}
                        </Button>
                      )}
                    </div>
                    {fileUrls[f.id] && isPreviewable && f.format === "pdf" && (
                      <iframe src={`${fileUrls[f.id]}#toolbar=0`} title={f.originalName} className="h-72 w-full rounded-md border-2 border-border bg-background" />
                    )}
                    {fileUrls[f.id] && isPreviewable && f.format !== "pdf" && (
                      // eslint-disable-next-line @next/next/no-img-element -- signed URL, can't use next/image
                      <img src={fileUrls[f.id]} alt={f.originalName} className="max-h-80 rounded-md border-2 border-border object-contain" />
                    )}
                    {fileUrls[f.id] && !isPreviewable && (
                      <a href={fileUrls[f.id]} download className="text-small text-primary hover:underline">
                        Download {f.originalName}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Audio */}
          {audioStoragePath && (
            <div>
              {audioUrl ? (
                <audio controls src={audioUrl} className="w-full" />
              ) : (
                <Button type="button" variant="outline" size="sm" onClick={handleListen}>
                  <Play className="size-3.5" aria-hidden />
                  Listen to recording
                </Button>
              )}
            </div>
          )}

          {/* Feedback + score */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_6rem]">
            <label className="block space-y-1.5">
              <span className="text-small font-medium">Feedback</span>
              <Textarea
                value={feedbackDraft}
                onChange={(e) => setFeedbackDraft(e.target.value)}
                rows={3}
                placeholder="What worked, what to revisit…"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-small font-medium">Score</span>
              <input
                type="number"
                min={0}
                max={100}
                value={scoreDraft}
                onChange={(e) => setScoreDraft(e.target.value)}
                placeholder="—"
                className="h-9 w-full rounded-md border-2 border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/60"
              />
            </label>
          </div>

          {error && (
            <p role="alert" className="text-caption text-status-alert-fg">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {status === "pending_review" ? (
              <>
                <Button type="button" size="sm" onClick={handleReturn} disabled={isPending}>
                  {isPending && <Loader2 className="size-3.5 animate-spin" aria-hidden />}
                  Return feedback
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handleApprove} disabled={isPending}>
                  Approve
                </Button>
              </>
            ) : (
              <span className="text-caption text-muted-foreground">
                {status === "returned" ? "Feedback returned to student." : "Approved."}
                {score !== null && ` Score: ${score}/100.`}
              </span>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
