import { it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: async () => new Headers(), cookies: async () => ({ getAll: () => [], get: () => undefined, set: () => undefined }) }));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn, revalidatePath: () => undefined, revalidateTag: () => undefined, updateTag: () => undefined }));
const M: Record<string, () => Promise<unknown>> = {
  appRoute: () => import("@/lib/app-api/route"),
  study: () => import("@/lib/study"),
  content: () => import("@/content/prep/index"),
  bank: () => import("@/lib/prep/bank"),
  path: () => import("@/lib/prep/path"),
  appPrep: () => import("@/lib/app-api/prep"),
  prepRoute: () => import("@/app/api/app/v1/prep/route"),
  setRoute: () => import("@/app/api/app/v1/prep/subjects/[subject]/topics/[topic]/route"),
  mockRoute: () => import("@/app/api/app/v1/prep/mock/route"),
  playRoute: () => import("@/app/api/app/v1/play/[game]/[action]/route"),
  practise: () => import("@/app/api/app/v1/practise/route"),
  tools: () => import("@/app/api/app/v1/practise/tools/[tool]/route"),
  home: () => import("@/app/api/app/v1/home/route"),
  studyModules: () => import("@/app/api/app/v1/study/modules/route"),
  checkpoint: () => import("@/app/api/app/v1/study/modules/[moduleId]/checkpoints/[n]/route"),
  adminHome: () => import("@/app/api/app/v1/admin/home/route"),
  adminPeople: () => import("@/app/api/app/v1/admin/people/route"),
};
it("prof", async () => {
  for (const k of Object.keys(M)) { vi.resetModules(); await M[k](); }
  const out: Record<string, number> = {};
  for (const k of Object.keys(M)) { vi.resetModules(); const t = performance.now(); await M[k](); out[k] = Math.round(performance.now() - t); }
  process.stderr.write("PROF " + JSON.stringify(out) + "\n");
}, 600000);
