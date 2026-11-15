"use client";

import * as React from "react";
import { C, E, P } from "@/components/sketch/ink";
import { cn } from "@/lib/utils";
import s from "./learn.module.css";

export type ChaiMood = "idle" | "happy" | "think" | "cheer" | "sad" | "sleep";

/*
 * Chai: VIBHA's study cat, drawn in the same hand-drawn ink as the study
 * diagrams (src/components/sketch): a white cat sitting up, flying goggles
 * pushed up on the forehead (blue lenses), a lime collar with a blue tag.
 * The face carries the mood. Colours come from the sketch palette, so the
 * drawing reads in light and dark mode.
 */

/** Eyes, brows and mouth for each mood, in the 120 x 120 drawing. */
function Face({ mood }: { mood: ChaiMood }) {
  const eye = (k: string, cx: number, cy: number) => <E k={k} cx={cx} cy={cy} w={6} h={7.5} sw={1.2} fill={C.ink} fillStyle="solid" single rough={0.4} />;
  switch (mood) {
    case "happy":
    case "cheer":
      return (
        <>
          <P k={`${mood}-el`} d="M44 56 Q48.5 50 53 56" sw={2.4} single rough={0.4} />
          <P k={`${mood}-er`} d="M67 56 Q71.5 50 76 56" sw={2.4} single rough={0.4} />
          {mood === "cheer" ? (
            <P k="cheer-m" d="M54 65 Q60 74 66 65 Z" sw={2} fill={C.red} fillStyle="solid" single rough={0.4} />
          ) : (
            <P k="happy-m" d="M60 64 Q56.5 69 52.5 66 M60 64 Q63.5 69 67.5 66" sw={2} single rough={0.4} />
          )}
        </>
      );
    case "think":
      return (
        <>
          {eye("think-el", 50, 52)}
          {eye("think-er", 72, 52)}
          <P k="think-b" d="M66 44 Q71 41 77 44" sw={1.8} single rough={0.4} />
          <P k="think-m" d="M55 67 Q60 66 65 68" sw={2} single rough={0.4} />
        </>
      );
    case "sad":
      return (
        <>
          {eye("sad-el", 48, 57)}
          {eye("sad-er", 72, 57)}
          <P k="sad-bl" d="M43 50 Q47 47 53 48" sw={1.8} single rough={0.4} />
          <P k="sad-br" d="M67 48 Q73 47 77 50" sw={1.8} single rough={0.4} />
          <P k="sad-m" d="M54 69 Q60 64 66 69" sw={2} single rough={0.4} />
        </>
      );
    case "sleep":
      return (
        <>
          <P k="sleep-el" d="M44 54 Q48.5 59 53 54" sw={2.4} single rough={0.4} />
          <P k="sleep-er" d="M67 54 Q71.5 59 76 54" sw={2.4} single rough={0.4} />
          <P k="sleep-m" d="M57 67 Q60 69 63 67" sw={1.8} single rough={0.4} />
        </>
      );
    default:
      return (
        <>
          {eye("idle-el", 48, 54)}
          {eye("idle-er", 72, 54)}
          <P k="idle-m" d="M60 64 Q56.5 68 53 66 M60 64 Q63.5 68 67 66" sw={2} single rough={0.4} />
        </>
      );
  }
}

/**
 * The cat. `still` turns the motion off (empty states keep it calm); in the
 * games the cat bobs gently, and it never moves with reduced motion.
 */
export function Chai({ mood = "idle", size = 96, className, still = false }: { mood?: ChaiMood; size?: number; className?: string; still?: boolean }) {
  return (
    <span className={cn(!still && s.chai, "sketch inline-block", className)} data-mood={mood} style={{ width: size, height: size }} aria-hidden>
      <svg viewBox="0 0 120 120" width={size} height={size} className="overflow-visible">
        {/* tail, curling up at the right */}
        <g className={still ? undefined : s.tail}>
          <P k="tail" d="M84 106 C100 108 108 96 104 84 C102 77 96 76 95 82" sw={2.6} fill="none" rough={0.6} />
        </g>
        {/* body and front paws */}
        <P k="body" d="M42 74 C33 86 31 102 37 110 L83 110 C89 102 87 86 78 74" sw={2.6} fill={C.paper} fillStyle="solid" rough={0.6} />
        <P k="paws" d="M47 110 Q47 103 53 103 Q59 103 59 110 M61 110 Q61 103 67 103 Q73 103 73 110" sw={2} single rough={0.5} />
        {/* ears, lime inside */}
        <P k="ear-l" d="M34 46 L36 17 L56 32" sw={2.6} fill={C.paper} fillStyle="solid" rough={0.6} />
        <P k="ear-r" d="M64 32 L84 17 L86 46" sw={2.6} fill={C.paper} fillStyle="solid" rough={0.6} />
        <P k="ear-li" d="M39 36 L40 25 L48 31 Z" sw={0.8} stroke="none" fill={C.lime} fillStyle="solid" single />
        <P k="ear-ri" d="M72 31 L80 25 L81 36 Z" sw={0.8} stroke="none" fill={C.lime} fillStyle="solid" single />
        {/* head */}
        <E k="head" cx={60} cy={55} w={60} h={50} sw={2.6} fill={C.paper} fillStyle="solid" rough={0.6} />
        {/* goggles up on the forehead */}
        <P k="strap" d="M31 41 Q60 33 89 41" sw={2.2} single rough={0.5} />
        <E k="lens-l" cx={50} cy={38} w={15} h={12} sw={2} fill={C.blue} fillStyle="solid" rough={0.5} />
        <E k="lens-r" cx={70} cy={38} w={15} h={12} sw={2} fill={C.blue} fillStyle="solid" rough={0.5} />
        <P k="glint" d="M46 36 L48 35" sw={1.6} stroke={C.paper} single rough={0.2} />
        <P k="glint2" d="M66 36 L68 35" sw={1.6} stroke={C.paper} single rough={0.2} />
        {/* face */}
        <Face mood={mood} />
        <P k="nose" d="M57.5 60 L62.5 60 L60 63 Z" sw={1.2} fill={C.ink} fillStyle="solid" single rough={0.3} />
        <P k="whiskers" d="M40 62 L26 60 M40 66 L27 69 M80 62 L94 60 M80 66 L93 69" sw={1.3} stroke={C.soft} single rough={0.5} />
        {/* lime collar and a blue tag */}
        <P k="collar" d="M42 77 Q60 85 78 77" sw={4} stroke={C.lime} single rough={0.4} />
        <E k="tag" cx={60} cy={86} w={7} h={7} sw={1.4} fill={C.blue} fillStyle="solid" single rough={0.3} />
        {/* mood marks */}
        {mood === "think" ? <P k="q" d="M98 16 Q98 8 105 8 Q112 8 112 14 Q112 19 106 21 Q104 22 104 26 M104 31 L104 32" sw={2.2} stroke={C.blue} single rough={0.4} /> : null}
        {mood === "sleep" ? (
          <g className={still ? undefined : s.zzz}>
            <P k="z1" d="M96 14 L104 14 L96 22 L104 22" sw={2} stroke={C.soft} single rough={0.3} />
            <P k="z2" d="M106 4 L112 4 L106 10 L112 10" sw={1.6} stroke={C.soft} single rough={0.3} />
          </g>
        ) : null}
        {mood === "cheer" ? (
          <g className={still ? undefined : s.sparkle}>
            <P k="sp1" d="M14 26 L14 38 M8 32 L20 32" sw={2.4} stroke={C.lime} single rough={0.3} />
            <P k="sp2" d="M104 12 L104 22 M99 17 L109 17" sw={2.4} stroke={C.lime} single rough={0.3} />
          </g>
        ) : null}
        {mood === "sad" ? <P k="tear" d="M78 62 Q76 66 78 68 Q80 66 78 62 Z" sw={1.2} stroke={C.blue} fill={C.blue} fillStyle="solid" single rough={0.2} /> : null}
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
