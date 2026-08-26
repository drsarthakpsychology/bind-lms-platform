"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Hls, {
  FetchLoader,
  type FragmentLoaderContext,
  type LoaderConfiguration,
  type LoaderCallbacks,
  type LoaderContext,
  type PlaylistLoaderContext,
} from "hls.js";
import {
  Captions,
  Gauge,
  Loader2,
  Maximize,
  Minimize,
  MoreHorizontal,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Volume2,
  VolumeX,
} from "lucide-react";
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
 * Best-effort landscape lock on fullscreen. The Screen Orientation API is not
 * available or throws NotSupportedError on several mobile browsers (notably
 * iOS Safari, and any browser where a programmatic lock is disallowed) — this
 * is intentionally graceful: the video still plays portrait, we just ask.
 */
async function lockLandscape() {
  const o = screen.orientation as (ScreenOrientation & { lock?: (o: string) => Promise<void> }) | undefined;
  if (!o?.lock) return;
  try {
    await o.lock("landscape");
  } catch {
    /* unsupported — ignore */
  }
}

function unlockOrientation() {
  const o = screen.orientation as (ScreenOrientation & { unlock?: () => void }) | undefined;
  if (!o?.unlock) return;
  try {
    o.unlock();
  } catch {
    /* unsupported — ignore */
  }
}

const PLAYBACK_RATES = [1, 1.25, 1.5, 2, 0.75] as const;

/**
 * A hls.js loader that swaps the CURRENT stream token into every request URL.
 *
 * Stream tokens live 5 minutes; lectures run longer. Instead of restarting
 * playback (or reloading the source) when a token expires, this loader reads
 * `tokenRef` at fetch time and rewrites the `?st=` query param. The background
 * refresh timer in VideoPlayer swaps tokenRef ~30s before expiry, so the next
 * segment/playlist request already carries a fresh token. currentTime and the
 * media element are untouched.
 */
function makeTokenRotatingLoader<C extends LoaderContext>(
  tokenRef: { current: { token: string; expiresAt: number } | null },
) {
  return class TokenRotatingFetchLoader extends FetchLoader {
    // Narrow the inherited `context` field to C — FetchLoader declares it as
    // LoaderContext, which would otherwise keep this class at Loader<LoaderContext>
    // and fail the pLoader/fLoader constructor types (PlaylistLoaderContext /
    // FragmentLoaderContext). C extends LoaderContext, so this is assignable.
    context: C | null = null;

    load(context: C, config: LoaderConfiguration, callbacks: LoaderCallbacks<C>) {
      const current = tokenRef.current;
      if (current && context.url) {
        try {
          const u = new URL(context.url);
          u.searchParams.set("st", current.token);
          context.url = u.toString();
        } catch {
          // Malformed URL — leave as-is and let the base loader fail honestly.
        }
      }
      // The base loader's signature is the wider LoaderContext; the subclass
      // narrows to C (which hls.js expects for pLoader/fLoader constructors).
      super.load(
        context,
        config,
        callbacks as unknown as LoaderCallbacks<LoaderContext>,
      );
    }
  };
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

type PlayerState =
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "error"; message: string };

/**
 * Video player with a persistent, dynamic watermark and custom in-house
 * controls (no browser chrome).
 *
 * Single instance: the <video> mounts once per lesson, is torn down on
 * unmount (hls.destroy() + pause + clear src), and swapping lessons remounts
 * it fresh. The source never has `controls` — every control is ours.
 *
 * Full-screen handling: the browser's native fullscreen API is requested on
 * the *wrapper* (the element that contains both the <video> and the
 * <Watermark>), not on the <video> itself. Native fullscreen promotes one
 * element — if we fullscreened the <video>, the watermark sibling would be
 * left behind and invisible. Fullscreening the wrapper keeps the watermark
 * composited over the video at all times.
 *
 * Media-protection boundaries (honest limits): the URL is a short-lived
 * signed Supabase URL (60 min) minted server-side after an authz check, and
 * the native download control is suppressed. Nothing a browser can show can
 * be made impossible to capture — a determined user can always screen-record
 * or capture the decoded frames. These are practical deterrents, not DRM.
 */
export function VideoPlayer({
  lessonId,
  watermarkLabel,
  captionsUrl,
}: {
  lessonId: string;
  watermarkLabel: string;
  /** Optional WebVTT caption track. Omit to hide the captions toggle. */
  captionsUrl?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTap = useRef<{ time: number; x: number } | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  // The CURRENT stream token + its expiry (epoch ms). The background refresh
  // timer swaps this before the 5-min token dies; the custom hls.js loaders
  // read it at every fetch, so rotation happens without restarting playback.
  const tokenRef = useRef<{ token: string; expiresAt: number } | null>(null);
  // Whether the current source is a single MP4 (vs HLS). Read by the
  // loadedmetadata handler so the MP4-only resolution chip renders only for
  // single-file sources; HLS shows the quality menu instead.
  const mediaTypeRef = useRef<"hls" | "mp4" | null>(null);

  const [tampered, setTampered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isTouching, setIsTouching] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [rateMenuOpen, setRateMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  // Quality ladder — populated from hls.js levels on manifest parse. `quality`
  // is "auto" (native ABR, currentLevel=-1) or an hls.js level INDEX (manual
  // lock). The last manual pick persists per-device in localStorage (mobile
  // data and office Wi-Fi warrant different defaults).
  const [levels, setLevels] = useState<Array<{ height: number; index: number }>>([]);
  const [quality, setQuality] = useState<"auto" | number>("auto");
  const [qualityMenuOpen, setQualityMenuOpen] = useState(false);
  // MP4 fallback: the single-file source's native resolution ("720p"), read
  // from loadedmetadata. HLS populates `levels` and renders the quality menu;
  // this stays null there so the chip never appears for HLS sources.
  const [mp4Resolution, setMp4Resolution] = useState<string | null>(null);
  const hasCaptions = Boolean(captionsUrl);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [playerState, setPlayerState] = useState<PlayerState>({ kind: "loading" });
  const [loadKey, setLoadKey] = useState(0);
  // The resume position for the CURRENT load. Written by the fetch effect,
  // read by the media-event effect at loadedmetadata time. A ref (not state)
  // avoids the stale-closure seek when switching lessons: the media-event
  // effect no longer depends on the resume value, so it can't run with the old
  // lesson's value before the new token resolves.
  const resumeRef = useRef(0);

  // ---- Token mint + source load. Fetches a short-lived signed URL from the
  // rate-limited, enrollment-re-checked API — never a pre-signed URL in the
  // page source. Retry bumps loadKey to re-mint. ----
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let hls: Hls | null = null;

    setPlayerState({ kind: "loading" });
    resumeRef.current = 0;
    mediaTypeRef.current = null;
    setMp4Resolution(null);

    (async () => {
      let url: string;
      let resume: number;
      let mediaType: "hls" | "mp4" = "hls";
      try {
        const res = await fetch("/api/media/playback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          const message =
            res.status === 401 || res.status === 403
              ? "You don't have access to this video."
              : body?.error ?? "This video couldn't be loaded. Try again.";
          if (!cancelled) setPlayerState({ kind: "error", message });
          return;
        }
        const data = (await res.json()) as {
          token: string;
          streamUrl: string;
          mediaType?: "hls" | "mp4";
          resumeSeconds?: number;
          expiresIn?: number;
        };
        // The server tells us the media shape (HLS master vs single MP4); the
        // player branches on that rather than guessing from the URL.
        url = `${data.streamUrl}?st=${encodeURIComponent(data.token)}`;
        resume = data.resumeSeconds ?? 0;
        mediaType = data.mediaType ?? "hls";
        mediaTypeRef.current = mediaType;
        // Record the current token + its expiry so the custom loaders and the
        // refresh timer can rotate it before it dies.
        tokenRef.current = {
          token: data.token,
          expiresAt: Date.now() + (data.expiresIn ?? 300) * 1000,
        };
      } catch (e) {
        console.error("playback token fetch failed:", e);
        if (!cancelled) {
          setPlayerState({
            kind: "error",
            message: "This video couldn't be loaded. Check your connection and try again.",
          });
        }
        return;
      }

      if (cancelled) return;
      if (resume > 0) {
        resumeRef.current = resume;
      }

      try {
        if (mediaType === "hls") {
          if (Hls.isSupported()) {
            hls = new Hls({
              enableWorker: true,
              // Transparent token rotation: a stream token lives 5 minutes,
              // but a lecture can be much longer. The custom loaders read the
              // CURRENT token from tokenRef at fetch time, so when the background
              // refresh swaps tokenRef, the next segment/playlist request already
              // carries the fresh token — playback never restarts and currentTime
              // is preserved. No page reload, no source reload.
              pLoader: makeTokenRotatingLoader<PlaylistLoaderContext>(tokenRef),
              fLoader: makeTokenRotatingLoader<FragmentLoaderContext>(tokenRef),
              fragLoadingMaxRetry: 3,
              fragLoadingMaxRetryTimeout: 3000,
              manifestLoadingMaxRetry: 2,
            });
            hls.loadSource(url);
            hls.attachMedia(video);
            // Quality ladder: read the parsed levels, then restore the last
            // per-device manual pick (localStorage). Auto stays the default.
            hls.on(Hls.Events.MANIFEST_PARSED, (_evt, data) => {
              const parsed = (data.levels ?? [])
                .map((l, i) => ({ height: l.height, index: i }))
                .filter((l) => l.height > 0)
                .sort((a, b) => b.height - a.height);
              setLevels(parsed);
              try {
                const saved = localStorage.getItem("plms-quality");
                if (saved === "auto") {
                  if (hls) hls.currentLevel = -1;
                  setQuality("auto");
                } else if (saved) {
                  const h = Number(saved);
                  const match = parsed.find((l) => l.height === h);
                  if (match && hls) {
                    hls.currentLevel = match.index;
                    setQuality(match.index);
                  }
                }
              } catch {
                // localStorage unavailable (private browsing) — stay on Auto.
              }
            });
            // Bounded HLS error recovery. A stream token lives 5 minutes; when
            // it expires mid-playback every segment fetch 401s → fatal
            // NETWORK_ERROR. An unbounded startLoad() would loop forever on a
            // dead URL. Cap retries, then surface the error + Retry (which
            // re-mints a fresh token via loadKey).
            let networkRetries = 0;
            hls.on(Hls.Events.ERROR, (_evt, data) => {
              if (!data.fatal) return;
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  if (networkRetries < 2) {
                    networkRetries++;
                    hls?.startLoad();
                  } else if (!cancelled) {
                    setPlayerState({
                      kind: "error",
                      message: "This video couldn't be loaded. Try again.",
                    });
                  }
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls?.recoverMediaError();
                  break;
                default:
                  if (!cancelled) {
                    setPlayerState({
                      kind: "error",
                      message: "This video couldn't be loaded. Try again.",
                    });
                  }
                  break;
              }
            });
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          } else {
            if (!cancelled) {
              setPlayerState({
                kind: "error",
                message: "Your browser doesn't support this video format.",
              });
            }
            return;
          }
        } else {
          // Single-file MP4 — native playback.
          video.src = url;
        }
        hlsRef.current = hls;
      } catch (e) {
        console.error("video source setup failed:", e);
        if (!cancelled) {
          setPlayerState({ kind: "error", message: "This video couldn't be loaded. Try again." });
        }
      }
    })();

    return () => {
      cancelled = true;
      if (hls) hls.destroy();
      if (hlsRef.current === hls) hlsRef.current = null;
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [lessonId, loadKey]);

  // ---- Transparent token rotation ----
  // Stream tokens live 5 minutes. A lecture runs longer. This timer re-mints a
  // fresh token ~30s before the current one expires and swaps tokenRef. The
  // hls.js custom loaders pick it up on the next segment/playlist request, so
  // playback never restarts and currentTime is never touched. Only the token
  // query param changes; the HLS media stream itself is untouched.
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    async function refreshToken() {
      if (cancelled) return;
      const current = tokenRef.current;
      // Only refresh when a token exists and is about to expire. Also avoid
      // stampeding if a previous fetch is still in flight.
      if (!current || Date.now() < current.expiresAt - 30000) return;
      try {
        const res = await fetch("/api/media/playback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
        });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as {
          token: string;
          streamUrl: string;
          mediaType?: "hls" | "mp4";
          expiresIn?: number;
        };
        if (!data.token || cancelled) return;
        tokenRef.current = {
          token: data.token,
          expiresAt: Date.now() + (data.expiresIn ?? 300) * 1000,
        };
      } catch {
        // Transient failure — the next tick retries. Playback continues on the
        // old token until it genuinely expires.
      }
    }

    // Check every 15s; cheap (no-op until 30s before expiry).
    timer = setInterval(refreshToken, 15000);
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [lessonId, loadKey]);

  // ---- Media event wiring ----
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      setDuration(video.duration || 0);
      const resume = resumeRef.current;
      if (resume > 0 && resume < video.duration) {
        video.currentTime = resume;
      }
      setPlayerState({ kind: "ready" });
      // MP4 fallback: expose the single-file source resolution as a static chip
      // (HLS renders the quality menu instead, so this stays null there).
      if (mediaTypeRef.current === "mp4" && video.videoHeight > 0) {
        setMp4Resolution(`${video.videoHeight}p`);
      }
    };
    const onPlaying = () => setIsPaused(false);
    const onPause = () => setIsPaused(true);
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onProgress = () => {
      try {
        if (video.buffered.length > 0) {
          setBuffered(video.buffered.end(video.buffered.length - 1));
        }
      } catch {
        /* ignore */
      }
    };
    const onVolumeChange = () => {
      setVolume(video.volume);
      setMuted(video.muted || video.volume === 0);
    };
    const onEnded = () => {
      setIsPaused(true);
      // Auto-mark complete happens via pingProgress (90% threshold); reaching
      // the end also pings so the row records completion.
      pingProgress(lessonId, video.duration || 0, video.duration || 0);
    };
    const onError = () => {
      setPlayerState({
        kind: "error",
        message:
          "This video couldn't load. Check your connection and try again, or reload the page.",
      });
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("progress", onProgress);
    video.addEventListener("volumechange", onVolumeChange);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);
    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("volumechange", onVolumeChange);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
    };
    // Resume is read from resumeRef at loadedmetadata time, so this effect only
    // needs to re-wire when the lesson changes (a fresh <video>).
  }, [lessonId]);

  // ---- Ping progress every 10s while playing ----
  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.paused || !video.duration) return;
      pingProgress(lessonId, video.currentTime, video.duration);
    }, 10000);
    return () => clearInterval(interval);
  }, [lessonId]);

  // ---- Pause when the tab isn't visible ----
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        videoRef.current?.pause();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // ---- Track fullscreen state from the EVENT, never from optimistic state ----
  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(getFullscreenElement()));
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  // ---- Exit Picture-in-Picture if it somehow starts (no watermark in PiP) ----
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnter = () => document.exitPictureInPicture?.().catch(() => {});
    video.addEventListener("enterpictureinpicture", onEnter);
    return () => video.removeEventListener("enterpictureinpicture", onEnter);
  }, []);

  // ---- Pseudo-fullscreen (iPhone Safari): lock body scroll while active ----
  useEffect(() => {
    if (isPseudoFullscreen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isPseudoFullscreen]);

  // ---- Allow Escape / hardware Back to clear pseudo-fullscreen ----
  useEffect(() => {
    if (!isPseudoFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPseudoFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPseudoFullscreen]);

  // ---- Controls fade: show on hover/touch/focus, hide while playing ----
  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (!videoRef.current?.paused) setControlsVisible(false);
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, []);

  function setPseudoFullscreen(on: boolean) {
    setIsPseudoFullscreen(on);
  }

  function handleTamperDetected() {
    videoRef.current?.pause();
    setTampered(true);
  }

  async function toggleFullscreen() {
    const el = containerRef.current as FsElement | null;
    if (!el) return;

    try {
      if (getFullscreenElement()) {
        unlockOrientation();
        const d = document as FullscreenDocument;
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (d.webkitExitFullscreen) d.webkitExitFullscreen();
        else if (d.msExitFullscreen) d.msExitFullscreen();
        return;
      }

      if (el.requestFullscreen) {
        await el.requestFullscreen();
        void lockLandscape();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
        void lockLandscape();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      } else {
        // iPhone Safari: no Element.requestFullscreen(). Use pseudo-fullscreen
        // instead of webkitEnterFullscreen, which promotes the raw <video> into
        // the native iOS player we can't overlay.
        setPseudoFullscreen(true);
      }
    } catch {
      // Not in a user gesture or already fullscreen — ignore.
    }
  }

  // ---- Playback control handlers ----
  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => setPlayerState({
        kind: "error",
        message: "Playback was blocked. Tap again to start.",
      }));
    } else {
      video.pause();
    }
  }

  /**
   * Tap handling on touch devices: single tap toggles the controls; a double
   * tap on the left/right half seeks -10s / +10s (mobile double-tap-to-seek).
   */
  function handleTap(e: React.TouchEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.touches[0]?.clientX ?? 0;
    const now = performance.now();
    const prev = lastTap.current;
    lastTap.current = { time: now, x };

    // Double tap within 300ms → seek.
    if (prev && now - prev.time < 300) {
      const isLeft = x < rect.left + rect.width / 2;
      seekTo((videoRef.current?.currentTime ?? 0) + (isLeft ? -10 : 10));
      setControlsVisible(true);
      return;
    }

    // Single tap → toggle controls.
    setControlsVisible((v) => !v);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
  }

  function seekTo(seconds: number) {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    video.currentTime = Math.max(0, Math.min(seconds, video.duration));
    setCurrentTime(video.currentTime);
  }

  function scrubTo(seconds: number) {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    video.currentTime = Math.max(0, Math.min(seconds, video.duration));
    setCurrentTime(video.currentTime);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }

  function changeVolume(next: number) {
    const video = videoRef.current;
    if (!video) return;
    const v = Math.max(0, Math.min(1, next));
    video.volume = v;
    video.muted = v === 0;
  }

  /**
   * Lock the player to a manual quality (hls.js level index) or back to Auto
   * (native ABR). The choice persists per-device; Auto is the default.
   */
  function changeQuality(q: "auto" | number) {
    const hls = hlsRef.current;
    if (!hls) return;
    if (q === "auto") {
      hls.currentLevel = -1;
      setQuality("auto");
      try { localStorage.setItem("plms-quality", "auto"); } catch { /* ignore */ }
    } else {
      hls.currentLevel = q;
      setQuality(q);
      const level = hls.levels[q];
      if (level?.height) {
        try { localStorage.setItem("plms-quality", String(level.height)); } catch { /* ignore */ }
      }
    }
    setQualityMenuOpen(false);
  }

  const qualityLabel =
    quality === "auto"
      ? "Auto"
      : `${levels.find((l) => l.index === quality)?.height ?? ""}p`;

  function toggleCaptions() {
    setCaptionsOn((on) => !on);
    const video = videoRef.current;
    const track = video?.querySelector("track");
    if (track) track.track.mode = captionsOn ? "hidden" : "showing";
  }

  // ---- Keyboard support while the player wrapper has focus ----
  function handleKeyDown(e: React.KeyboardEvent) {
    // Don't hijack keys when the user is interacting with a form control.
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

    switch (e.key) {
      case " ":
      case "k":
      case "K":
        e.preventDefault();
        togglePlay();
        break;
      case "ArrowRight":
        e.preventDefault();
        seekTo((videoRef.current?.currentTime ?? 0) + 5);
        break;
      case "ArrowLeft":
        e.preventDefault();
        seekTo((videoRef.current?.currentTime ?? 0) - 5);
        break;
      case "ArrowUp":
        e.preventDefault();
        changeVolume((videoRef.current?.volume ?? 0) + 0.1);
        break;
      case "ArrowDown":
        e.preventDefault();
        changeVolume((videoRef.current?.volume ?? 0) - 0.1);
        break;
      case "m":
      case "M":
        e.preventDefault();
        toggleMute();
        break;
      case "f":
      case "F":
        e.preventDefault();
        toggleFullscreen();
        break;
      default:
        break;
    }
  }

  const progressPct = duration ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      data-testid="plms-player"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseMove={showControls}
      onMouseLeave={() => {
        if (!videoRef.current?.paused) setControlsVisible(false);
      }}
      onTouchStart={() => setIsTouching(true)}
      className={
        "plms-player relative aspect-video w-full bg-black outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60" +
        (isPseudoFullscreen ? " is-pseudo-fullscreen" : "") +
        (isPaused ? " is-paused" : "") +
        (isTouching ? " is-touching" : "") +
        (playerState.kind === "error" ? " is-error" : "")
      }
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Media stage — the ONLY layer that clips to the rounded frame. The
          video, overlays and watermark live here. The controls + popover menu
          live OUTSIDE it so the "More options" menu can overflow the player
          without being cut off by overflow-hidden (T151 mobile bug: the menu
          opened upward and was clipped, leaving the top row unreachable). */}
      <div className="absolute inset-0 overflow-hidden rounded-md">
        {/* The single video element. hls.js drives it via MediaSource for .m3u8;
            direct files set src above. object-fit: contain keeps the whole frame
            visible, never cropped; portrait sources letterbox with black bars. */}
        <video
          ref={videoRef}
          playsInline
          preload="metadata"
          disablePictureInPicture
          controlsList="nodownload noplaybackrate noremoteplayback"
          x-webkit-airplay="deny"
          className="h-full w-full"
          onTouchEnd={handleTap}
        >
          {/* Caption track — only rendered when the caller provides a captions
              URL (none do today, so the captions toggle stays hidden). */}
          {captionsUrl && (
            <track
              kind="captions"
              src={captionsUrl}
              srcLang="en"
              label="English"
              default
            />
          )}
        </video>

        {/* Loading / buffering state */}
        {playerState.kind === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 className="size-8 animate-spin text-white" aria-hidden />
            <span className="sr-only">Loading video…</span>
          </div>
        )}

        {/* Error state — a clear message + retry, not a dead frame */}
        {playerState.kind === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6">
            <div className="max-w-md rounded-md border-2 border-white/30 bg-black/70 p-6 text-center">
              <p className="font-semibold text-white">Video unavailable</p>
              <p className="mt-2 text-sm text-white/80">{playerState.message}</p>
              <button
                type="button"
                onClick={() => setLoadKey((k) => k + 1)}
                className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-md border-2 border-white/40 bg-white/10 px-4 text-sm font-medium text-white transition-colors hover:bg-white/20"
              >
                <RotateCcw className="size-4" aria-hidden />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Render the watermark ONCE in the DOM. Hide via opacity when the
            player is in a non-content state (error / tampered). This prevents the
            removalObserver from seeing the watermark element appear and disappear
            on every React state transition (loading→ready, ready→error, retry),
            which previously triggered a false tamper detection on first re-render. */}
        <div
          aria-hidden={tampered || playerState.kind === "error"}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: tampered || playerState.kind === "error" ? 0 : 1,
            transition: "opacity 0.2s ease",
            display: playerState.kind === "loading" ? "none" : "block",
          }}
        >
          <Watermark label={watermarkLabel} onTamperDetected={handleTamperDetected} />
        </div>

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

      {/* Custom controls — ours, not the browser's. Hidden while playing, shown
          on hover/touch/focus/pause. */}
      {playerState.kind !== "error" && (
        <div
          className="plms-player-controls"
          style={{ opacity: isPaused || controlsVisible ? 1 : undefined }}
          onMouseEnter={showControls}
        >
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPaused ? "Play" : "Pause"}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isPaused ? (
              <Play className="size-5 fill-current" aria-hidden />
            ) : (
              <Pause className="size-5 fill-current" aria-hidden />
            )}
          </button>

          <span className="text-numeric min-w-[4.5rem] shrink-0 text-xs whitespace-nowrap text-white/90 sm:min-w-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* Scrubber: shows buffered range, click to seek, drag to scrub. */}
          <div className="group relative h-5 min-w-0 flex-1 cursor-pointer">
            <div
              className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-sm bg-white/25"
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(currentTime)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  scrubTo((videoRef.current?.currentTime ?? 0) + 5);
                } else if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  scrubTo((videoRef.current?.currentTime ?? 0) - 5);
                }
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                scrubTo(pct * duration);
              }}
            >
              {/* Buffered */}
              <div
                className="absolute inset-y-0 left-0 bg-white/40"
                style={{ width: `${bufferedPct}%` }}
              />
              {/* Elapsed */}
              <div
                className="absolute inset-y-0 left-0 bg-primary"
                style={{ width: `${progressPct}%` }}
              />
              {/* Thumb */}
              <div
                className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-white ring-2 ring-primary"
                style={{ left: `calc(${progressPct}% - 0.375rem)` }}
                aria-hidden
              />
            </div>
          </div>

          {/* Secondary controls (speed, volume, captions) — stay on one row at
              sm+; collapse into an overflow menu below 400px so play/time/scrub/
              fullscreen always fit. */}
          <div className="flex shrink-0 items-center gap-1 max-sm:hidden">
            {/* Quality — HLS ladders render the menu; a single MP4 renders a
                static resolution chip instead of an empty control. */}
            {levels.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setQualityMenuOpen((open) => !open)}
                  aria-label="Video quality"
                  aria-expanded={qualityMenuOpen}
                  className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Settings2 className="size-4" aria-hidden />
                  {qualityLabel}
                </button>
                {qualityMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 bottom-full mb-1 min-w-24 rounded-md border-2 border-white/30 bg-black/90 p-1 shadow-lg"
                  >
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={quality === "auto"}
                      onClick={() => changeQuality("auto")}
                      className="flex w-full items-center justify-between rounded px-2 py-1 text-xs text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Auto
                      {quality === "auto" && <span className="text-link">●</span>}
                    </button>
                    {levels.map((l) => (
                      <button
                        key={l.index}
                        type="button"
                        role="menuitemradio"
                        aria-checked={quality === l.index}
                        onClick={() => changeQuality(l.index)}
                        className="flex w-full items-center justify-between rounded px-2 py-1 text-xs text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {l.height}p
                        {quality === l.index && <span className="text-link">●</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MP4 fallback — no HLS ladder, so show the source resolution as a
                static chip (only once loadedmetadata has reported a height). */}
            {levels.length === 0 && mp4Resolution && (
              <button
                type="button"
                disabled
                aria-label={`Video quality: ${mp4Resolution}`}
                className="inline-flex h-8 items-center rounded-md border-2 border-white/15 px-2 text-xs font-semibold text-white/60"
              >
                {mp4Resolution}
              </button>
            )}

            {/* Speed */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRateMenuOpen((open) => !open)}
                aria-label="Playback speed"
                aria-expanded={rateMenuOpen}
                className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Gauge className="size-4" aria-hidden />
                {rate}×
              </button>
              {rateMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 bottom-full mb-1 min-w-24 rounded-md border-2 border-white/30 bg-black/90 p-1 shadow-lg"
                >
                  {PLAYBACK_RATES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      role="menuitemradio"
                      aria-checked={rate === r}
                      onClick={() => {
                        setRate(r);
                        if (videoRef.current) videoRef.current.playbackRate = r;
                        setRateMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded px-2 py-1 text-xs text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {r}×
                      {rate === r && <span className="text-link">●</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Volume */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
                className="inline-flex size-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="size-5" aria-hidden />
                ) : (
                  <Volume2 className="size-5" aria-hidden />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => changeVolume(Number(e.target.value))}
                aria-label="Volume"
                className="h-1.5 w-16 cursor-pointer accent-primary"
              />
            </div>

            {/* Captions toggle — only if a track exists */}
            {hasCaptions && (
              <button
                type="button"
                onClick={toggleCaptions}
                aria-label="Toggle captions"
                aria-pressed={captionsOn}
                className="inline-flex size-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Captions className="size-5" aria-hidden />
              </button>
            )}
          </div>

          {/* Mobile overflow menu — everything collapsed below 400px */}
          <div className="relative shrink-0 sm:hidden">
            <button
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              aria-label="More options"
              aria-expanded={moreOpen}
              className="inline-flex size-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MoreHorizontal className="size-5" aria-hidden />
            </button>
            {moreOpen && (
              <div
                role="menu"
                className="absolute right-0 bottom-full mb-1 min-w-40 rounded-md border-2 border-white/30 bg-black/90 p-1 shadow-lg"
              >
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={muted ? "Unmute" : "Mute"}
                    className="inline-flex size-10 items-center justify-center rounded-md text-white hover:bg-white/15"
                  >
                    {muted || volume === 0 ? (
                      <VolumeX className="size-4" aria-hidden />
                    ) : (
                      <Volume2 className="size-4" aria-hidden />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={muted ? 0 : volume}
                    onChange={(e) => changeVolume(Number(e.target.value))}
                    aria-label="Volume"
                    className="h-1.5 flex-1 cursor-pointer accent-primary"
                  />
                </div>
                <div className="border-t border-white/15 py-1">
                  {PLAYBACK_RATES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      role="menuitemradio"
                      aria-checked={rate === r}
                      onClick={() => {
                        setRate(r);
                        if (videoRef.current) videoRef.current.playbackRate = r;
                      }}
                      className="flex w-full items-center justify-between rounded px-2 py-1 text-xs text-white hover:bg-white/15"
                    >
                      {r}×
                      {rate === r && <span className="text-link">●</span>}
                    </button>
                  ))}
                </div>
                {levels.length > 0 && (
                  <div className="border-t border-white/15 py-1">
                    {[
                      { key: "auto", label: "Auto", value: "auto" as const },
                      ...levels.map((l) => ({ key: `q-${l.index}`, label: `${l.height}p`, value: l.index as number })),
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        role="menuitemradio"
                        aria-checked={quality === opt.value}
                        onClick={() => changeQuality(opt.value)}
                        className="flex w-full items-center justify-between rounded px-2 py-1 text-xs text-white hover:bg-white/15"
                      >
                        {opt.label}
                        {quality === opt.value && <span className="text-link">●</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Fullscreen — promotes the wrapper (video + watermark). */}
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isFullscreen ? (
              <Minimize className="size-5" aria-hidden />
            ) : (
              <Maximize className="size-5" aria-hidden />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
