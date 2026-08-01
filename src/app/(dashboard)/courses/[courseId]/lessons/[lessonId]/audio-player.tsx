"use client";

import { useEffect, useRef, useState } from "react";
import { Gauge, Pause, Play, Volume2, VolumeX } from "lucide-react";

const AUDIO_RATES = [1, 1.25, 1.5, 0.75] as const;

/**
 * Inline audio player for lecture voiceovers, with playback speed.
 * Kept intentionally small (audio doesn't need the full video control set).
 */
export function AudioPlayer({ src, title }: { src: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [rate, setRate] = useState<(typeof AUDIO_RATES)[number]>(1);
  const [muted, setMuted] = useState(false);
  const [rateMenuOpen, setRateMenuOpen] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPaused(false);
    const onPause = () => setIsPaused(true);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  }

  return (
    <div className="flex items-center gap-3 rounded-md border-2 border-border bg-muted/40 px-3 py-2">
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />

      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPaused ? "Play" : "Pause"}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-border bg-primary text-primary-foreground transition-[transform,box-shadow] hover:bg-primary/90 active:translate-y-px"
      >
        {isPaused ? (
          <Play className="size-4 fill-current" aria-hidden />
        ) : (
          <Pause className="size-4 fill-current" aria-hidden />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <audio controls src={src} className="w-full" aria-label={title} />
      </div>

      {/* Speed */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setRateMenuOpen((open) => !open)}
          aria-label="Playback speed"
          aria-expanded={rateMenuOpen}
          className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
        >
          <Gauge className="size-4" aria-hidden />
          {rate}×
        </button>
        {rateMenuOpen && (
          <div
            role="menu"
            className="absolute right-0 bottom-full mb-1 min-w-20 rounded-md border-2 border-border bg-popover p-1 shadow-md"
          >
            {AUDIO_RATES.map((r) => (
              <button
                key={r}
                type="button"
                role="menuitemradio"
                aria-checked={rate === r}
                onClick={() => {
                  setRate(r);
                  if (audioRef.current) audioRef.current.playbackRate = r;
                  setRateMenuOpen(false);
                }}
                className="flex w-full items-center justify-between rounded px-2 py-1 text-xs text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
              >
                {r}×
                {rate === r && <span className="text-primary">●</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          if (audioRef.current) audioRef.current.muted = !muted;
          setMuted((m) => !m);
        }}
        aria-label={muted ? "Unmute" : "Mute"}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
      >
        {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
      </button>
    </div>
  );
}
