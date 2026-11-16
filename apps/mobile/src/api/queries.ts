import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import type { PersistedClient } from "@tanstack/react-query-persist-client";
import { MutationCache, QueryCache, QueryClient, queryOptions, type Query, type QueryCache as QC, useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";

import { api, onSignedOut, session } from "@/auth";
import { config } from "@/lib/config";
import type * as C from "./contract";
import * as A from "./adapt";
import * as K from "./adapt-core";
import * as L from "./adapt-learn";
import { ApiFailure } from "./errors";
import { configureOnline } from "./online";
import { outbox } from "./outbox";

const DAY = 24 * 60 * 60 * 1000;

/**
 * When a read tries again. Not reaching the server: up to three more times, waiting
 * longer each time (and while the phone is offline the tries wait for the internet
 * instead of failing). A call that ran out of time: once more (each one can take half
 * a minute). Our own server error: twice. Anything else (closed for you, not found) is
 * an answer, not bad luck, so it is not asked again.
 */
export function shouldRetry(count: number, error: unknown): boolean {
  if (!(error instanceof ApiFailure)) return count < 1;
  if (error.code === "network") return count < (error.details.timeout === true ? 1 : 3);
  if (error.code === "server_error") return count < 2;
  if (error.code === "rate_limited") return count < 1;
  return false;
}

/** Waits of about 1, 2, 4, 8 seconds (up to 30), a little spread so many phones do not ask together. */
export function retryDelay(count: number, error?: unknown): number {
  const base = Math.min(30_000, 1000 * 2 ** count) * (error instanceof ApiFailure && error.code === "rate_limited" ? 5 : 1);
  return Math.round(base * (0.75 + Math.random() * 0.5));
}

/** Queued writes (src/api/queued.ts) keep trying much longer: the student's work must arrive. */
export function shouldRetryWrite(count: number, error: unknown): boolean {
  if (!(error instanceof ApiFailure)) return false;
  if (error.code === "network") return count < 8;
  if (error.code === "server_error" || error.code === "rate_limited") return count < 4;
  return false;
}

/** Most queries in memory at once. Above it, the oldest ones no screen is showing are let go (memory on small phones). */
export const CACHE_MAX = 400;

/** Drop the least recently loaded queries nobody is watching until the cache is back under `max`. */
export function capCache(cache: QC, max = CACHE_MAX): void {
  const all = cache.getAll();
  if (all.length <= max) return;
  const idle = all.filter((q) => q.getObserversCount() === 0 && q.state.fetchStatus !== "fetching").sort((a, b) => a.state.dataUpdatedAt - b.state.dataUpdatedAt);
  const extra = all.length - Math.floor(max * 0.8);
  for (const q of idle.slice(0, extra)) cache.remove(q as Query);
}

/**
 * Server data. TanStack Query keeps a copy of every answer, shows it at once
 * the next time the screen opens, and refreshes it quietly. The copy is kept
 * on the phone between launches (a week, so a student who was away for a few
 * days still opens on their content) and wiped on sign-out. Video addresses
 * and test questions are never kept.
 *
 * networkMode "offlineFirst": the first try always goes out (the offline flag
 * can never block a read that would have worked), and only the retries wait
 * for the internet when the phone is offline.
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache(),
  mutationCache: new MutationCache(),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 7 * DAY,
      networkMode: "offlineFirst",
      retry: shouldRetry,
      retryDelay,
      refetchOnReconnect: true,
    },
    // Screens' own sends (post a doubt, an admin action) fail at once with their message, as before.
    // Only the queued writes wait for the internet (src/api/queued.ts).
    mutations: { retry: false, networkMode: "always" },
  },
});

let capping = false;
queryClient.getQueryCache().subscribe((e) => {
  if (e.type !== "added" || capping) return;
  capping = true;
  // After the add has finished: removing inside the event would run under the cache's own update.
  setTimeout(() => {
    capping = false;
    capCache(queryClient.getQueryCache());
  }, 0);
});

/**
 * The most the phone's cache copy may hold (characters of JSON). Android's storage
 * cannot read back one value over about 2 MB: a bigger copy was written but failed
 * to load at the next start, so the app opened on nothing. Over this size, the
 * oldest copies are left out (tab screens are kept first).
 */
export const PERSIST_MAX_CHARS = 1_500_000;

/** The copy to write: everything if it fits, else tab screens first and then the newest. */
export function fitCache(client: PersistedClient, max = PERSIST_MAX_CHARS): PersistedClient {
  const whole = JSON.stringify(client);
  if (whole.length <= max) return client;
  const queries = client.clientState.queries;
  const rest = whole.length - queries.reduce((n, q) => n + JSON.stringify(q).length + 1, 0);
  const order = [...queries].sort((a, b) => {
    const ra = a.queryKey.length === 1 ? 0 : 1;
    const rb = b.queryKey.length === 1 ? 0 : 1;
    return ra - rb || b.state.dataUpdatedAt - a.state.dataUpdatedAt;
  });
  let used = rest;
  const keep = new Set<(typeof queries)[number]>();
  for (const q of order) {
    const n = JSON.stringify(q).length + 1;
    if (used + n > max) continue;
    used += n;
    keep.add(q);
  }
  return { ...client, clientState: { ...client.clientState, queries: queries.filter((q) => keep.has(q)) } };
}

export const persister = createAsyncStoragePersister({ storage: AsyncStorage, key: "vibha.cache.v1", throttleTime: 1500, serialize: (c) => JSON.stringify(fitCache(c)) });
/** Keys that must never be written to the phone's cache. */
const NEVER_PERSIST = new Set(["stream", "checkpoint", "config", "game", "prepSet", "setup"]);
export const persistOptions = {
  persister,
  maxAge: 7 * DAY,
  // Copies saved by another build are dropped: their shape may be one this build's screens no longer read
  // (the version stays 1.0.0 across many uploads, so the build number is part of it).
  buster: `c3-${config.appVersion}-${config.appBuild}`,
  dehydrateOptions: {
    shouldDehydrateQuery: (q: { queryKey: readonly unknown[]; state: { status: string } }) => q.state.status === "success" && !NEVER_PERSIST.has(String(q.queryKey[0])),
    // Queued writes still waiting for the internet are kept on the phone and sent after a restart.
    shouldDehydrateMutation: (m: { options: { mutationKey?: readonly unknown[] }; state: { isPaused: boolean } }) => m.state.isPaused && m.options.mutationKey?.[0] === "write",
  },
};

configureOnline({
  probe: () => api.get("/config", { auth: false }),
  // Back online: send the waiting saves, and load again whatever could not load
  // (without cutting short a load that is already on its way).
  onBack: () => {
    void outbox.flush().catch(() => undefined);
    void queryClient.refetchQueries({ type: "active", predicate: (q) => q.state.status === "error" }, { cancelRefetch: false });
  },
});

onSignedOut(() => {
  api.forgetHeld();
  queryClient.clear();
  void persister.removeClient();
});

export const keys = {
  config: ["config"] as const,
  me: ["me"] as const,
  home: ["home"] as const,
  courses: ["courses"] as const,
  course: (id: string) => ["course", id] as const,
  lecture: (id: string) => ["lecture", id] as const,
  notifications: ["notifications"] as const,
  notification: (id: string) => ["notification", id] as const,
  prefs: ["prefs"] as const,
  settings: ["settings"] as const,
  doubts: (mine: boolean) => ["doubts", mine ? "mine" : "all"] as const,
  doubt: (id: string) => ["doubt", id] as const,
  study: ["study"] as const,
  module: (id: string) => ["module", id] as const,
  section: (m: string, s: string) => ["section", m, s] as const,
  learn: ["learn"] as const,
  checkpoint: (m: string, n: number) => ["checkpoint", m, n] as const,
  figure: (id: string) => ["figure", id] as const,
  progress: ["progress"] as const,
  achievements: ["achievements"] as const,
  verify: (id: string) => ["verify", id] as const,
  material: (id: string) => ["material", id] as const,
  admin: (part: string, arg = "") => ["admin", part, arg] as const,
};

/** Home, with today's quests (Home.quests). */
export type HomeData = C.Home;

/** The signed-in account. Every answer also refreshes the copy the session keeps. */
export const useMe = () =>
  useQuery({
    queryKey: keys.me,
    queryFn: async () => {
      const me = A.meView(await api.get<C.Me>("/me"));
      await session.setMe(me);
      return me;
    },
    initialData: () => session.store.get().me ?? undefined,
    initialDataUpdatedAt: 0,
  });
export const useConfig = () => useQuery(qo.config());

const enc = encodeURIComponent;
const MIN = 60_000;

/**
 * Every read as a ready-made query (key, how to load it, how long it stays
 * fresh), so a screen's hook and the prefetcher (src/api/prefetch.ts) ask
 * for exactly the same thing and the second ask is free.
 * Fresh for: the default 30 seconds for what changes as the student works
 * (Home, progress, Practise); minutes for course and module outlines and
 * reading (the screens that change them refresh them at once); an hour for
 * the medicine library. A screen that opens on a fresh copy does not call the server.
 */
export const qo = {
  config: () => queryOptions({ queryKey: keys.config, queryFn: () => api.get<C.AppConfig>("/config", { auth: false }), staleTime: 10 * MIN }),
  home: () => queryOptions({ queryKey: keys.home, queryFn: async () => K.homeView(await api.get<unknown>("/home")) }),
  courses: () => queryOptions({ queryKey: keys.courses, queryFn: async () => L.courseListView(await api.get<unknown>("/courses")), staleTime: 2 * MIN }),
  course: (id: string) => queryOptions({ queryKey: keys.course(id), queryFn: async () => L.courseDetailView(await api.get<unknown>(`/courses/${enc(id)}`)), enabled: id.length > 0, staleTime: 2 * MIN }),
  lecture: (id: string) => queryOptions({ queryKey: keys.lecture(id), queryFn: async () => K.lectureView(await api.get<unknown>(`/lectures/${enc(id)}`)) }),
  notifications: () => queryOptions({ queryKey: keys.notifications, queryFn: async () => L.notificationListView(await api.get<unknown>("/notifications", { query: { limit: 50 } })) }),
  notification: (id: string) => queryOptions({ queryKey: keys.notification(id), queryFn: async () => K.notificationDetailView(await api.get<unknown>(`/notifications/${enc(id)}`)) }),
  settings: () => queryOptions({ queryKey: keys.settings, queryFn: () => api.get<C.Settings>("/settings") }),
  doubts: (mine: boolean) => queryOptions({ queryKey: keys.doubts(mine), queryFn: async () => L.doubtListView(await api.get<unknown>("/doubts", { query: { mine: mine ? 1 : undefined, limit: 50 } })) }),
  doubt: (id: string) => queryOptions({ queryKey: keys.doubt(id), queryFn: async () => L.doubtThreadView(await api.get<unknown>(`/doubts/${enc(id)}`)) }),
  study: () => queryOptions({ queryKey: keys.study, queryFn: async () => L.studyHomeView(await api.get<unknown>("/study/modules")) }),
  module: (id: string) => queryOptions({ queryKey: keys.module(id), queryFn: async () => L.moduleDetailView(await api.get<unknown>(`/study/modules/${enc(id)}`)), staleTime: 5 * MIN }),
  section: (m: string, s: string) => queryOptions({ queryKey: keys.section(m, s), queryFn: async () => L.sectionContentView(await api.get<unknown>(`/study/modules/${enc(m)}/sections/${enc(s)}`)), staleTime: 10 * MIN }),
  learn: () => queryOptions({ queryKey: keys.learn, queryFn: () => api.get<C.LearnStateResult>("/study/state") }),
  progress: () => queryOptions({ queryKey: keys.progress, queryFn: async () => L.progressView(await api.get<unknown>("/progress")) }),
  achievements: () => queryOptions({ queryKey: keys.achievements, queryFn: async () => L.achievementsView(await api.get<unknown>("/achievements")) }),
  medicines: () => queryOptions({ queryKey: ["library", "medicines"] as const, queryFn: () => api.get<C.MedicineList>("/library/medicines"), staleTime: 60 * MIN }),
  material: (id: string) => queryOptions({ queryKey: keys.material(id), queryFn: () => api.get<C.Material>(`/materials/${enc(id)}`) }),
};

export const useHome = () => useQuery(qo.home());
export const useCourses = () => useQuery(qo.courses());
/** The same as qo.course (Search reads every course with useQueries). */
export const courseQuery = qo.course;
export const useCourse = (id: string) => useQuery(qo.course(id));
export const useLecture = (id: string) => useQuery(qo.lecture(id));
export const useNotifications = () => useQuery(qo.notifications());
export const useNotification = (id: string) => useQuery(qo.notification(id));
export const useSettings = () => useQuery(qo.settings());
export const useDoubts = (mine: boolean) => useQuery(qo.doubts(mine));
export const useDoubt = (id: string) => useQuery(qo.doubt(id));
export const useStudyHome = (enabled = true) => useQuery({ ...qo.study(), enabled });
export const useModule = (id: string) => useQuery(qo.module(id));
export const useSection = (m: string, s: string) => useQuery(qo.section(m, s));
export const useLearnState = () => useQuery(qo.learn());
export const useCheckpoint = (m: string, n: number) => useQuery({ queryKey: keys.checkpoint(m, n), queryFn: () => api.get<C.CheckpointContent>(`/study/modules/${enc(m)}/checkpoints/${n}`), staleTime: 0, gcTime: 0 });
export const useFigure = (id: string) => useQuery({ queryKey: keys.figure(id), queryFn: () => api.get<C.Figure>(`/study/figures/${enc(id)}`), staleTime: 24 * 60 * MIN });
export const useProgress = () => useQuery(qo.progress());
export const useAchievements = () => useQuery(qo.achievements());
/** The medicine library as the contract has it (GET /library/medicines): search uses it. */
export const useLibraryMedicines = (enabled = true) => useQuery({ ...qo.medicines(), enabled });
export const useMaterial = (id: string) => useQuery(qo.material(id));
export const useVerify = (id: string) => useQuery({ queryKey: keys.verify(id), queryFn: () => api.get<C.CertificateVerification>(`/public/certificates/${enc(id)}`, { auth: false }), enabled: id.length > 0 });

/* Practise, Exam Prep and the Library read the server's own routes from src/practise (src/practise/contract.ts). */

export { useMutation, useQueryClient };
export type { UseQueryResult };
