"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Forensic watermark for the material viewer — same deterrent as video:
 * viewer's identity is baked in server-side (email · session · IP), rendered
 * as low-opacity text with a subtle shadow, drifting so a single crop or blur
 * can't clean it. Never intercepts pointer events.
 *
 * This is a deterrent, not a guarantee — a screenshot can still be taken. It
 * just makes a leak traceable.
 */
export function MaterialWatermark({ label }: { label: string }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: "6%", left: "4%" });

  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const BOTTOM_LIMIT = 82;
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = reduce ? 120000 + Math.random() * 120000 : 18000 + Math.random() * 27000;
      t = setTimeout(() => {
        setPos({
          top: `${2 + Math.random() * (BOTTOM_LIMIT - 2)}%`,
          left: `${2 + Math.random() * 45}%`,
        });
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={nodeRef}
      aria-hidden="true"
      className="pointer-events-none absolute z-[2147483000] select-none text-[13px] font-medium text-white"
      style={{
        top: pos.top,
        left: pos.left,
        opacity: 0.4,
        textShadow:
          "0 1px 2px rgba(0,0,0,0.65), 0 0 1px rgba(0,0,0,0.65), 1px 0 0 rgba(0,0,0,0.4)",
        maxWidth: "calc(100% - 1.5rem)",
        width: "max-content",
        transition: "top 3s linear, left 3s linear",
      }}
    >
      {label}
    </div>
  );
}
