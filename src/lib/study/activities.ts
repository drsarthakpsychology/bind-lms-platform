import type { Domain } from "@/lib/learn/concepts/types";
import type { Activity } from "./types";

/** Builders for the activities a module links to (each opens an existing game/drill). */
export const act = {
  lesson: (lessonId: string, title: string, why: string): Activity => ({ id: `lesson-${lessonId}`, title, why, href: `/games/play?lesson=${lessonId}`, kind: "lesson" }),
  coach: (domain: Domain, title: string, why: string): Activity => ({ id: `coach-${domain}`, title, why, href: `/games/coach?domain=${domain}`, kind: "coach" }),
  detective: (title: string, why: string): Activity => ({ id: "detective", title, why, href: "/games/detective", kind: "detective" }),
  scenarios: (noteId: string, title: string, why: string): Activity => ({ id: `cases-${noteId}`, title, why, href: `/games/scenarios?note=${noteId}`, kind: "scenarios" }),
  terms: (title: string, why: string): Activity => ({ id: "terms", title, why, href: "/games/terms", kind: "terms" }),
  notes: (noteId: string, title: string, why: string): Activity => ({ id: `note-${noteId}`, title, why, href: `/study/notes/${noteId}`, kind: "notes" }),
};
