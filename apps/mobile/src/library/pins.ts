import { recentList } from "@/lib/recent";

/**
 * Pinned and recently opened, for the three look-up lists inside the Notes
 * tab. Kept on this phone for now (see docs/CONNECT-bnotes.md): the same
 * small id list the medicine library already used for "Recently opened".
 */
export const pinnedNotes = recentList("pin.notes", 24);
export const pinnedRefs = recentList("pin.refs", 24);
export const pinnedMeds = recentList("pin.meds", 24);
export const recentNotes = recentList("notes", 4);
export const recentRefs = recentList("refs", 4);
