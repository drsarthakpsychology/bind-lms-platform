import { recentList, recentMedicines, type Recent } from "@/lib/recent";
import { SHOWN } from "@/lib/shown";

/**
 * Pinned and recently opened, for the three look-up lists inside the Notes
 * tab. The website keeps neither, so they are hidden (SHOWN.pins): the lists
 * read as empty, opening a page records nothing and the pin button is not
 * drawn. Set SHOWN.pins to true to bring them back (kept on this phone).
 */
const NONE: string[] = [];
const off: Recent = { add: () => undefined, remove: () => undefined, use: () => NONE };
const shown = (list: Recent): Recent => (SHOWN.pins ? list : off);

export const pinsShown: boolean = SHOWN.pins;
export const pinnedNotes = shown(recentList("pin.notes", 24));
export const pinnedRefs = shown(recentList("pin.refs", 24));
export const pinnedMeds = shown(recentList("pin.meds", 24));
export const recentNotes = shown(recentList("notes", 4));
export const recentRefs = shown(recentList("refs", 4));
export const recentMeds = shown(recentMedicines);
