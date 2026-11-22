import type { Me } from "@/api/contract";
import { prefs } from "@/lib/storage";

/**
 * The Study tab (route `library`, so every old link to the Notes tab still
 * opens it) has two sides: Modules and Notes. These are the addresses that
 * open it on one side, and the memory of the side last used.
 */
export type StudySide = "modules" | "notes";

export const STUDY_MODULES = "/library?side=modules";
export const STUDY_NOTES = "/library?side=notes";

/** Same rule as the Learn tab always used for modules: on unless switched off, never for lectures-only accounts. */
export function hasStudy(me: Me | null | undefined): boolean {
  if (!me) return true;
  return me.access?.can?.study !== false && !me.access?.lecturesOnly && me.scope !== "lectures_only";
}

export function isSide(v: unknown): v is StudySide {
  return v === "modules" || v === "notes";
}

const KEY = "vibha.study.side";
let remembered: StudySide | null = null;
let loading: Promise<StudySide> | null = null;

/** The side last used on this phone (Modules the first time). Read once, then kept in memory. */
export function loadStudySide(): Promise<StudySide> {
  if (remembered) return Promise.resolve(remembered);
  loading ??= prefs
    .get(KEY)
    .then((v) => (remembered ??= isSide(v) ? v : "modules"))
    .catch(() => (remembered ??= "modules"));
  return loading;
}

/** What is known right now, without waiting (null before the first read finishes). */
export function studySideNow(): StudySide | null {
  return remembered;
}

export function saveStudySide(side: StudySide): void {
  remembered = side;
  void prefs.set(KEY, side).catch(() => undefined);
}

/** Tests only. */
export function resetStudySideForTests(): void {
  remembered = null;
  loading = null;
}
