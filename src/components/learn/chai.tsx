import * as React from "react";
import s from "./learn.module.css";

export type ChaiMood = "idle" | "happy" | "think" | "cheer" | "sad" | "sleep";

/**
 * Chai — VIBHA's study cat. An original character: a round lime cat with an
 * ink outline, big round glasses and a blue scarf. Moods change the eyes,
 * mouth and body motion so feedback reads at a glance.
 */
export function Chai({ mood = "idle", size = 96, className }: { mood?: ChaiMood; size?: number; className?: string }) {
  const ink = "var(--foreground)";
  const eyes =
    mood === "happy" || mood === "cheer" ? (
      <>
        <path d="M42 62 q6 -7 12 0" fill="none" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M66 62 q6 -7 12 0" fill="none" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
      </>
    ) : mood === "sleep" ? (
      <>
        <path d="M42 62 q6 5 12 0" fill="none" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M66 62 q6 5 12 0" fill="none" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx={mood === "think" ? 50 : 48} cy={mood === "think" ? 58 : 62} r="4.5" fill={ink} />
        <circle cx={mood === "think" ? 74 : 72} cy={mood === "think" ? 58 : 62} r="4.5" fill={ink} />
        <g className={s.lids}>
          <rect x="40" y="55" width="16" height="14" rx="7" fill="var(--primary)" />
          <rect x="64" y="55" width="16" height="14" rx="7" fill="var(--primary)" />
        </g>
      </>
    );
  const mouth =
    mood === "cheer" ? (
      <path d="M52 76 q8 12 16 0 z" fill={ink} />
    ) : mood === "happy" ? (
      <path d="M52 76 q8 8 16 0" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
    ) : mood === "sad" ? (
      <path d="M53 81 q7 -6 14 0" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
    ) : mood === "think" ? (
      <path d="M55 79 h10" stroke={ink} strokeWidth="3" strokeLinecap="round" />
    ) : (
      <path d="M53 76 q3.5 4 7 0 q3.5 4 7 0" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
    );

  return (
    <span className={`${s.chai} ${className ?? ""}`} data-mood={mood} style={{ width: size, height: size * 1.1 }} aria-hidden>
      <svg viewBox="0 0 120 132" width={size} height={size * 1.1}>
        {/* tail */}
        <path className={s.tail} d="M84 112 q26 -6 22 -34 q-2 -8 -8 -6 q-6 2 -2 10 q4 14 -14 20" fill="var(--primary)" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        {/* body */}
        <path d="M30 128 q-6 -34 30 -40 q36 6 30 40 z" fill="var(--primary)" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        {/* scarf */}
        <path d="M34 92 q26 12 52 0 l-2 9 q-24 10 -48 0 z" fill="var(--brand)" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <path d="M74 98 l6 18 l-9 -2 z" fill="var(--brand)" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        {/* ears */}
        <path d="M26 46 L30 12 L52 32 Z" fill="var(--primary)" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <path d="M94 46 L90 12 L68 32 Z" fill="var(--primary)" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <path d="M32 36 L33 22 L42 31 Z" fill={ink} opacity="0.85" />
        <path d="M88 36 L87 22 L78 31 Z" fill={ink} opacity="0.85" />
        {/* head */}
        <ellipse cx="60" cy="60" rx="38" ry="33" fill="var(--primary)" stroke={ink} strokeWidth="3" />
        {/* glasses */}
        <circle cx="48" cy="62" r="11" fill="none" stroke={ink} strokeWidth="3" />
        <circle cx="72" cy="62" r="11" fill="none" stroke={ink} strokeWidth="3" />
        <path d="M59 62 h2" stroke={ink} strokeWidth="3" />
        {eyes}
        {/* nose + whiskers */}
        <path d="M57 71 h6 l-3 3 z" fill={ink} />
        <path d="M22 70 h14 M22 76 l14 -2 M98 70 h-14 M98 76 l-14 -2" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        {mouth}
        {mood === "think" ? <text x="94" y="26" fontSize="22" fontWeight="900" fill="var(--brand)">?</text> : null}
        {mood === "sleep" ? <text x="90" y="28" fontSize="16" fontWeight="900" fill="var(--brand)">z z</text> : null}
        {mood === "cheer" ? (
          <>
            <path d="M12 20 l4 8 l8 4 l-8 4 l-4 8 l-4 -8 l-8 -4 l8 -4 z" fill="var(--brand)" />
            <path d="M104 4 l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3 l6 -3 z" fill="var(--brand)" />
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
