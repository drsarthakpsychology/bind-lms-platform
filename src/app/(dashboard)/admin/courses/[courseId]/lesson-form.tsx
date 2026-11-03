"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronDown, CircleAlert, Loader2, Upload, Video as VideoIcon } from "lucide-react";
import { prepareVideoUpload, createLessonWithVideo, type CreateLessonState, type SignedUploadResult } from "./actions";
import { SUBMISSION_TYPE_OPTIONS } from "@/lib/media/registry";
import { ALL_COHORTS } from "@/lib/cohorts/rules";
import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState: CreateLessonState = { error: null, notice: null };

/**
 * Selectable submission types — only types with a working student path are
 * offered (the media registry's test enforces that). Stored comma-separated in
 * assignments.submission_type.
 */
const SUBMISSION_TYPES = SUBMISSION_TYPE_OPTIONS as unknown as ReadonlyArray<{
  value: string;
  label: string;
}>;

export function LessonForm({
  courseId,
  nextOrderIndex,
  defaultWeek = 1,
  cohorts = [],
  initialCohort = null,
}: {
  courseId: string;
  nextOrderIndex: number;
  defaultWeek?: number;
  /** This course's running cohorts. Empty = nothing to pick (old rules). */
  cohorts?: { id: string; name: string }[];
  /** Pre-picked cohort (the only one, or ?cohort= in the link). */
  initialCohort?: string | null;
}) {
  const boundAction = createLessonWithVideo.bind(null, courseId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [videoPath, setVideoPath] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [requiresAssignment, setRequiresAssignment] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [week, setWeek] = useState<number>(defaultWeek);
  const [shareWith, setShareWith] = useState<string>(initialCohort ?? "");
  const needsCohort = cohorts.length > 0;

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) {
      formRef.current?.reset();
      setUploadStatus("idle");
      setVideoPath(null);
      setFileName(null);
      setRequiresAssignment(false);
      setTitle("");
      setDescription("");
      setWeek(defaultWeek);
      setShareWith(initialCohort ?? "");
    }
    wasPending.current = pending;
  }, [pending, state.error, defaultWeek, initialCohort]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadStatus("uploading");
    setUploadError(null);
    setVideoPath(null);

    let signed: SignedUploadResult;
    try {
      signed = await prepareVideoUpload(courseId, file.name);
    } catch {
      setUploadStatus("error");
      setUploadError("Could not prepare the upload. Check your connection and try again.");
      return;
    }

    if (!signed.ok) {
      setUploadStatus("error");
      setUploadError(signed.error);
      return;
    }

    try {
      // Upload DIRECTLY to the R2 pre-signed PUT URL — no Supabase byte, so the
      // 50MB Free-plan cap can't block large source videos.
      const res = await fetch(signed.url, { method: "PUT", body: file });
      if (!res.ok) {
        setUploadStatus("error");
        setUploadError(`Upload failed (${res.status}).`);
        return;
      }
    } catch {
      setUploadStatus("error");
      setUploadError("The upload failed. Check your connection and try again.");
      return;
    }

    setVideoPath(signed.key);
    setUploadStatus("done");
  }

  const canSubmit = uploadStatus === "done" && !pending && (!needsCohort || Boolean(shareWith));
  const shareName = shareWith === ALL_COHORTS ? "all cohorts" : cohorts.find((c) => c.id === shareWith)?.name;

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <input type="hidden" name="videoPath" value={videoPath ?? ""} />

      {needsCohort ? (
        <fieldset className="min-w-0 space-y-2 rounded-md border-2 border-foreground bg-card p-3 sm:p-4">
          <legend className="px-1 text-body-strong">Which cohort is this recording for?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {[...cohorts.map((c) => ({ value: c.id, label: c.name, hint: `Only ${c.name} can watch it.` })), ...(cohorts.length > 1 ? [{ value: ALL_COHORTS, label: "All cohorts", hint: "Shared curriculum video. Every running cohort can watch it." }] : [])].map((o) => (
              <label
                key={o.value}
                className={cn(
                  "flex min-h-14 cursor-pointer items-start gap-2.5 rounded-md border-2 px-3 py-2.5 transition-colors duration-fast",
                  shareWith === o.value ? "border-foreground bg-primary text-primary-foreground" : "border-foreground/25 bg-background hover:border-foreground",
                )}
              >
                <input
                  type="radio"
                  name="shareWith"
                  value={o.value}
                  required
                  checked={shareWith === o.value}
                  onChange={() => setShareWith(o.value)}
                  className="mt-1 size-4 shrink-0 accent-[#111111]"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-bold break-words">{o.label}</span>
                  <span className={cn("block text-caption", shareWith === o.value ? "" : "text-muted-foreground")}>{o.hint}</span>
                </span>
              </label>
            ))}
          </div>
          {!shareWith ? <p className="text-caption font-semibold text-muted-foreground">Pick one before you add the lesson.</p> : null}
        </fieldset>
      ) : null}

      <div className="space-y-1.5">
        <Label>Video</Label>
        <div className="flex flex-wrap items-center gap-3">
          <label
            className={buttonVariants({ variant: "secondary", size: "default" }) + " cursor-pointer"}
          >
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="w-20 space-y-1.5">
          <Label htmlFor="orderIndex">Order</Label>
          <Input
            id="orderIndex"
            name="orderIndex"
            type="number"
            min={1}
            defaultValue={nextOrderIndex}
          />
        </div>
        <div className="w-20 space-y-1.5">
          <Label htmlFor="week">Week</Label>
          <Input
            id="week"
            name="week"
            type="number"
            min={1}
            value={week}
            onChange={(e) => setWeek(Number(e.target.value) || 1)}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Live preview — the lesson card as the student sees it (T103). */}
      <details className="group rounded-md border-2 border-border bg-card">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
          <span className="text-small font-medium">Preview</span>
          <ChevronDown className="size-4 text-muted-foreground transition-transform duration-fast ease-snappy group-open:rotate-180" aria-hidden />
        </summary>
        <div className="border-t-2 border-border px-4 py-3">
          <p className="text-small font-semibold">{title.trim() || "Lesson title"}</p>
          <p className="mt-1 text-small text-muted-foreground">
            {description.trim() || "Notes shown to students under the video."}
          </p>
        </div>
      </details>

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
        <div className="space-y-4 rounded-md border-2 border-border bg-secondary p-4">
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
            <legend className="text-small font-medium text-foreground">
              Submission types
            </legend>
            <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
              {SUBMISSION_TYPES.map((type) => (
                <label
                  key={type.value}
                  className="flex cursor-pointer items-center gap-1.5 text-small text-foreground"
                >
                  <input
                    type="checkbox"
                    name="assignmentType"
                    value={type.value}
                    defaultChecked={type.value === "text"}
                    className="size-4 accent-primary"
                  />
                  {type.label}
                </label>
              ))}
            </div>
            <p className="mt-1.5 text-caption text-muted-foreground">
              Students can submit in any of the selected formats.
            </p>
          </fieldset>
        </div>
      )}

      {state.notice && !pending && (
        <p role="status" className="flex items-center gap-2 rounded-md border-2 border-foreground bg-status-success-bg px-3 py-2 text-sm font-bold text-status-success-fg">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          {state.notice}
        </p>
      )}

      {state.error && (
        <Alert variant="destructive" role="alert">
          <AlertTitle>Could not add lesson</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={!canSubmit}
        title={uploadStatus !== "done" ? "Upload a video first" : needsCohort && !shareWith ? "Pick a cohort first" : undefined}
      >
        <VideoIcon className="size-4" aria-hidden />
        {pending ? "Creating…" : needsCohort && shareName ? `Add lesson for ${shareName}` : "Add lesson"}
      </Button>
    </form>
  );
}
