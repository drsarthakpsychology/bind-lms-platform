import type { Block, GuessData, Section } from "./types";

/**
 * The two reading views of a study section (the Student / Clinician switch).
 *
 * Content written once shows in both views. Content inside `:::student` or
 * `:::clinician` shows in one view only, and a guess widget may carry a
 * `clinician` reveal. A section only shows the switch when switching changes
 * what is on the screen (see docs/app/CONTENT_VIEWS.md).
 */
export type ReadingView = "student" | "clinician";

/** The text one view shows, flattened (used to compare the two views). */
export function viewText(blocks: Block[], view: ReadingView): string {
  const out: string[] = [];
  const walk = (bs: Block[]) => {
    for (const b of bs) {
      switch (b.t) {
        case "view":
          if (b.view === view) {
            out.push(`[${view}]`);
            walk(b.blocks);
          }
          break;
        case "box":
          out.push(b.title ?? "");
          walk(b.blocks);
          break;
        case "qa":
          out.push(b.q);
          walk(b.blocks);
          break;
        case "widget":
          if (b.kind === "guess") {
            const d = b.data as GuessData;
            out.push(view === "clinician" && d.clinician ? d.clinician : d.reveal);
          }
          break;
        default:
          out.push(JSON.stringify(b));
      }
    }
  };
  walk(blocks);
  return out.join("\n");
}

/** True when the two views of these blocks differ. */
export function blocksHaveViews(blocks: Block[]): boolean {
  const walk = (bs: Block[]): boolean =>
    bs.some((b) => {
      if (b.t === "view") return b.blocks.length > 0;
      if (b.t === "widget") return b.kind === "guess" && Boolean((b.data as GuessData).clinician);
      if (b.t === "box" || b.t === "qa") return walk(b.blocks);
      return false;
    });
  return walk(blocks);
}

/** True when switching the view changes what this section shows. */
export function sectionHasViews(s: Pick<Section, "blocks">): boolean {
  return blocksHaveViews(s.blocks);
}

/**
 * Sections where a second view has no meaning: the module test, level checks,
 * viva drills, Q&A banks and long-answer practice. They are exam practice in
 * one voice, so they never show the switch unless they carry view content.
 */
export function singleVoiceSection(s: Pick<Section, "blocks" | "title" | "isTest" | "levelCheck">): boolean {
  if (s.isTest || s.levelCheck) return true;
  if (/^(Long answers?|Viva|Q&A bank)/i.test(s.title)) return true;
  return s.blocks.every((b) => b.t === "viva" || b.t === "qa" || b.t === "h3" || b.t === "p" || b.t === "mcq");
}
