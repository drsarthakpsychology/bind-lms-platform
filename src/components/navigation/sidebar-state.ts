"use client";

import * as React from "react";

/**
 * Sidebar size preference: "auto" (full on wide screens, a slim icon rail on
 * laptops), or the user's explicit "full" / "mini" choice. Kept in
 * localStorage (a per-device convenience, like YouTube's guide). Every read and
 * write is wrapped: private mode simply falls back to "auto".
 */
export type SidebarPref = "auto" | "full" | "mini";

const KEY = "vibha-sidebar";
const EVENT = "vibha-sidebar-change";

function read(): SidebarPref {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "full" || v === "mini" ? v : "auto";
  } catch {
    return "auto";
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useSidebarPref(): SidebarPref {
  return React.useSyncExternalStore(subscribe, read, () => "auto");
}

/** Flip between full and mini, starting from what is on screen right now. */
export function toggleSidebar() {
  // Tablets always show the slim rail; ☰ opens the full menu drawer there.
  if (window.innerWidth < 1024) {
    openNavDrawer();
    return;
  }
  const cur = read();
  const showingMini = cur === "mini" || (cur === "auto" && window.innerWidth < 1280);
  try {
    window.localStorage.setItem(KEY, showingMini ? "full" : "mini");
  } catch {
    /* ignore: the toggle still works for this page view below */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Open the phone "More" drawer from anywhere (bottom bar, top bar). */
export const OPEN_NAV_EVENT = "plms:open-nav";
export function openNavDrawer() {
  window.dispatchEvent(new Event(OPEN_NAV_EVENT));
}
