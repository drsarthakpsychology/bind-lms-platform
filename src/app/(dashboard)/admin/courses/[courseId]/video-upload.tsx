"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { prepareVideoUpload, attachVideoToLesson, type SignedUploadResult } from "./actions";
import { buttonVariants } from "@/components/ui/button";

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
    let signed: SignedUploadResult;
    try {
      signed = await prepareVideoUpload(courseId, file.name);
    } catch {
      setStatus("idle");
      setErrorMsg("Could not prepare the upload. Check your connection and try again.");
      return;
    }
    if (!signed.ok) {
      setStatus("idle");
      setErrorMsg(signed.error);
      return;
    }

    // 2. Upload directly from the browser to Supabase Storage.
    let uploadErrorMessage: string | null = null;
    try {
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from("videos")
        .uploadToSignedUrl(signed.path, signed.token, file);
      uploadErrorMessage = uploadError?.message ?? null;
    } catch {
      setStatus("idle");
      setErrorMsg("The upload failed. Check your connection and try again.");
      return;
    }

    if (uploadErrorMessage) {
      setStatus("idle");
      setErrorMsg(uploadErrorMessage);
      return;
    }

    // 3. Tell the server the upload finished, so it can record the path.
    let attachResult: { error: string | null };
    try {
      attachResult = await attachVideoToLesson(lessonId, courseId, signed.path);
    } catch {
      setStatus("idle");
      setErrorMsg("The video was uploaded, but saving it failed. Try again.");
      return;
    }

    setStatus("idle");
    if (attachResult.error) {
      setErrorMsg(attachResult.error);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label
        className={cn(
          buttonVariants({ variant: "secondary", size: "sm" }),
          status === "uploading" && "pointer-events-none opacity-50",
          "cursor-pointer"
        )}
      >
        {status === "uploading" ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
        ) : (
          <Upload className="size-3.5" aria-hidden />
        )}
        {status === "uploading" ? "Uploading…" : hasVideo ? "Replace video" : "Upload video"}
        <input
          type="file"
          accept="video/mp4,video/quicktime,video/webm,video/x-matroska"
          className="hidden"
          onChange={handleFile}
          disabled={status === "uploading"}
        />
      </label>
      {errorMsg && <span role="alert" className="text-caption text-status-alert-fg">{errorMsg}</span>}
    </div>
  );
}
