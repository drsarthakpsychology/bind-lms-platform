"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Loader2, Play, UserRound } from "lucide-react";
import { approveSubmission, getSubmissionAudioUrl } from "./actions";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
    <Card variant="flat">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-accent text-foreground"
            >
              <UserRound className="size-5" />
            </span>
            <div>
              <p className="text-small font-semibold text-foreground">{studentEmail}</p>
              <p className="text-caption text-muted-foreground">
                {courseTitle} · {lessonTitle}
              </p>
            </div>
          </div>
          <Badge variant={status === "approved" ? "success" : "pending"}>
            {status === "approved" ? (
              <CheckCircle2 className="size-3" aria-hidden />
            ) : (
              <Clock className="size-3" aria-hidden />
            )}
            {status === "approved" ? "Approved" : "Pending review"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {promptText && (
          <p className="text-caption text-muted-foreground">
            <span className="font-semibold text-foreground">Prompt: </span>
            {promptText}
          </p>
        )}

        {textContent && (
          <div className="whitespace-pre-wrap rounded-md border-2 border-border bg-secondary/60 p-3 text-small text-foreground">
            {textContent}
          </div>
        )}

        {audioStoragePath && (
          <div>
            {audioUrl ? (
              <audio controls src={audioUrl} className="w-full" />
            ) : (
              <Button type="button" variant="outline" size="sm" onClick={handleListen} disabled={loadingAudio}>
                {loadingAudio ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                ) : (
                  <Play className="size-3.5" aria-hidden />
                )}
                {loadingAudio ? "Preparing…" : "Listen to recording"}
              </Button>
            )}
          </div>
        )}

        {error && (
          <p role="alert" className="text-caption text-status-alert-fg">
            {error}
          </p>
        )}

        {status !== "approved" && (
          <Button type="button" size="sm" onClick={handleApprove} disabled={isPending}>
            {isPending && <Loader2 className="size-3.5 animate-spin" aria-hidden />}
            {isPending ? "Approving…" : "Approve"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
