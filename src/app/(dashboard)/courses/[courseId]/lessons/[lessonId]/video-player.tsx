"use client";

import { useEffect, useRef, useState } from "react";
import { Watermark } from "./watermark";
import { pingProgress } from "./actions";

/**
 * Video player with a persistent, dynamic watermark.
 *
 * Full-screen handling: the browser's native fullscreen API is requested on
 * the *wrapper* (the element that contains both the <video> and the
 * <Watermark>), not on the <video> itself. Native fullscreen promotes one
 * element — if we fullscreened the <video>, the watermark sibling would be
 * left behind and invisible. Fullscreening the wrapper keeps the watermark
 * composited over the video at all times.
 *
 * Media-protection boundaries (honest limits): the URL is a short-lived
 * signed Supabase URL (30 min) minted server-side after an authz check, and
 * the native download control is suppressed (controlsList="nodownload").
 * Nothing a browser can show can be made impossible to capture — a
 * determined user can always screen-record or capture the decoded frames.
 * These are practical deterrents, not DRM.
 */
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tampered, setTampered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Track fullscreen state on the wrapper so the UI (and the watermark's
  // relative sizing) can react.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function handleFsChange() {
      setIsFullscreen(document.fullscreenElement === wrapper);
    }
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  function handleTamperDetected() {
    videoRef.current?.pause();
    setTampered(true);
  }

  // "Play" with fullscreen: the video is interactive, but the native
  // fullscreen button on the <video> would fullscreen just the video and
  // drop the watermark. We keep native controls but wrap fullscreen via a
  // separate button that promotes the wrapper. (The video element itself
  // can't have its fullscreen behavior overridden cleanly across browsers,
  // so the explicit button is the reliable path.)
  function toggleFullscreen() {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (document.fullscreenElement === wrapper) {
      void document.exitFullscreen();
    } else {
      void wrapper.requestFullscreen();
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="relative overflow-hidden rounded-md bg-black"
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        src={src}
        controls
        controlsList="nodownload"
        disablePictureInPicture
        className="aspect-video w-full"
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

      {/* Fullscreen button — promotes the wrapper (video + watermark). */}
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        className="absolute right-3 bottom-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-md border-2 border-white/30 bg-black/60 text-white opacity-90 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {isFullscreen ? (
            // Collapse
            <>
              <path d="M8 3v3a2 2 0 0 1-2 2H3" />
              <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
              <path d="M3 16h3a2 2 0 0 1 2 2v3" />
              <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
            </>
          ) : (
            // Expand
            <>
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
              <path d="M3 16v3a2 2 0 0 0 2 2h3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
