"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Watermark } from "./watermark";
import { pingProgress } from "./actions";

/** Element plus the vendor-prefixed fullscreen methods (Safari/iOS/old Edge). */
type FsElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  msExitFullscreen?: () => Promise<void> | void;
}

function getFullscreenElement(): Element | null {
  const d = document as FullscreenDocument;
  return (
    document.fullscreenElement ??
    d.webkitFullscreenElement ??
    d.msFullscreenElement ??
    null
  );
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [tampered, setTampered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);

  // HLS playback (R2 migration): when the signed URL is an .m3u8 master
  // playlist, drive the <video> through hls.js. Falls back to native playback
  // for direct files. hls.js attaches to the same <video> element, so every
  // other behaviour (watermark, fullscreen, PiP-exit) is untouched.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (src.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS — just point src at the playlist.
        video.src = src;
      }
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [src]);

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

  // Track fullscreen state from the EVENT, never from optimistic state — the
  // user can leave fullscreen via Escape or the browser chrome, and only the
  // event reflects that.
  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(getFullscreenElement()));
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  // If Picture-in-Picture somehow starts, exit it immediately — PiP promotes
  // the raw <video> into a separate window with no watermark.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnter = () => document.exitPictureInPicture?.().catch(() => {});
    video.addEventListener("enterpictureinpicture", onEnter);
    return () => video.removeEventListener("enterpictureinpicture", onEnter);
  }, []);

  // Pseudo-fullscreen (iPhone Safari): lock body scroll while active so the
  // fixed overlay is the only thing on screen.
  useEffect(() => {
    if (isPseudoFullscreen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isPseudoFullscreen]);

  // Allow Escape / hardware Back to clear pseudo-fullscreen (no native
  // fullscreenchange fires for it).
  useEffect(() => {
    if (!isPseudoFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPseudoFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPseudoFullscreen]);

  function setPseudoFullscreen(on: boolean) {
    setIsPseudoFullscreen(on);
  }

  function handleTamperDetected() {
    videoRef.current?.pause();
    setTampered(true);
  }

  // Enter/exit fullscreen on the WRAPPER (video + watermark), not the raw
  // <video>. Feature-detected for Safari/iOS prefixes; iPhone gets a
  // pseudo-fullscreen fallback (see 2.5). requestFullscreen() rejects
  // outside a user-gesture handler, so wrap in try/catch to avoid unhandled
  // rejection noise.
  async function toggleFullscreen() {
    const el = containerRef.current as FsElement | null;
    if (!el) return;

    try {
      if (getFullscreenElement()) {
        const d = document as FullscreenDocument;
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (d.webkitExitFullscreen) d.webkitExitFullscreen();
        else if (d.msExitFullscreen) d.msExitFullscreen();
        return;
      }

      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      } else {
        // iPhone Safari: no Element.requestFullscreen(). Use pseudo-fullscreen
        // (CSS class) instead of webkitEnterFullscreen, which promotes the raw
        // <video> into the native iOS player we can't overlay.
        setPseudoFullscreen(true);
      }
    } catch {
      // Not in a user gesture or already fullscreen — ignore.
    }
  }

  return (
    <div
      ref={containerRef}
      data-testid="plms-player"
      className={
        "plms-player relative overflow-hidden rounded-md bg-black" +
        (isPseudoFullscreen ? " is-pseudo-fullscreen" : "")
      }
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        // hls.js drives the element via MediaSource when the URL is an .m3u8
        // master; for direct files (or Safari native HLS) we set src below.
        src={src.endsWith(".m3u8") ? undefined : src}
        controls
        playsInline
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        x-webkit-airplay="deny"
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
