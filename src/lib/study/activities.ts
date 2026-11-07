import type { Domain } from "@/lib/learn/concepts/types";
import type { Activity } from "./types";

/** Builders for the activities a module links to (each opens an existing game/drill). */
export const act = {
  lesson: (lessonId: string, title: string, why: string): Activity => ({ id: `lesson-${lessonId}`, title, why, href: `/prep/smart/play?lesson=${lessonId}`, kind: "lesson" }),
  coach: (domain: Domain, title: string, why: string): Activity => ({ id: `coach-${domain}`, title, why, href: `/prep/smart/coach?domain=${domain}`, kind: "coach" }),
  detective: (title: string, why: string): Activity => ({ id: "detective", title, why, href: "/practice/detective", kind: "detective" }),
  scenarios: (noteId: string, title: string, why: string): Activity => ({ id: `cases-${noteId}`, title, why, href: `/practice/scenarios?note=${noteId}`, kind: "scenarios" }),
  terms: (title: string, why: string): Activity => ({ id: "terms", title, why, href: "/practice/terms", kind: "terms" }),
  notes: (noteId: string, title: string, why: string): Activity => ({ id: `note-${noteId}`, title, why, href: `/study/notes/${noteId}`, kind: "notes" }),
};
