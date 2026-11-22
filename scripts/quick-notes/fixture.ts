/**
 * Rebuild the phone mock fixture from the real Quick Notes (run from the repo root):
 *   node -r ./scripts/quick-notes/stub-server-only.cjs --import tsx scripts/quick-notes/fixture.ts
 */
import { writeFileSync } from "node:fs";
import { quickLibrary } from "@/lib/quick-notes/library";
import { quickNoteById } from "@/lib/quick-notes";
import { quickNoteView } from "@/lib/quick-notes/view";
const lib = quickLibrary();
const pick = (t: string, n: number) => lib.items.filter((i) => i.type === t).slice(0, n);
const items = [...lib.items.filter((i) => !i.key.startsWith("note:") && !i.key.startsWith("ref:") && !i.key.startsWith("med:")), ...pick("summary", 12), ...lib.items.filter((i) => i.key.startsWith("ref:") && i.type === "criteria").slice(0, 8), ...pick("term", 16), ...pick("pharm", 60).filter((i) => i.key.startsWith("med:")).slice(0, 10)];
const ids = ["criteria-adhd", "criteria-mdd", "pharm-lithium", "compare-psychosis-duration", "diff-low-mood", "therapy-cbt", "assess-scales", "theory-learning"];
const views = Object.fromEntries(ids.map((id) => [id, quickNoteView(quickNoteById(id)!)]));
const out = { library: { ...lib, items }, views };
writeFileSync("apps/mobile/src/library/quick-notes-fixture.json", JSON.stringify(out));
console.log(items.length, JSON.stringify(out).length);
