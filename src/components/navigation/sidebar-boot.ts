/**
 * Storage keys and the before-first-paint script for the sidebar size
 * (see sidebar-state.ts). Kept out of the "use client" module so the server
 * shell can inline the script as a plain string.
 */
export const SIDEBAR_KEY = "vibha-sidebar";
export const SIDEBAR_FOCUS_KEY = "vibha-sidebar-focus";

/** Copies the remembered choice onto <html> before the sidebar paints. */
export const SIDEBAR_BOOT_SCRIPT = `try{var d=document.documentElement,a=localStorage.getItem("${SIDEBAR_KEY}"),b=localStorage.getItem("${SIDEBAR_FOCUS_KEY}");if(a==="full"||a==="mini")d.setAttribute("data-sidebar",a);if(b==="full")d.setAttribute("data-sidebar-focus","full")}catch(e){}`;
