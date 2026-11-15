/**
 * The mock play server (mock builds only): POST /play/:game/:action and the
 * Library routes, answered with the website's shapes from sampled real
 * content. The answer keys live here, never in a screen. Loaded by the app's
 * mock server only when EXPO_PUBLIC_API_MODE is "mock", so a live build does
 * not carry this file or its content.
 */
import type { RawResponse } from "@/api/client";
import type { MedicineList, MedicinePage } from "../types";
import { CASES, resetCases } from "./cases";
import { GAMES, resetGames } from "./games";
import { CONTENT, PlayError, resetSeeds } from "./kit";

const ok = <T,>(data: T): RawResponse => ({ status: 200, json: { ok: true, data } });
const fail = (status: number, code: string, message: string): RawResponse => ({ status, json: { ok: false, error: { code, message } } });

const HANDLERS: Record<string, Record<string, (...args: never[]) => unknown>> = { ...GAMES, ...CASES };

type Med = { id: string; name: string; cls: string; group: string; brands: string[]; uses: string[]; standout: string[]; doses: { amount: string }[]; defaultDose: number; related: string[] };
type MedSample = { med: Med; mechanism: Record<string, unknown> | null; visuals: Record<string, unknown>[]; halfLife: Record<string, unknown> | null };
const MEDS = CONTENT.MEDS_SAMPLE as MedSample[];
const GROUPS = ["Antidepressants", "Antipsychotics", "Mood stabilisers", "Anxiety and sleep", "ADHD, dementia and addiction", "Side-effect medicines"];

export function medicineList(): MedicineList {
  return { v: 1, groups: GROUPS, rows: MEDS.map(({ med: m }) => ({ id: m.id, name: m.name, cls: m.cls, group: m.group, brands: m.brands, uses: m.uses, line: m.standout[0] ?? "", dose: m.doses[m.defaultDose]?.amount ?? "" })) };
}
export function medicinePage(id: string): MedicinePage | null {
  const s = MEDS.find((x) => x.med.id === id);
  if (!s) return null;
  const related = s.med.related.map((r) => MEDS.find((x) => x.med.id === r)?.med).filter(Boolean) as Med[];
  return { v: 1, med: s.med as unknown as MedicinePage["med"], related: related.map((m) => ({ id: m.id, name: m.name, cls: m.cls })), mechanism: s.mechanism, visuals: s.visuals, halfLife: s.halfLife, study: { moduleId: "pharmacology", title: "Medicines in the clinic", target: { screen: "studyModule", moduleId: "pharmacology", web: "/study/pharmacology" } } };
}

/** Answers a Practise or Library route, or null when the path is not one of them. */
export function practiseRoute(method: string, path: string, body: unknown, kind: string): RawResponse | null {
  const seg = path.split("?")[0]!.split("/").filter(Boolean);
  if (seg[0] === "library") {
    if (kind === "lecture") return fail(403, "scope", "Your account is for lectures only.");
    if (method === "GET" && seg[1] === "medicines" && seg.length === 2) return ok(medicineList());
    if (method === "GET" && seg[1] === "medicines" && seg.length === 3) {
      const p = medicinePage(decodeURIComponent(seg[2]!));
      return p ? ok(p) : fail(404, "not_found", "That could not be found.");
    }
    return null;
  }
  if (seg[0] !== "play" || seg.length !== 3 || method !== "POST") return null;
  if (kind === "lecture") return fail(403, "scope", "Your account is for lectures only.");
  const game = decodeURIComponent(seg[1]!);
  const action = decodeURIComponent(seg[2]!);
  const fn = HANDLERS[game]?.[action];
  if (!fn) return fail(404, "not_found", "That could not be found.");
  const args = (body as { args?: unknown[] } | null)?.args ?? [];
  try {
    return ok({ kind: `${game}.${action}`, v: 1, data: (fn as (...a: unknown[]) => unknown)(...args) });
  } catch (e) {
    if (e instanceof PlayError) return fail(e.status, e.code, e.message);
    return fail(400, "bad_request", "That didn't work. Try again.");
  }
}

export function resetPractiseMock() {
  resetSeeds();
  resetCases();
  resetGames();
}
