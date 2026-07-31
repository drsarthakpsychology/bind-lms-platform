"use client";

import { useEffect, useRef, useState } from "react";

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
        setOpacity(0.2 + Math.random() * 0.2); // 20-40%
        scheduleMove();
      }, delay);
    }

    scheduleMove();
    return () => clearTimeout(timeoutId);
  }, []);

  // Anti-tamper: if the watermark node is removed from the DOM, or hidden
  // via style/class changes (display:none, visibility:hidden, opacity:0),
  // treat it as tampering.
  useEffect(() => {
    const node = nodeRef.current;
    const parent = node?.parentElement;
    if (!node || !parent) return;

    function checkHidden() {
      if (!node) return;
      const style = window.getComputedStyle(node);
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        parseFloat(style.opacity) === 0
      ) {
        onTamperDetected();
      }
    }

    const removalObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (Array.from(mutation.removedNodes).includes(node)) {
          onTamperDetected();
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
      className="pointer-events-none absolute select-none whitespace-nowrap rounded bg-black/40 px-2 py-1 text-xs font-medium text-white transition-[top,left] duration-1000"
      style={{ top: `${position.top}%`, left: `${position.left}%`, opacity }}
    >
      {label}
    </div>
  );
}
