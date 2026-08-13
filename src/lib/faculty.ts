/**
 * Faculty data model (LANDING_PLAN §16) — the public site's "Who is building
 * this" section is written around the mission + VIBHA Healing Centre + the
 * clinical lead today. This model exists so a faculty directory can be added
 * and populated LATER without restructuring. Never render placeholder humans.
 */

export interface FacultyMember {
  name: string;
  role: string;
  credentials: string;
  shortBio: string;
  specialty: string;
  photo?: string;
}

/** Empty until faculty are authored. Populate → a directory section can render. */
export const FACULTY: FacultyMember[] = [];
