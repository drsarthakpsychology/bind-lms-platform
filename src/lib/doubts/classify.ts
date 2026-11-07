/**
 * Tell a genuine doubt (a question about the subject) from a complaint (about
 * the course, fees, the teacher, access, refunds). A complaint is kept private
 * and sent to the admin instead of the shared board. Pure and simple. It errs
 * toward privacy: anything that looks like a grievance is treated as one.
 */
const COMPLAINT_HINTS = [
  "refund", "fees", "fee ", "money back", "cheat", "scam", "fraud", "waste of",
  "worst", "pathetic", "useless", "rubbish", "disappointed", "disappointing",
  "complaint", "complain", "not worth", "misleading", "false promise", "lied",
  "no response", "not responding", "never reply", "ignored", "rude", "unprofessional",
  "demand", "legal action", "consumer court", "harass", "cancel my", "want my money",
  "password not working", "can't log in", "cannot log in", "locked out", "access issue",
  "not able to access", "video not", "not getting access", "technical issue", "payment",
];

export function looksLikeComplaint(title: string, body: string): boolean {
  const text = `${title} ${body}`.toLowerCase();
  if (COMPLAINT_HINTS.some((h) => text.includes(h))) return true;
  // All-caps shouting with no question mark reads as a grievance, not a doubt.
  const letters = (title + body).replace(/[^a-zA-Z]/g, "");
  if (letters.length > 12 && letters === letters.toUpperCase() && !text.includes("?")) return true;
  return false;
}

/** The kind to file a new post under. */
export function kindFor(title: string, body: string, override?: "doubt" | "complaint"): "doubt" | "complaint" {
  if (override) return override;
  return looksLikeComplaint(title, body) ? "complaint" : "doubt";
}

/** A gentle note shown when a post is being routed to the admin. */
export const COMPLAINT_NOTICE =
  "This looks like a concern about the course or your account rather than a study doubt, so it goes privately to the VIBHA team, not the public board. If it really is a study question, mark it as a doubt below.";
