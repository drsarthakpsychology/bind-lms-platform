"use client";

import * as React from "react";
import { SIDEBAR_FOCUS_KEY as FOCUS_KEY, SIDEBAR_KEY as KEY } from "./sidebar-boot";

/**
 * Sidebar size, per device. Two remembered choices, because the student wants
 * different things in different places:
 * - everyday pages: "auto" (full on wide screens, a slim rail on laptops), or
 *   their explicit "full" / "mini";
 * - focus pages (questions, reading, a game; see isFocusPath): "icons" (the
 *   default, out of the way) or "full" once they open it.
 *
 * The choice lives in localStorage and is mirrored onto <html> as
 * data-sidebar / data-sidebar-focus. CSS sizes the sidebar from those
 * attributes, and SIDEBAR_BOOT_SCRIPT (sidebar-boot.ts) sets them before first paint, so a
 * remembered choice never makes the page jump after load. Every storage call
 * is wrapped: in private mode the toggle still works for the page view, and
 * the defaults render without it.
 */
export type SidebarPref = "auto" | "full" | "mini";
export type FocusPref = "icons" | "full";

const EVENT = "vibha-sidebar-change";

function attr(name: string): string | null {
  try {
    return document.documentElement.getAttribute(name);
  } catch {
    return null;
  }
}

function readPref(): SidebarPref {
  const v = attr("data-sidebar");
  return v === "full" || v === "mini" ? v : "auto";
}

function readFocus(): FocusPref {
  return attr("data-sidebar-focus") === "full" ? "full" : "icons";
}

function subscribe(cb: () => void) {
  // Another tab changed it: copy the stored value onto this page, then re-read.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) setAttr("data-sidebar", e.newValue === "full" || e.newValue === "mini" ? e.newValue : null);
    if (e.key === FOCUS_KEY) setAttr("data-sidebar-focus", e.newValue === "full" ? "full" : null);
    cb();
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

function setAttr(name: string, value: string | null) {
  if (value) document.documentElement.setAttribute(name, value);
  else document.documentElement.removeAttribute(name);
}

function store(key: string, value: string | null) {
  try {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
    /* storage blocked: the <html> attribute still carries it for this page view */
  }
}

export function useSidebarPref(): SidebarPref {
  return React.useSyncExternalStore(subscribe, readPref, () => "auto");
}

export function useFocusPref(): FocusPref {
  return React.useSyncExternalStore(subscribe, readFocus, () => "icons");
}

/** Focus pages: open the folded sidebar, or fold it back to icons. */
export function setFocusPref(next: FocusPref) {
  const v = next === "full" ? "full" : null;
  setAttr("data-sidebar-focus", v);
  store(FOCUS_KEY, v);
  window.dispatchEvent(new Event(EVENT));
}

/**
 * The ☰ in the top bar. Tablets and phones open the full menu drawer. On a
 * focus page it opens or folds the icon sidebar; elsewhere it flips between
 * full and mini, starting from what is on screen right now.
 */
export function toggleSidebar(focus = false) {
  if (window.innerWidth < 1024) {
    openNavDrawer();
    return;
  }
  if (focus) {
    setFocusPref(readFocus() === "full" ? "icons" : "full");
    return;
  }
  const cur = readPref();
  const showingMini = cur === "mini" || (cur === "auto" && window.innerWidth < 1280);
  const next = showingMini ? "full" : "mini";
  setAttr("data-sidebar", next);
  store(KEY, next);
  window.dispatchEvent(new Event(EVENT));
}

/** Open the phone "More" drawer from anywhere (bottom bar, top bar). */
export const OPEN_NAV_EVENT = "plms:open-nav";
export function openNavDrawer() {
  window.dispatchEvent(new Event(OPEN_NAV_EVENT));
}
