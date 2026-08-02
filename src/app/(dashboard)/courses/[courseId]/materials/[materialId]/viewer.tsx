"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import { init as initPptxPreview } from "pptx-preview";

// pdf.js worker — pinned to the installed version. Loaded from the same bundle,
// never from a CDN.
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

import { MaterialWatermark } from "./material-watermark";

const AUDIO_RATES = [1, 1.25, 1.5, 2, 0.75] as const;

/**
 * Full-screen material viewer. One instance per type.
 *
 * - PDF: rendered to CANVAS page-by-page via pdf.js — no iframe/embed/object,
 *   so there's no browser-native download or print affordance. Page nav, page
 *   count, zoom, continuous scroll, remembered scroll position.
 * - Audio: play/pause, scrub, speed (0.75–2×), persistent title.
 * - Image: fit to screen, tap/click to zoom, pinch on touch.
 * - Slides/link: handled by the caller or an honest fallback.
 *
 * Every file is fetched through a per-request signed URL (enrolment checked),
 * never a stable path.
 */
export function MaterialViewer({
  materialId,
  courseId,
  kind,
  url,
  title,
  watermarkLabel,
}: {
  materialId: string;
  courseId: string;
  kind: "document" | "slides" | "audio" | "image" | "link";
  url?: string | null;
  title: string;
  watermarkLabel: string;
}) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadKey, setLoadKey] = useState(0);

  // Materials proxy-stream through the authenticated route (same transport as
  // video). The viewer points directly at the proxy URL — enrolment is
  // re-checked on every request, and no storage URL ever reaches the client.
  useEffect(() => {
    let cancelled = false;
    // HEAD to verify access + get the stream URL. pdf.js/audio/img fetch the
    // same URL, which streams Range-capable bytes.
    (async () => {
      try {
        const proxyUrl = `/api/media/materials/${materialId}`;
        const res = await fetch(proxyUrl, { method: "HEAD" });
        if (!res.ok) {
          if (!cancelled) setError("Couldn't open this material.");
          return;
        }
        if (!cancelled) setSignedUrl(proxyUrl);
      } catch (e) {
        console.error("material load failed:", e);
        if (!cancelled) setError("Couldn't open this material.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [materialId, loadKey]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="max-w-md space-y-4 rounded-md border-2 border-border bg-card p-6 text-center">
          <div>
            <p className="text-small font-semibold text-foreground">Couldn&apos;t open this material</p>
            <p className="mt-1 text-caption text-muted-foreground">
              Couldn&apos;t load this file. Retry, or tell your instructor if it keeps failing.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setSignedUrl(null);
                setLoadKey((k) => k + 1);
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border-2 border-foreground bg-primary px-4 text-sm font-medium text-primary-foreground transition-[transform,box-shadow] hover:bg-primary/90 active:translate-y-0.5"
            >
              <RotateCcw className="size-4" aria-hidden />
              Retry
            </button>
            <a
              href={courseId ? `/courses/${courseId}` : "#"}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border-2 border-border bg-background px-4 text-sm font-medium text-foreground transition-[transform,box-shadow] hover:bg-accent active:translate-y-px"
            >
              Back to course
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!signedUrl && kind !== "link") {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  switch (kind) {
    case "document":
      return <PdfViewer signedUrl={signedUrl!} materialId={materialId} watermarkLabel={watermarkLabel} />;
    case "audio":
      return <AudioViewer signedUrl={signedUrl!} title={title} watermarkLabel={watermarkLabel} />;
    case "image":
      return <ImageViewer signedUrl={signedUrl!} title={title} watermarkLabel={watermarkLabel} />;
    case "slides":
      return <SlidesViewer signedUrl={signedUrl!} title={title} watermarkLabel={watermarkLabel} />;
    case "link":
      return (
        <div className="flex h-full items-center justify-center p-8">
          <div className="max-w-md rounded-md border-2 border-border bg-card p-6 text-center">
            <p className="text-small font-semibold text-foreground">{title}</p>
            <a
              href={url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 rounded-md border-2 border-border bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
            >
              Open link
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </div>
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/* PDF — canvas rendering, page-by-page, no iframe                    */
/* ------------------------------------------------------------------ */
function PdfViewer({ signedUrl, materialId, watermarkLabel }: { signedUrl: string; materialId: string; watermarkLabel: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rendering, setRendering] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load the PDF once.
  useEffect(() => {
    let cancelled = false;
    getDocument({ url: signedUrl }).promise
      .then((d) => {
        if (cancelled) return;
        setDoc(d);
        setPageCount(d.numPages);
        // Restore scroll position if it was saved.
        const saved = sessionStorage.getItem(`pdf-scroll-${materialId}`);
        if (saved && containerRef.current) {
          containerRef.current.scrollTop = Number(saved);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError("This PDF couldn't be read.");
      });
    return () => {
      cancelled = true;
    };
  }, [signedUrl, materialId]);

  // Render the current page to canvas whenever pageNum/zoom changes.
  useEffect(() => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (!doc || !canvas) return;
    let cancelled = false;
    setRendering(true);
    doc.getPage(pageNum).then((page) => {
      if (cancelled) return;
      const base = 1.5 * zoom;
      const viewport = page.getViewport({ scale: base });
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      page.render({ canvasContext: ctx, viewport, canvas }).promise
        .then(() => {
          if (!cancelled) setRendering(false);
        })
        .catch(() => {
          if (!cancelled) {
            setRendering(false);
            setLoadError("Couldn't render this page.");
          }
        });
    });
    return () => {
      cancelled = true;
    };
  }, [doc, pageNum, zoom]);

  // Save scroll position on unload / page change.
  const saveScroll = useCallback(() => {
    if (containerRef.current) {
      sessionStorage.setItem(`pdf-scroll-${materialId}`, String(containerRef.current.scrollTop));
    }
  }, [materialId]);

  useEffect(() => {
    return () => saveScroll();
  }, [saveScroll]);

  if (loadError) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-small text-status-alert-fg">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      <MaterialWatermark label={watermarkLabel} />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 border-b-2 border-border bg-card px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPageNum((p) => Math.max(1, p - 1))}
            disabled={pageNum <= 1 || !doc}
            aria-label="Previous page"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border-2 border-border bg-background text-foreground transition-[transform,box-shadow] hover:bg-accent active:translate-y-px disabled:opacity-40"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <span className="px-2 text-caption text-muted-foreground">
            {pageCount ? `${pageNum} / ${pageCount}` : "Loading…"}
          </span>
          <button
            type="button"
            onClick={() => setPageNum((p) => Math.min(pageCount || 1, p + 1))}
            disabled={!doc || pageNum >= (pageCount || 1)}
            aria-label="Next page"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border-2 border-border bg-background text-foreground transition-[transform,box-shadow] hover:bg-accent active:translate-y-px disabled:opacity-40"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            aria-label="Zoom out"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border-2 border-border bg-background text-foreground transition-[transform,box-shadow] hover:bg-accent active:translate-y-px"
          >
            <ZoomOut className="size-4" aria-hidden />
          </button>
          <span className="w-10 text-center text-caption text-muted-foreground">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
            aria-label="Zoom in"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border-2 border-border bg-background text-foreground transition-[transform,box-shadow] hover:bg-accent active:translate-y-px"
          >
            <ZoomIn className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* Scrollable canvas page */}
      <div
        ref={containerRef}
        className="min-h-0 flex-1 overflow-y-auto bg-muted/30"
        onScroll={saveScroll}
      >
        <div className="mx-auto flex w-fit flex-col items-center gap-4 p-4">
          <canvas className="rounded-md border-2 border-border bg-white shadow-sm" />
          {rendering && <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden />}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Slides — in-browser PPTX render (pptx-preview), no download         */
/* ------------------------------------------------------------------ */
function SlidesViewer({ signedUrl, title, watermarkLabel }: { signedUrl: string; title: string; watermarkLabel: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewerRef = useRef<ReturnType<typeof initPptxPreview> | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [slideCount, setSlideCount] = useState(0);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;

    (async () => {
      try {
        // Fetch the deck through the authenticated proxy — the same
        // download-blocked transport as video/PDF. The ArrayBuffer is what the
        // renderer needs to draw slides; it never reaches a download path.
        const res = await fetch(signedUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();

        if (cancelled) return;
        const previewer = initPptxPreview(el, { mode: "slide", width: 960, height: 540 });
        previewerRef.current = previewer;
        await previewer.preview(buf);
        if (cancelled) return;
        setSlideCount(previewer.slideCount || 1);
        setCurrent(1);
        setState("ready");
      } catch (e) {
        console.error("slides render failed:", e);
        if (!cancelled) {
          setError("This slide deck couldn't be rendered.");
          setState("error");
        }
      }
    })();

    return () => {
      cancelled = true;
      previewerRef.current?.destroy();
      previewerRef.current = null;
    };
  }, [signedUrl]);

  const go = (dir: 1 | -1) => {
    const next = current + dir;
    if (next < 1 || next > slideCount) return;
    if (dir === 1) previewerRef.current?.renderNextSlide();
    else previewerRef.current?.renderPreSlide();
    setCurrent(next);
  };

  if (state === "error") {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="max-w-md rounded-md border-2 border-border bg-card p-6 text-center">
          <p className="text-small font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-caption text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      <MaterialWatermark label={watermarkLabel} />
      <div className="flex items-center justify-between gap-2 border-b-2 border-border bg-card px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={current <= 1}
            aria-label="Previous slide"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border-2 border-border bg-background text-foreground transition-[transform,box-shadow] hover:bg-accent active:translate-y-px disabled:opacity-40"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <span className="px-2 text-caption text-muted-foreground">
            {state === "ready" ? `${current} / ${slideCount}` : "Loading…"}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={current >= slideCount || state !== "ready"}
            aria-label="Next slide"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border-2 border-border bg-background text-foreground transition-[transform,box-shadow] hover:bg-accent active:translate-y-px disabled:opacity-40"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto bg-muted/30">
        <div ref={containerRef} className="mx-auto w-fit p-4" />
        {state === "loading" && (
          <div className="flex justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden />
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Audio — play/pause, scrub, speed, persistent title                 */
/* ------------------------------------------------------------------ */
function AudioViewer({ signedUrl, title, watermarkLabel }: { signedUrl: string; title: string; watermarkLabel: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [rate, setRate] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rateOpen, setRateOpen] = useState(false);

  function fmt(s: number) {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  }

  return (
    <div className="relative flex h-full flex-col">
      <MaterialWatermark label={watermarkLabel} />
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-xl space-y-4 rounded-md border-2 border-border bg-card p-5">
          <audio
            ref={audioRef}
            src={signedUrl}
            onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onPlay={() => setIsPaused(false)}
            onPause={() => setIsPaused(true)}
            className="hidden"
          />
          <p className="truncate text-small font-semibold text-foreground">{title}</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const a = audioRef.current;
                if (!a) return;
                if (a.paused) void a.play();
                else a.pause();
              }}
              aria-label={isPaused ? "Play" : "Pause"}
              className="inline-flex size-11 items-center justify-center rounded-md border-2 border-foreground bg-primary text-primary-foreground transition-[transform,box-shadow] hover:bg-primary/90 active:translate-y-0.5"
            >
              {isPaused ? <Play className="size-5 fill-current" aria-hidden /> : <Pause className="size-5 fill-current" aria-hidden />}
            </button>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={progress}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (audioRef.current) audioRef.current.currentTime = v;
                setProgress(v);
              }}
              aria-label="Seek"
              className="h-1.5 flex-1 cursor-pointer accent-primary"
            />
            <span className="text-numeric text-caption text-muted-foreground">
              {fmt(progress)} / {fmt(duration)}
            </span>
          </div>
          <div className="relative flex justify-end">
            <button
              type="button"
              onClick={() => setRateOpen((o) => !o)}
              aria-label="Playback speed"
              className="inline-flex h-8 items-center gap-1 rounded-md border-2 border-border bg-background px-2.5 text-xs font-semibold text-foreground hover:bg-accent"
            >
              {rate}×
            </button>
            {rateOpen && (
              <div className="absolute right-0 bottom-full mb-1 min-w-20 rounded-md border-2 border-border bg-popover p-1 shadow-md">
                {AUDIO_RATES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRate(r);
                      if (audioRef.current) audioRef.current.playbackRate = r;
                      setRateOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded px-2 py-1 text-xs text-foreground hover:bg-accent"
                  >
                    {r}×
                    {rate === r && <span className="text-primary">●</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Image — fit to screen, tap/click to zoom, pinch on touch            */
/* ------------------------------------------------------------------ */
function ImageViewer({ signedUrl, title, watermarkLabel }: { signedUrl: string; title: string; watermarkLabel: string }) {
  const [zoom, setZoom] = useState(1);
  const basePinch = useRef<number | null>(null);

  return (
    <div className="relative flex h-full flex-col">
      <MaterialWatermark label={watermarkLabel} />
      <div className="flex flex-1 items-center justify-center overflow-hidden bg-muted/30 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- signed per-request URL */}
        <img
          src={signedUrl}
          alt={title}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onClick={() => setZoom((z) => (z === 1 ? 2 : 1))}
          onTouchStart={(e) => {
            if (e.touches.length === 2) {
              basePinch.current = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY,
              );
            }
          }}
          onTouchMove={(e) => {
            if (e.touches.length === 2 && basePinch.current) {
              const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY,
              );
              setZoom(Math.min(4, Math.max(1, (dist / basePinch.current) * 2)));
            }
          }}
          onTouchEnd={() => (basePinch.current = null)}
          className="max-h-full max-w-full object-contain transition-transform"
          style={{ transform: `scale(${zoom})`, cursor: zoom > 1 ? "zoom-out" : "zoom-in" }}
        />
      </div>
      <div className="flex items-center justify-center gap-2 border-t-2 border-border bg-card px-3 py-2">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
          aria-label="Zoom out"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border-2 border-border bg-background text-foreground hover:bg-accent"
        >
          <Minus className="size-3.5" aria-hidden />
        </button>
        <span className="text-caption text-muted-foreground">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(4, z + 0.5))}
          aria-label="Zoom in"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border-2 border-border bg-background text-foreground hover:bg-accent"
        >
          <Plus className="size-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
