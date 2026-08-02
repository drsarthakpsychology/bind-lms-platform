"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

/**
 * Dynamic, persistent watermark for video playback.
 *
 * ONE instance that moves to unpredictable positions on an irregular schedule —
 * anywhere in the frame, including over the content. Clamped inside the frame
 * so it never overflows, clips, or sits under the controls bar. Low-opacity
 * text with a subtle shadow, no background block. Non-interactive, renders in
 * fullscreen, and pauses playback if removed from the DOM.
 *
 * Honest boundary: anything that renders in a browser can be screen-recorded.
 * This is a deterrent that makes casual capture awkward and any leak traceable
 * to the account the label names.
 */
export function Watermark({
  label,
  onTamperDetected,
}: {
  label: string;
  onTamperDetected: () => void;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const detectedRef = useRef(false);
  const reduce = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const detect = useCallback(() => {
    if (detectedRef.current) return;
    detectedRef.current = true;
    onTamperDetected();
  }, [onTamperDetected]);

  // Irregular, clamped drift. Movement is expressed as percentages of the
  // frame; a max-height/max-width clamp on the node keeps it inside.
  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;

    const BOTTOM_LIMIT = 78; // keep above the controls bar (bottom ~15%)

    function randomPos() {
      return {
        top: 2 + Math.random() * (BOTTOM_LIMIT - 2),
        // Keep left small enough that the max-width clamp never clips: the
        // node grows rightward from `left`, so staying in the left half plus
        // max-width: calc(100% - 1.5rem) guarantees it fits the frame.
        left: 2 + Math.random() * 45,
      };
    }

    let timeout: ReturnType<typeof setTimeout>;

    const schedule = () => {
      // Normal: every 18–45s. Reduced motion: every 2–4 minutes — still moves,
      // just slowly.
      const delay = reduce
        ? 120000 + Math.random() * 120000
        : 18000 + Math.random() * 27000;
      timeout = setTimeout(() => {
        const pos = randomPos();
        el.style.top = `${pos.top}%`;
        el.style.left = `${pos.left}%`;
        el.style.opacity = String(0.3 + Math.random() * 0.2); // 30–50%
        el.style.fontSize = `${11 + Math.random() * 3}px`; // 11–14px
        schedule();
      }, delay);
    };
    schedule();

    return () => clearTimeout(timeout);
  }, [reduce]);

  // Tamper-proofing: removal or hard-hide (display:none / visibility:hidden) →
  // pause playback. A genuine tamper removes the element or sets one of these;
  // the DRIFT effect legitimately changes `opacity` and `font-size`, so those
  // are deliberately NOT triggers — an opacity read (or a React re-render that
  // momentarily recomputes it during the CSS transition) would otherwise pause
  // honest playback. A debounce also absorbs transient states during re-render.
  useEffect(() => {
    const node = nodeRef.current;
    const parent = node?.parentElement;
    if (!node || !parent) return;
    const el: Element = node;

    let pending: ReturnType<typeof setTimeout> | null = null;

    function checkHardHidden() {
      const style = window.getComputedStyle(el);
      return style.display === "none" || style.visibility === "hidden";
    }

    // Only pause when the watermark is genuinely gone/hard-hidden for a
    // sustained period — never on a transient read.
    function armIfHidden() {
      if (detectedRef.current) return;
      if (!checkHardHidden()) {
        // Reappeared — cancel any pending pause.
        if (pending) {
          clearTimeout(pending);
          pending = null;
        }
        return;
      }
      if (pending) return; // already armed
      pending = setTimeout(() => {
        if (checkHardHidden()) detect();
      }, 1000);
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

    const attributeObserver = new MutationObserver(armIfHidden);
    attributeObserver.observe(el, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => {
      removalObserver.disconnect();
      attributeObserver.disconnect();
      if (pending) clearTimeout(pending);
    };
  }, [detect]);

  return (
    <div
      ref={nodeRef}
      aria-hidden="true"
      data-testid="plms-watermark"
      className="plms-watermark plms-watermark-label font-medium text-white"
      style={{
        top: "6%",
        left: "4%",
        opacity: 0.4,
        fontSize: "13px",
        textShadow:
          "0 1px 2px rgba(0,0,0,0.65), 0 0 1px rgba(0,0,0,0.65), 1px 0 0 rgba(0,0,0,0.4)",
      }}
    >
      {label}
    </div>
  );
}
