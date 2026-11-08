"use client";

import * as React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Optional sound effects for the scenes. Off by default, one switch for all
 * scenes (remembered on this device), and a sound only ever plays in answer
 * to something the student just did: nothing plays on its own. Sounds are
 * made on the fly with the Web Audio API, so there is nothing to download.
 */

const KEY = "vibha-scene-sound";
let on: boolean | null = null;
const subs = new Set<() => void>();
let ctx: AudioContext | null = null;

function read() {
  if (on === null) {
    try {
      on = window.localStorage.getItem(KEY) === "1";
    } catch {
      on = false;
    }
  }
  return on;
}

export function setSound(next: boolean) {
  on = next;
  try {
    window.localStorage.setItem(KEY, next ? "1" : "0");
  } catch {
    /* private mode: the switch still works for this visit */
  }
  subs.forEach((f) => f());
  if (next) sfx("good");
}

export function useSound() {
  return React.useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    read,
    () => false,
  );
}

export type Sfx = "tap" | "pulse" | "good" | "bad" | "zap" | "whoosh";

function tone(c: AudioContext, t: number, freq: number, to: number, dur: number, type: OscillatorType, vol: number) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(c: AudioContext, t: number, dur: number, from: number, to: number, vol: number) {
  const n = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, n, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource();
  s.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 1.2;
  f.frequency.setValueAtTime(from, t);
  f.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.3);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(c.destination);
  s.start(t);
}

/** Play a short effect, if sound is switched on. Call only from a student's action. */
export function sfx(kind: Sfx) {
  if (typeof window === "undefined" || !read()) return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === "suspended") void ctx.resume();
    const t = ctx.currentTime + 0.01;
    if (kind === "tap") tone(ctx, t, 720, 980, 0.07, "sine", 0.07);
    else if (kind === "pulse") tone(ctx, t, 420, 300, 0.16, "triangle", 0.07);
    else if (kind === "good") {
      tone(ctx, t, 660, 660, 0.12, "sine", 0.07);
      tone(ctx, t + 0.09, 990, 990, 0.18, "sine", 0.07);
    } else if (kind === "bad") tone(ctx, t, 220, 150, 0.22, "triangle", 0.07);
    else if (kind === "zap") {
      tone(ctx, t, 1400, 180, 0.12, "square", 0.025);
      noise(ctx, t, 0.12, 3000, 800, 0.05);
    } else noise(ctx, t, 0.35, 400, 2400, 0.06);
  } catch {
    /* audio is a nicety; never let it break a scene */
  }
}

/** The switch shown on each scene card. */
export function SoundToggle() {
  const isOn = useSound();
  return (
    <button
      type="button"
      aria-pressed={isOn}
      onClick={() => setSound(!isOn)}
      className={cn("inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 border-foreground px-2.5 text-sm font-semibold", isOn ? "bg-foreground text-background" : "bg-card")}
    >
      {isOn ? <Volume2 className="size-4" aria-hidden /> : <VolumeX className="size-4" aria-hidden />}
      {isOn ? "Sound on" : "Sound off"}
    </button>
  );
}
