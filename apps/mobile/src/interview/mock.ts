// MOCK DATA: design phase only. See docs/DESIGN.md, To connect.
/**
 * A sample of the website's mock interview bank (src/content/prep, two
 * questions per category, copied on 21 Nov 2026). On the website the model
 * answer stays on the server until the student has answered, and the session
 * is saved and scored again there. The app has no API for this yet: see
 * docs/CONNECT-blab.md.
 */
import raw from "./mock-data.json";

export type InterviewCategory = "motivation" | "academic" | "clinical-vignette" | "assessment" | "research" | "ethics" | "current-affairs";
export type InterviewQuestion = { id: string; category: InterviewCategory; question: string; followUps: string[]; modelAnswer: string; mustCover: string[]; redFlags: string[] };

export const INTERVIEWS = raw as unknown as InterviewQuestion[];
