/**
 * Escape Room names and the shapes the browser holds, with no room content
 * in this file, so client code can import it without carrying the answers.
 * The rooms themselves (rooms.ts) are read on the server only.
 */
export type Stage = "mse" | "diagnosis" | "differential" | "risk" | "course" | "plan" | "medicine" | "criteria";

/** Wards a room belongs to (for grouping the library). */
export type Ward = "acute" | "child" | "addiction" | "geriatric" | "liaison" | "forensic" | "perinatal" | "community";

export const STAGE_LABEL: Record<Stage, string> = {
  mse: "Mental state",
  diagnosis: "Diagnosis",
  differential: "Differential",
  risk: "Risk",
  course: "Course",
  plan: "Plan",
  medicine: "Medicine",
  criteria: "Criteria",
};

/**
 * The current door as the browser sees it: no answer, no hint, no
 * explanation. Options keep their positions (an answer is the position);
 * an order door's items come already shuffled, and an answer lists those
 * shown positions in the chosen order.
 */
export type PublicDoor =
  | { id: string; stage: Stage; kind: "pick"; prompt: string; options: string[] }
  | { id: string; stage: Stage; kind: "multi"; prompt: string; options: string[] }
  | { id: string; stage: Stage; kind: "order"; prompt: string; items: string[] }
  | { id: string; stage: Stage; kind: "number"; prompt: string; min: number; max: number; unit?: string };

/** What a door shows once it is open. */
export type OpenedDoor = { stage: Stage; why: string; unlock: string; skill: string };

/** A room on the pick screen. */
export type RoomCard = { id: string; title: string; place: string; patient: string; intro: string; doors: number };

/**
 * A room as the browser sees it right now: every door's stage (for the door
 * strip), the current door, its hint once two misses have opened it, the
 * doors already opened, and the ending once out.
 */
export type RoomView = RoomCard & { stages: Stage[]; door: PublicDoor | null; hint: string | null; opened: OpenedDoor[]; outro: string | null };
