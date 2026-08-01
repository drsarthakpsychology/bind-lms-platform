"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Dynamic, persistent watermark for video playback.
 *
 * Anti-tamper: observes the watermark node and flags tampering if it is
 * removed from the DOM or hidden (display:none / visibility:hidden / opacity:0).
 * The random movement + opacity make it harder to predictably cover, and the
 * wrapper-level fullscreen in video-player.tsx keeps it visible even in
 * full-screen mode.
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
  const [position, setPosition] = useState({ top: 10, left: 10 });
  const [opacity, setOpacity] = useState(0.3);
  const detectedRef = useRef(false);

  // Guard against double-firing from overlapping observers.
  function detect() {
    if (detectedRef.current) return;
    detectedRef.current = true;
    onTamperDetected();
  }

  // Random movement + opacity, every 15-30 seconds.
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function scheduleMove() {
      const delay = 15000 + Math.random() * 15000; // 15-30s
      timeoutId = setTimeout(() => {
        setPosition({
          top: 5 + Math.random() * 80, // percent
          left: 5 + Math.random() * 70,
        });
        setOpacity(0.25 + Math.random() * 0.15); // 25-40%
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
      className="plms-watermark whitespace-nowrap rounded bg-black/40 px-2 py-1 text-xs font-medium text-white transition-[top,left] duration-1000"
      style={{ top: `${position.top}%`, left: `${position.left}%`, opacity }}
    >
      {label}
    </div>
  );
}
