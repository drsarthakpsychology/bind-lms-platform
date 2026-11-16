"use client";

import * as React from "react";

import { primaryButton, quietButton } from "@/components/ds/parts";
import { cn } from "@/lib/utils";

/**
 * Camera QR reader. Uses the browser's own BarcodeDetector where it exists
 * (Chrome on Android, Edge) and falls back to a small bundled decoder (jsQR,
 * loaded only when needed) on Safari and Firefox. The camera starts on a tap,
 * never by itself, and stops when the page closes or a code is read.
 */

type Detect = (video: HTMLVideoElement, canvas: HTMLCanvasElement) => Promise<string | null>;

type BarcodeDetectorLike = { detect: (src: CanvasImageSource) => Promise<{ rawValue: string }[]> };
type BarcodeDetectorCtor = {
  new (opts: { formats: string[] }): BarcodeDetectorLike;
  getSupportedFormats?: () => Promise<string[]>;
};

/** Which reader this browser gets. */
export async function pickReader(win: { BarcodeDetector?: unknown } = globalThis as never): Promise<"native" | "fallback"> {
  const BD = win.BarcodeDetector as BarcodeDetectorCtor | undefined;
  if (!BD) return "fallback";
  try {
    const formats = BD.getSupportedFormats ? await BD.getSupportedFormats() : ["qr_code"];
    return formats.includes("qr_code") ? "native" : "fallback";
  } catch {
    return "fallback";
  }
}

async function makeDetect(kind: "native" | "fallback"): Promise<Detect> {
  if (kind === "native") {
    const BD = (globalThis as unknown as { BarcodeDetector: BarcodeDetectorCtor }).BarcodeDetector;
    const det = new BD({ formats: ["qr_code"] });
    return async (video) => {
      const found = await det.detect(video);
      return found[0]?.rawValue ?? null;
    };
  }
  const { default: jsQR } = await import("@/vendor/jsqr/jsqr");
  return async (video, canvas) => {
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return null;
    // Decode a centred square at most 640px wide: fast on older phones.
    const side = Math.min(w, h);
    const scale = Math.min(1, 640 / side);
    const out = Math.round(side * scale);
    canvas.width = out;
    canvas.height = out;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(video, (w - side) / 2, (h - side) / 2, side, side, 0, 0, out, out);
    const img = ctx.getImageData(0, 0, out, out);
    return jsQR(img.data, out, out, { inversionAttempts: "dontInvert" })?.data ?? null;
  };
}

type CamState = "off" | "starting" | "on" | "denied" | "none";

export function QrScanner({ onRead, busy = false, className }: { onRead: (raw: string) => void; busy?: boolean; className?: string }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const timerRef = React.useRef<number | null>(null);
  const busyRef = React.useRef(busy);
  const onReadRef = React.useRef(onRead);
  const [state, setState] = React.useState<CamState>("off");

  React.useEffect(() => {
    busyRef.current = busy;
    onReadRef.current = onRead;
  });

  const stop = React.useCallback(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  // Stop the camera when the page closes.
  React.useEffect(() => stop, [stop]);

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState("none");
      return;
    }
    setState("starting");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
    } catch (e) {
      setState((e as Error)?.name === "NotFoundError" ? "none" : "denied");
      return;
    }
    streamRef.current = stream;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      stop();
      return;
    }
    video.srcObject = stream;
    await video.play().catch(() => undefined);
    setState("on");
    const detect = await makeDetect(await pickReader());
    let last = "";
    const tick = async () => {
      if (!streamRef.current) return;
      if (!busyRef.current) {
        const raw = await detect(video, canvas).catch(() => null);
        // The same code read twice in a row is sent once.
        if (raw && raw !== last) {
          last = raw;
          onReadRef.current(raw);
        }
      }
      timerRef.current = window.setTimeout(tick, 250);
    };
    void tick();
  }

  function close() {
    stop();
    setState("off");
  }

  const on = state === "on" || state === "starting";
  return (
    <div className={cn("flex min-w-0 flex-col gap-3", className)}>
      <div className={cn("relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-[var(--ds-radius)] bg-foreground/90", !on && "hidden")}>
        <video ref={videoRef} muted playsInline aria-label="Camera" className="size-full object-cover" />
        {/* The aim square: where the code should sit. */}
        <span aria-hidden className="pointer-events-none absolute inset-[18%] rounded-lg border-2 border-white/90" />
        {busy ? <span className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2 text-center type-small font-semibold text-white">Checking</span> : null}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      {on ? (
        <button type="button" className={cn(quietButton, "self-center")} onClick={close}>
          Close camera
        </button>
      ) : (
        <button type="button" className={cn(primaryButton, "self-stretch sm:self-start")} onClick={start}>
          Open camera
        </button>
      )}
      {state === "denied" ? (
        <p role="alert" className="type-small text-status-alert-fg">
          The camera is blocked. Allow it in your browser settings, or type the code below.
        </p>
      ) : null}
      {state === "none" ? (
        <p role="alert" className="type-small text-status-alert-fg">
          No camera found. Type the code below.
        </p>
      ) : null}
    </div>
  );
}
