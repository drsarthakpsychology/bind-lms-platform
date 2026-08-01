"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { prepareVideoUpload, createLessonWithVideo, type CreateLessonState } from "./actions";

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
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="videoPath" value={videoPath ?? ""} />

      <div>
        <label className="block text-xs font-medium text-muted-foreground">Video</label>
        <div className="mt-1 flex items-center gap-3">
          <label className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary">
            {fileName ? "Choose a different file" : "Choose video file"}
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm,video/x-matroska"
              className="hidden"
              onChange={handleFile}
            />
          </label>
          {fileName && (
            <span className="truncate text-sm text-muted-foreground">{fileName}</span>
          )}
        </div>
        {uploadStatus === "uploading" && (
          <p className="mt-2 text-xs text-status-pending-fg">Uploading in the background…</p>
        )}
        {uploadStatus === "done" && (
          <p className="mt-2 text-xs text-status-success-fg">Upload complete.</p>
        )}
        {uploadStatus === "error" && (
          <p className="mt-2 text-xs text-status-alert-fg">{uploadError}</p>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[180px] flex-1">
          <label htmlFor="title" className="block text-xs font-medium text-muted-foreground">
            Lesson title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            placeholder="Psychiatric Interviewing Basics"
          />
        </div>
        <div className="w-24">
          <label htmlFor="orderIndex" className="block text-xs font-medium text-muted-foreground">
            Order
          </label>
          <input
            id="orderIndex"
            name="orderIndex"
            type="number"
            defaultValue={nextOrderIndex}
            className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-xs font-medium text-muted-foreground">
          Lesson notes (optional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          placeholder="Shown to students under the video."
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="requiresAssignment"
          checked={requiresAssignment}
          onChange={(e) => setRequiresAssignment(e.target.checked)}
          className="h-4 w-4 rounded border-input"
        />
        Requires assignment
      </label>

      {requiresAssignment && (
        <div className="space-y-3 rounded-lg border border-border bg-secondary p-3">
          <div>
            <label htmlFor="assignmentPrompt" className="block text-xs font-medium text-muted-foreground">
              Assignment instructions
            </label>
            <textarea
              id="assignmentPrompt"
              name="assignmentPrompt"
              rows={3}
              className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              placeholder="Summarize the key differences between CBT and DBT in 200 words."
            />
          </div>
          <div>
            <span className="block text-xs font-medium text-muted-foreground">Submission type</span>
            <div className="mt-1 flex gap-4 text-sm text-foreground">
              <label className="flex items-center gap-1.5">
                <input type="radio" name="assignmentType" value="text" defaultChecked />
                Text
              </label>
              <label className="flex items-center gap-1.5">
                <input type="radio" name="assignmentType" value="audio" />
                Audio
              </label>
            </div>
          </div>
        </div>
      )}

      {state.error && (
        <p role="alert" className="text-sm text-status-alert-fg">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        title={uploadStatus !== "done" ? "Upload a video first" : undefined}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Creating…" : "Add lesson"}
      </button>
    </form>
  );
}
