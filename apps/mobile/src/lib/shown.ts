import { config } from "./config";

/**
 * Parts of the app that are built but switched off, because the website does
 * not have their data yet (owner, 22 Nov 2026: "Connect what you can, hide
 * the rest"). The code stays; set a line to true once its server part exists
 * (docs/CONNECT.md, "Hidden until the website has it").
 */
export const SHOWN = {
  /** Lecture page, Chapters tab: lectures have no chapter list on the website. */
  lectureChapters: false,
  /** Lecture page, My notes tab: the website has no per-lecture notes. */
  lectureNotes: false,
  /** Casebook, Saved cases: the website has no saved cases. */
  savedCases: false,
  /** Pin buttons and the Pinned and Recently opened lists in Notes: the website has no pins. */
  pins: false,
  /** The full case player (/case/full): the rich cases are not on the website yet. */
  fullCasePlayer: false,
} as const;

/**
 * Design pages (the kit gallery at /kit) open only in the browser build that
 * runs on sample data, and in development. Never in a release build.
 */
export const designPages: boolean = config.apiMode === "mock" || (typeof __DEV__ !== "undefined" && __DEV__);
