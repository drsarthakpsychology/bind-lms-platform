"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Dynamic, persistent watermark for video playback.
 *
 * The watermark is TEXT ONLY — no background fill, no panel, no border. Legibility
 * comes from a subtle text shadow that works over both light and dark frames.
 * It is small, low-opacity, sized to its own content, and drifts slowly between
 * positions so it can't be cropped or covered by a single overlay. It never
 * intercepts pointer events. Reduced-motion parks it in one corner instead of
 * drifting.
 *
 * Anti-tamper: observes the watermark node and flags tampering if it is removed
 * from the DOM or hidden (display:none / visibility:hidden / opacity:0).
 *
 * Honest boundary: nothing rendered in a browser can be made impossible to
 * capture. The watermark + short-lived signed URLs + no-download controls are
 * practical deterrents, documented as such in video-player.tsx.
 */
export function Watermark({
  label,
  onTamperDetected,
}: {
  label: string;
  onTamperDetected: () => void;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  // Start in a corner. If the user prefers reduced motion, it stays here.
  const [position, setPosition] = useState<{ top: string; left: string }>({
    top: "6%",
    left: "6%",
  });
  const [opacity, setOpacity] = useState(0.4);
  const detectedRef = useRef(false);

  // Guard against double-firing from overlapping observers.
  function detect() {
    if (detectedRef.current) return;
    detectedRef.current = true;
    onTamperDetected();
  }

  // Slow drift, every 30–60s, confined to the top band so the watermark never
  // settles over the bottom controls bar. Respects prefers-reduced-motion by
  // parking in the start corner.
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // stay parked in the corner
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    function scheduleMove() {
      const delay = 30000 + Math.random() * 30000; // 30–60s
      timeoutId = setTimeout(() => {
        setPosition({
          // top band: between 4% and ~60% of the frame height
          top: `${4 + Math.random() * 56}%`,
          // keep a healthy margin from the left/right edges
          left: `${3 + Math.random() * 62}%`,
        });
        setOpacity(0.35 + Math.random() * 0.1); // 35–45%
        scheduleMove();
      }, delay);
    }

    scheduleMove();
    return () => clearTimeout(timeoutId);
  }, []);

  // Anti-tamper: removal from DOM, or hidden/scaled-out via style/class.
  useEffect(() => {
    const node = nodeRef.current;
    const parent = node?.parentElement;
    if (!node || !parent) return;
    const el: Element = node; // non-null capture for the observers below

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

    const attributeObserver = new MutationObserver(checkHidden);
    attributeObserver.observe(node, { attributes: true, attributeFilter: ["style", "class"] });

    return () => {
      removalObserver.disconnect();
      attributeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={nodeRef}
      aria-hidden="true"
      data-testid="plms-watermark"
      className="plms-watermark text-[13px] leading-none font-medium text-white"
      style={{
        top: position.top,
        left: position.left,
        opacity,
        // Subtle text shadow for legibility over light AND dark frames — no
        // background fill, no panel. Sits above the controls bar (top band).
        textShadow:
          "0 1px 2px rgba(0,0,0,0.6), 0 0 1px rgba(0,0,0,0.6), 1px 0 0 rgba(0,0,0,0.35)",
      }}
    >
      {label}
    </div>
  );
}
