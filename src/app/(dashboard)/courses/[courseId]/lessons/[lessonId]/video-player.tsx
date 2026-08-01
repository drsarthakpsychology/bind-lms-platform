"use client";

import { useEffect, useRef, useState } from "react";
import { Watermark } from "./watermark";
import { pingProgress } from "./actions";

export function VideoPlayer({
  lessonId,
  src,
  resumeSeconds,
  watermarkLabel,
}: {
  lessonId: string;
  src: string;
  resumeSeconds: number;
  watermarkLabel: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tampered, setTampered] = useState(false);

  // Resume playback at the last saved position.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function handleLoadedMetadata() {
      if (video && resumeSeconds > 0 && resumeSeconds < video.duration) {
        video.currentTime = resumeSeconds;
      }
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, [resumeSeconds]);

  // Ping progress every 10 seconds while playing.
  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.paused || !video.duration) return;
      pingProgress(lessonId, video.currentTime, video.duration);
    }, 10000);

    return () => clearInterval(interval);
  }, [lessonId]);

  // Pause when the tab isn't visible.
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        videoRef.current?.pause();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  function handleTamperDetected() {
    videoRef.current?.pause();
    setTampered(true);
  }

  return (
    <div className="relative overflow-hidden rounded-md bg-black">
      <video
        ref={videoRef}
        src={src}
        controls
        controlsList="nodownload"
        className="aspect-video w-full"
        onContextMenu={(e) => e.preventDefault()}
      />

      {!tampered && <Watermark label={watermarkLabel} onTamperDetected={handleTamperDetected} />}

      {tampered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black p-6 text-center">
          <div className="max-w-md rounded-md border-2 border-white/20 bg-black/70 p-6">
            <p className="font-semibold text-white">Playback paused</p>
            <p className="mt-2 text-sm text-gray-300">
              This video&apos;s watermark was tampered with. Reload the page to continue watching.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
