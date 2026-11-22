import { recentList } from "@/lib/recent";

/**
 * Saved cases, kept on this phone. Hidden while the website keeps no saved
 * cases (SHOWN.savedCases in src/lib/shown.ts). Scores are the server's
 * (GET /casebook, POST /casebook/:id/done).
 */
export const savedCases = recentList("casebook-saved", 60);
