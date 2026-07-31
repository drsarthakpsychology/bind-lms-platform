"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { prepareVideoUpload, attachVideoToLesson } from "./actions";

export function VideoUpload({
  lessonId,
  courseId,
  hasVideo,
}: {
  lessonId: string;
  courseId: string;
  hasVideo: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "uploading">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setStatus("uploading");
    setErrorMsg(null);

    // 1. Ask the server for a signed upload slot (this is the only part
    //    that touches our own server — the file bytes never pass through
    //    it, so Next.js's Server Action body-size limit never applies).
    const signed = await prepareVideoUpload(courseId, file.name);
    if (!signed.ok) {
      setStatus("idle");
      setErrorMsg(signed.error);
      return;
    }

    // 2. Upload directly from the browser to Supabase Storage.
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from("videos")
      .uploadToSignedUrl(signed.path, signed.token, file);

    if (uploadError) {
      setStatus("idle");
      setErrorMsg(uploadError.message);
      return;
    }

    // 3. Tell the server the upload finished, so it can record the path.
    const attachResult = await attachVideoToLesson(lessonId, courseId, signed.path);
    setStatus("idle");
    if (attachResult.error) {
      setErrorMsg(attachResult.error);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {hasVideo && status === "idle" && !errorMsg && (
        <span className="rounded-full bg-status-success-bg px-2 py-0.5 text-xs text-status-success-fg">
          Video attached
        </span>
      )}
      <label
        className={
          status === "uploading"
            ? "cursor-not-allowed rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground"
            : "cursor-pointer rounded-lg border border-border px-2.5 py-1 text-xs text-foreground hover:bg-secondary"
        }
      >
        {status === "uploading" ? "Uploading…" : hasVideo ? "Replace video" : "Upload video"}
        <input
          type="file"
          accept="video/mp4,video/quicktime,video/webm,video/x-matroska"
          className="hidden"
          onChange={handleFile}
          disabled={status === "uploading"}
        />
      </label>
      {errorMsg && <span className="text-xs text-status-alert-fg">{errorMsg}</span>}
    </div>
  );
}
