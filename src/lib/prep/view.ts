/**
 * What the browser may see of a question before it is answered: everything
 * except the answer, the explanation and the admin-only source note.
 */
import type { PrepQuestion, PrepVisual, QuestionType, Subject } from "./types";

export type PrepQView = {
  id: string;
  subject: Subject;
  topic: string;
  type: QuestionType;
  stem: string;
  passage?: string;
  statements?: string[];
  lists?: { left: string[]; right: string[] };
  options: [string, string, string, string];
};

export function toView(q: PrepQuestion): PrepQView {
  return {
    id: q.id,
    subject: q.subject,
    topic: q.topic,
    type: q.type,
    stem: q.stem,
    ...(q.passage ? { passage: q.passage } : {}),
    ...(q.statements?.length ? { statements: q.statements } : {}),
    ...(q.lists ? { lists: q.lists } : {}),
    options: q.options,
  };
}

/** After answering: the answer and why (never `ref`). */
export type PrepReveal = { id: string; answer: number; explanation: string; learnHref: string; visual?: PrepVisual };
