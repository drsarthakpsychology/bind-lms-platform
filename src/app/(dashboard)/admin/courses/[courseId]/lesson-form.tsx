"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, CircleAlert, Loader2, Upload, Video as VideoIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { prepareVideoUpload, createLessonWithVideo, type CreateLessonState } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState: CreateLessonState = { error: null };

export function LessonForm({ courseId, nextOrderIndex }: { courseId: string; nextOrderIndex: number }) {
  const boundAction = createLessonWithVideo.bind(null, courseId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [videoPath, setVideoPath] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [requiresAssignment, setRequiresAssignment] = useState(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) {
      formRef.current?.reset();
      setUploadStatus("idle");
      setVideoPath(null);
      setFileName(null);
      setRequiresAssignment(false);
    }
    wasPending.current = pending;
  }, [pending, state.error]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadStatus("uploading");
    setUploadError(null);
    setVideoPath(null);

    const signed = await prepareVideoUpload(courseId, file.name);
    if (!signed.ok) {
      setUploadStatus("error");
      setUploadError(signed.error);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.storage.from("videos").uploadToSignedUrl(
      signed.path,
      signed.token,
      file,
    );

    if (error) {
      setUploadStatus("error");
      setUploadError(error.message);
      return;
    }

    setVideoPath(signed.path);
    setUploadStatus("done");
  }

  const canSubmit = uploadStatus === "done" && !pending;

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <input type="hidden" name="videoPath" value={videoPath ?? ""} />

      <div className="space-y-1.5">
        <Label>Video</Label>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border-2 border-border bg-card px-3 py-2 text-small font-medium text-foreground transition-[transform,box-shadow] hover:bg-accent active:translate-y-px">
            {uploadStatus === "uploading" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="size-4" aria-hidden />
            )}
            {fileName ? "Choose a different file" : "Choose video file"}
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm,video/x-matroska"
              className="hidden"
              onChange={handleFile}
            />
          </label>
          {fileName && (
            <span className="truncate text-small text-muted-foreground">{fileName}</span>
          )}
        </div>
        {uploadStatus === "uploading" && (
          <p className="text-caption text-status-pending-fg">Uploading in the background…</p>
        )}
        {uploadStatus === "done" && (
          <p className="flex items-center gap-1.5 text-caption text-status-success-fg">
            <CheckCircle2 className="size-3.5" aria-hidden />
            Upload complete.
          </p>
        )}
        {uploadStatus === "error" && (
          <p role="alert" className="flex items-center gap-1.5 text-caption text-status-alert-fg">
            <CircleAlert className="size-3.5" aria-hidden />
            {uploadError}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[180px] flex-1 space-y-1.5">
          <Label htmlFor="title">Lesson title</Label>
          <Input
            id="title"
            name="title"
            type="text"
            required
            placeholder="Psychiatric Interviewing Basics"
          />
        </div>
        <div className="w-24 space-y-1.5">
          <Label htmlFor="orderIndex">Order</Label>
          <Input
            id="orderIndex"
            name="orderIndex"
            type="number"
            defaultValue={nextOrderIndex}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Lesson notes (optional)</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Shown to students under the video."
        />
      </div>

      <label className="flex h-6 items-center gap-2.5 text-small font-medium text-foreground">
        {/* The Switch renders a button and doesn't submit a value, so keep a
            hidden input synced to it — the server action reads
            `requiresAssignment === "on"`. */}
        <input type="hidden" name="requiresAssignment" value={requiresAssignment ? "on" : ""} />
        <Switch
          checked={requiresAssignment}
          onCheckedChange={setRequiresAssignment}
          aria-label="Requires assignment"
        />
        Requires assignment
      </label>

      {requiresAssignment && (
        <div className="space-y-4 rounded-md border-2 border-border bg-secondary/60 p-4">
          <div className="space-y-1.5">
            <Label htmlFor="assignmentPrompt">Assignment instructions</Label>
            <Textarea
              id="assignmentPrompt"
              name="assignmentPrompt"
              rows={3}
              placeholder="Summarize the key differences between CBT and DBT in 200 words."
            />
          </div>
          <fieldset>
            <legend className="text-small font-medium text-foreground">Submission type</legend>
            <div className="mt-2 flex gap-4 text-small text-foreground">
              <label className="flex cursor-pointer items-center gap-1.5">
                <input type="radio" name="assignmentType" value="text" defaultChecked className="size-4 accent-primary" />
                Text
              </label>
              <label className="flex cursor-pointer items-center gap-1.5">
                <input type="radio" name="assignmentType" value="audio" className="size-4 accent-primary" />
                Audio
              </label>
            </div>
          </fieldset>
        </div>
      )}

      {state.error && (
        <Alert variant="destructive" role="alert">
          <AlertTitle>Could not add lesson</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={!canSubmit} title={uploadStatus !== "done" ? "Upload a video first" : undefined}>
        <VideoIcon className="size-4" aria-hidden />
        {pending ? "Creating…" : "Add lesson"}
      </Button>
    </form>
  );
}
