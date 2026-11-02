import * as React from "react";
import s from "./learn.module.css";

export type ChaiMood = "idle" | "happy" | "think" | "cheer" | "sad" | "sleep";

/*
 * Chai — VIBHA's study cat, drawn as 24×24 pixel art: a white cat with
 * aviator-style goggles (blue lenses, lime glint), a lime collar and a blue tag.
 * Goggles down = focused (idle, happy, think). Goggles pushed up = feelings
 * showing (cheer, sad, sleep). Original character; palette is the brand four.
 */

const C: Record<string, string> = { K: "#111111", W: "#ffffff", L: "#cdf24b", B: "#1d44d8" };

// Rows are 24 characters wide. "." is transparent.
const EARS = [
  "........................",
  "....K..............K....",
  "....KK............KK....",
  "....KLK..........KLK....",
  "....KLLKKKKKKKKKKLLK....",
  "...KWWWWWWWWWWWWWWWWK...",
  "..KWWWWWWWWWWWWWWWWWWK..",
];

// Goggles over the eyes (rows 7 to 11).
const GOGGLES_DOWN = [
  ".KKKKKKKKKKKKKKKKKKKKKK.",
  ".KKBBBBBKKKKKKKKBBBBBKK.",
  ".KKBLLBBKWWWWWWKBLLBBKK.",
  ".KKBBBBBKWWWWWWKBBBBBKK.",
  "..KKKKKKKWWWWWWKKKKKKK..",
];

// Goggles on the forehead, eyes visible (rows 5 to 11 replace the top of the face).
const GOGGLES_UP_TOP = [
  "..KKKKKKKKKKKKKKKKKKKK..",
  "..KBBLBKKKKKKKKKKBBLBK..",
  "..KKKKKKWWWWWWWWKKKKKK..",
];
const FACE_BLANK = "..KWWWWWWWWWWWWWWWWWWK..";

const NOSE_MOUTH = [
  "..KWWWWWWWWKKWWWWWWWWK..",
  "...KWWWWWWKWWKWWWWWWK...",
  "....KWWWWWWKKWWWWWWK....",
];
const GRIN = [
  "..KWWWWWWWWKKWWWWWWWWK..",
  "...KWWWWWKWWWWKWWWWWK...",
  "....KWWWWWKKKKWWWWWK....",
];

const BODY = [
  ".....KKLLLLLLLLLLKK.....",
  "....KWWWWWWBBWWWWWWK....",
  "...KWWWWWWWBBWWWWWWWK...",
  "...KWWWWWWWWWWWWWWWWK...",
  "..KWWWWWWWWWWWWWWWWWWK..",
  "..KWWWKWWWWWWWWWWKWWWK..",
  "..KWWWKWWWWWWWWWWKWWWK..",
  "...KKKKKKKKKKKKKKKKKK...",
];

/** Eye rows for the goggles-up face (rows 8 to 10). */
const EYES: Record<"cheer" | "sad" | "sleep", string[]> = {
  cheer: [FACE_BLANK, "..KWWWWKWWWWWWWWKWWWWK..", "..KWWWKWKWWWWWWKWKWWWK.."],
  sad: ["..KWWWWWWWWWWWWWWWWWWK..", "..KWWWKKKWWWWWWKKKWWWK..", "..KWWWWKBWWWWWWBKWWWWK.."],
  sleep: [FACE_BLANK, FACE_BLANK, "..KWWWKKKWWWWWWKKKWWWK.."],
};

function rowsFor(mood: ChaiMood): string[] {
  const up = mood === "cheer" || mood === "sad" || mood === "sleep";
  const mouth = mood === "happy" || mood === "cheer" ? GRIN : NOSE_MOUTH;
  if (!up) return [...EARS, ...GOGGLES_DOWN, ...mouth, ...BODY].slice(0, 24);
  const eyes = EYES[mood as "cheer" | "sad" | "sleep"];
  return [...EARS.slice(0, 5), ...GOGGLES_UP_TOP, ...eyes, FACE_BLANK, ...mouth, ...BODY].slice(0, 24);
}

/** Merge horizontal runs of one colour into single rects (fewer DOM nodes). */
function Pixels({ rows, dx = 0, dy = 0 }: { rows: string[]; dx?: number; dy?: number }) {
  const out: React.ReactNode[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === "." || !C[ch]) {
        x++;
        continue;
      }
      let w = 1;
      while (row[x + w] === ch) w++;
      out.push(<rect key={`${x}-${y}`} x={x + dx} y={y + dy} width={w} height={1} fill={C[ch]} />);
      x += w;
    }
  });
  return <>{out}</>;
}

const TAIL = ["....K", "...KK", "..KWK", "..KWK", ".KWK.", "KWK..", "KK..."];
const SPARKLE = [".L.", "LLL", ".L."];
const QUESTION = ["KKK.", "...K", ".KK.", ".K..", "....", ".K.."];
const ZED = ["KKK", "..K", ".K.", "K..", "KKK"];

export function Chai({ mood = "idle", size = 96, className }: { mood?: ChaiMood; size?: number; className?: string }) {
  const rows = rowsFor(mood);
  const down = !(mood === "cheer" || mood === "sad" || mood === "sleep");
  return (
    <span className={`${s.chai} ${className ?? ""}`} data-mood={mood} style={{ width: size, height: size }} aria-hidden>
      <svg viewBox="-2 -2 30 28" width={size} height={size} shapeRendering="crispEdges" style={{ imageRendering: "pixelated" }}>
        <g className={s.tail}>
          <Pixels rows={TAIL} dx={20} dy={15} />
        </g>
        <Pixels rows={rows} />
        {down ? (
          // Lens glint that twinkles now and then.
          <g className={s.lids}>
            <rect x={4} y={8} width={1} height={1} fill={C.W} />
            <rect x={17} y={8} width={1} height={1} fill={C.W} />
          </g>
        ) : null}
        {mood === "cheer" ? (
          <g className={s.sparkle}>
            <Pixels rows={SPARKLE} dx={-2} dy={2} />
            <Pixels rows={SPARKLE} dx={23} dy={0} />
          </g>
        ) : null}
        {mood === "think" ? <Pixels rows={QUESTION} dx={22} dy={-2} /> : null}
        {mood === "sleep" ? (
          <g className={s.zzz}>
            <Pixels rows={ZED} dx={23} dy={-1} />
          </g>
        ) : null}
      </svg>
    </span>
  );
}

/** Chai with a speech bubble. */
export function ChaiSays({ mood, children, size = 72 }: { mood?: ChaiMood; children: React.ReactNode; size?: number }) {
  return (
    <div className="flex items-start gap-3">
      <Chai mood={mood} size={size} className="shrink-0" />
      <p
        key={String(children)}
        className={`${s.bubble} mt-2 rounded-2xl border-2 border-foreground bg-card px-4 py-2.5 text-sm font-medium leading-snug text-foreground hard-shadow-sm`}
      >
        {children}
      </p>
    </div>
  );
}
