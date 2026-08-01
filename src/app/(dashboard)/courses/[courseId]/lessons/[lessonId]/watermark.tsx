"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

/**
 * Dynamic, multi-instance, persistent watermark for video playback.
 *
 * Anti-piracy design (per content-protection brief):
 *  - TWO or more instances on screen simultaneously, at different positions
 *    and scales — cropping or blurring one region can't clean the frame.
 *  - Each instance moves on an unpredictable schedule (not a fixed loop) to a
 *    new position ANYWHERE in the frame, including over the content, so a
 *    scripted overlay can't track all of them.
 *  - Opacity and size vary within a legible range as they move.
 *  - Text only: no background fill, no panel, no fixed-size block. Legibility
 *    from a text shadow that survives both light and dark frames.
 *  - Never intercepts pointer events. Never sits over the bottom controls bar.
 *  - Tamper-proofing: removing ANY instance from the DOM, hiding it, or zeroing
 *    its opacity stops playback (onTamperDetected). A student can't just delete
 *    one node.
 *  - Reduced-motion reduces movement frequency, not the count — so it still
 *    covers the frame but doesn't flash around.
 *
 * Honest boundary: anything that renders in a browser can be screen-recorded.
 * This is a deterrent, not DRM. It makes casual capture awkward and any leak
 * traceable to the account the label names.
 */
export function Watermark({
  label,
  onTamperDetected,
}: {
  label: string;
  onTamperDetected: () => void;
}) {
  const detectedRef = useRef(false);
  const reduce = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  // Two watermark instances — two named refs (an array-of-refs trips the
  // react-hooks/refs rule).
  const nodeA = useRef<HTMLDivElement>(null);
  const nodeB = useRef<HTMLDivElement>(null);

  const detect = useCallback(() => {
    if (detectedRef.current) return;
    detectedRef.current = true;
    onTamperDetected();
  }, [onTamperDetected]);

  // Independent, unpredictable drift per instance.
  useEffect(() => {
    // Control bar occupies roughly the bottom 15%; keep watermarks above it.
    const BOTTOM_LIMIT = 82;

    function randomPos() {
      return {
        top: 2 + Math.random() * (BOTTOM_LIMIT - 2),
        left: 1 + Math.random() * 90,
      };
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (const ref of [nodeA, nodeB]) {
      const el = ref.current;
      if (!el) continue;

      const schedule = () => {
        // Normal: every 18–45s. Reduced motion: every 2–4 minutes (still moves,
        // just slowly) — reduced frequency, not parked.
        const delay = reduce
          ? 120000 + Math.random() * 120000
          : 18000 + Math.random() * 27000;
        timers.push(
          setTimeout(() => {
            const pos = randomPos();
            el.style.top = `${pos.top}%`;
            el.style.left = `${pos.left}%`;
            el.style.opacity = String(0.3 + Math.random() * 0.2); // 30–50%
            el.style.fontSize = `${11 + Math.random() * 3}px`; // 11–14px
            el.style.transform = `scale(${0.95 + Math.random() * 0.2})`;
            schedule();
          }, delay),
        );
      };
      schedule();
    }

    return () => timers.forEach(clearTimeout);
  }, [reduce]);

  // Tamper-proofing per instance: removal, hidden, or zeroed opacity → stop.
  useEffect(() => {
    const observers: MutationObserver[] = [];

    for (const ref of [nodeA, nodeB]) {
      const node = ref.current;
      const parent = node?.parentElement;
      if (!node || !parent) continue;
      const el: Element = node;

      function checkHidden() {
        if (detectedRef.current) return;
        const style = window.getComputedStyle(el);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          parseFloat(style.opacity) === 0
        ) {
          detect();
        }
      }

      const removalObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (Array.from(mutation.removedNodes).includes(el)) {
            detect();
            return;
          }
        }
      });
      removalObserver.observe(parent, { childList: true });
      observers.push(removalObserver);

      const attributeObserver = new MutationObserver(checkHidden);
      attributeObserver.observe(el, { attributes: true, attributeFilter: ["style", "class"] });
      observers.push(attributeObserver);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, [detect]);

  const baseStyle = {
    textShadow:
      "0 1px 2px rgba(0,0,0,0.65), 0 0 1px rgba(0,0,0,0.65), 1px 0 0 rgba(0,0,0,0.4)",
  };

  return (
    <>
      <div
        ref={nodeA}
        aria-hidden="true"
        data-testid="plms-watermark"
        className="plms-watermark font-medium text-white"
        style={{ ...baseStyle, top: "6%", left: "4%", opacity: 0.4, fontSize: "13px" }}
      >
        {label}
      </div>
      <div
        ref={nodeB}
        aria-hidden="true"
        data-testid="plms-watermark-secondary"
        className="plms-watermark font-medium text-white"
        style={{ ...baseStyle, top: "38%", left: "62%", opacity: 0.35, fontSize: "12px" }}
      >
        {label}
      </div>
    </>
  );
}
