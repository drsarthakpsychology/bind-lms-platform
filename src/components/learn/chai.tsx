import * as React from "react";
import s from "./learn.module.css";

export type ChaiMood = "idle" | "happy" | "think" | "cheer" | "sad" | "sleep";

/**
 * Chai — VIBHA's study cat. An original, meme-style "cat loaf": round white
 * body, huge glossy eyes, a tiny ω mouth, a blue collar with a lime bell.
 * - idle: big shiny eyes, blinks
 * - happy: ^ ^ eyes and blush
 * - cheer: sparkly star eyes, paws up
 * - sad: the teary, wobbly-eyed look (for wrong answers)
 * - think: eyes up, little question mark
 * - sleep: loaf mode, zzz
 */
export function Chai({ mood = "idle", size = 96, className }: { mood?: ChaiMood; size?: number; className?: string }) {
  // Fixed ink so the white cat keeps its outline in dark mode too.
  const ink = "#111111";
  const fur = "#ffffff";
  const L = 46;
  const R = 74;
  const Y = 64;

  const eyes = (() => {
    switch (mood) {
      case "happy":
        return (
          <>
            <path d={`M${L - 8} ${Y + 2} q8 -10 16 0`} fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
            <path d={`M${R - 8} ${Y + 2} q8 -10 16 0`} fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
          </>
        );
      case "sleep":
        return (
          <>
            <path d={`M${L - 8} ${Y} q8 7 16 0`} fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
            <path d={`M${R - 8} ${Y} q8 7 16 0`} fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
          </>
        );
      case "cheer":
        return (
          <>
            {[L, R].map((x) => (
              <g key={x}>
                <circle cx={x} cy={Y} r="11" fill={ink} />
                <path d={`M${x} ${Y - 8} l2.6 5.4 l5.8 .8 l-4.2 4 l1 5.8 l-5.2 -2.8 l-5.2 2.8 l1 -5.8 l-4.2 -4 l5.8 -.8 z`} fill="var(--primary)" />
              </g>
            ))}
          </>
        );
      case "sad":
        return (
          <>
            {[L, R].map((x) => (
              <g key={x}>
                <ellipse cx={x} cy={Y + 1} rx="12" ry="13" fill={ink} />
                <circle cx={x - 4} cy={Y - 4} r="4.5" fill={fur} />
                <circle cx={x + 4} cy={Y + 5} r="2.2" fill={fur} />
                <path d={`M${x - 11} ${Y + 6} q11 9 22 0`} fill="none" stroke="var(--brand)" strokeWidth="2.5" opacity="0.9" />
              </g>
            ))}
            <path d={`M${L - 4} ${Y + 15} q-3 8 0 12 q3 -4 0 -12z`} fill="var(--brand)" />
            <path d={`M${R + 4} ${Y + 15} q-3 8 0 12 q3 -4 0 -12z`} fill="var(--brand)" />
          </>
        );
      case "think":
        return (
          <>
            {[L, R].map((x) => (
              <g key={x}>
                <circle cx={x} cy={Y} r="10" fill={ink} />
                <circle cx={x + 3} cy={Y - 5} r="3.6" fill={fur} />
              </g>
            ))}
          </>
        );
      default:
        return (
          <>
            {[L, R].map((x) => (
              <g key={x}>
                <circle cx={x} cy={Y} r="10.5" fill={ink} />
                <circle cx={x - 3.5} cy={Y - 4} r="3.8" fill={fur} />
                <circle cx={x + 3.5} cy={Y + 3.5} r="1.8" fill={fur} />
              </g>
            ))}
            <g className={s.lids}>
              <rect x={L - 12} y={Y - 12} width="24" height="24" rx="12" fill={fur} />
              <rect x={R - 12} y={Y - 12} width="24" height="24" rx="12" fill={fur} />
              <path d={`M${L - 9} ${Y} h18 M${R - 9} ${Y} h18`} stroke={ink} strokeWidth="3" strokeLinecap="round" />
            </g>
          </>
        );
    }
  })();

  const mouth =
    mood === "cheer" ? (
      <path d="M53 80 q7 12 14 0 z" fill={ink} />
    ) : mood === "sad" ? (
      <path d="M53 84 q3.5 -4 7 0 q3.5 -4 7 0" fill="none" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
    ) : (
      <path d="M53 79 q3.5 4.5 7 0 q3.5 4.5 7 0" fill="none" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
    );

  const pawsUp = mood === "cheer";

  return (
    <span className={`${s.chai} ${className ?? ""}`} data-mood={mood} style={{ width: size, height: size * 1.05 }} aria-hidden>
      <svg viewBox="0 0 120 126" width={size} height={size * 1.05}>
        {/* tail curling round the loaf */}
        <path className={s.tail} d="M92 112 q22 -2 20 -22 q-1 -8 -7 -7 q-5 1 -3 8 q2 10 -12 12" fill={fur} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        {/* loaf body */}
        <path d="M18 122 q-4 -40 42 -42 q46 2 42 42 z" fill={fur} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        {/* tummy patch */}
        <path d="M44 122 q-2 -22 16 -24 q18 2 16 24 z" fill="var(--primary)" opacity="0.35" />
        {/* paws */}
        {pawsUp ? (
          <>
            <ellipse cx="22" cy="78" rx="9" ry="8" fill={fur} stroke={ink} strokeWidth="3" />
            <ellipse cx="98" cy="78" rx="9" ry="8" fill={fur} stroke={ink} strokeWidth="3" />
          </>
        ) : (
          <>
            <ellipse cx="44" cy="120" rx="10" ry="6" fill={fur} stroke={ink} strokeWidth="3" />
            <ellipse cx="76" cy="120" rx="10" ry="6" fill={fur} stroke={ink} strokeWidth="3" />
          </>
        )}
        {/* ears */}
        <path d="M24 46 Q22 14 32 10 Q44 18 50 30 Z" fill={fur} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <path d="M96 46 Q98 14 88 10 Q76 18 70 30 Z" fill={fur} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <path d="M31 36 Q31 20 35 18 Q41 23 43 30 Z" fill="var(--primary)" />
        <path d="M89 36 Q89 20 85 18 Q79 23 77 30 Z" fill="var(--primary)" />
        {/* big round head */}
        <ellipse cx="60" cy="62" rx="42" ry="35" fill={fur} stroke={ink} strokeWidth="3" />
        {/* forehead stripes */}
        <path d="M54 30 l2 7 M60 28 v8 M66 30 l-2 7" stroke={ink} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
        {eyes}
        {/* blush */}
        {mood !== "sad" ? (
          <>
            <ellipse cx="32" cy="77" rx="7" ry="4" fill="var(--primary)" opacity="0.75" />
            <ellipse cx="88" cy="77" rx="7" ry="4" fill="var(--primary)" opacity="0.75" />
          </>
        ) : null}
        {/* nose + mouth + whiskers */}
        <path d="M57 73 h6 l-3 3.5 z" fill={ink} />
        {mouth}
        <path d="M14 70 l14 3 M14 78 l14 -1 M106 70 l-14 3 M106 78 l-14 -1" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        {/* collar + bell */}
        <path d="M30 92 q30 12 60 0" fill="none" stroke="var(--brand)" strokeWidth="6" strokeLinecap="round" />
        <circle cx="60" cy="100" r="5" fill="var(--primary)" stroke={ink} strokeWidth="2.5" />
        {mood === "think" ? <text x="98" y="22" fontSize="22" fontWeight="900" fill="var(--brand)">?</text> : null}
        {mood === "sleep" ? <text x="92" y="24" fontSize="15" fontWeight="900" fill="var(--brand)">z z</text> : null}
        {mood === "cheer" ? (
          <>
            <path d="M8 18 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z" fill="var(--brand)" />
            <path d="M108 6 l2.5 5 l5 2.5 l-5 2.5 l-2.5 5 l-2.5 -5 l-5 -2.5 l5 -2.5 z" fill="var(--brand)" />
          </>
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
        className={`${s.bubble} mt-2 rounded-2xl border-2 border-foreground bg-card px-4 py-2.5 text-sm font-semibold text-foreground hard-shadow-sm`}
      >
        {children}
      </p>
    </div>
  );
}
