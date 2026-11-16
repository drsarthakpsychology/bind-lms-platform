import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { MutationCache, QueryCache, QueryClient, queryOptions, useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";

import { api, onSignedOut, session } from "@/auth";
import { config } from "@/lib/config";
import type * as C from "./contract";
import * as A from "./adapt";
import * as K from "./adapt-core";
import * as L from "./adapt-learn";
import { ApiFailure } from "./errors";
import { configureOnline, markOffline, markOnline } from "./online";

/** A call that could not reach the server marks the phone offline; any answer marks it online. */
const follow = {
  onError: (e: unknown) => {
    if (e instanceof ApiFailure && e.code === "network") markOffline();
    else if (e instanceof ApiFailure && e.status > 0) markOnline();
  },
  onSuccess: () => markOnline(),
};

/**
 * Server data. TanStack Query keeps a copy of every answer, shows it at once
 * the next time the screen opens, and refreshes it quietly. The copy is kept
 * on the phone between launches (24 hours) and wiped on sign-out. Video
 * addresses and test questions are never kept.
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache(follow),
  mutationCache: new MutationCache(follow),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: (count, error) => {
        if (error instanceof ApiFailure && error.code !== "network" && error.code !== "server_error" && error.code !== "rate_limited") return false;
        // One retry, then the error shows with Try again (the student is not kept on a skeleton).
        return count < 1;
      },
      refetchOnReconnect: true,
    },
    mutations: { retry: false },
  },
});

export const persister = createAsyncStoragePersister({ storage: AsyncStorage, key: "vibha.cache.v1", throttleTime: 1500 });
/** Keys that must never be written to the phone's cache. */
const NEVER_PERSIST = new Set(["stream", "checkpoint", "config", "game", "prepSet", "setup"]);
export const persistOptions = {
  persister,
  maxAge: 24 * 60 * 60 * 1000,
  // Copies saved by another build are dropped: their shape may be one this build's screens no longer read
  // (the version stays 1.0.0 across many uploads, so the build number is part of it).
  buster: `c3-${config.appVersion}-${config.appBuild}`,
  dehydrateOptions: { shouldDehydrateQuery: (q: { queryKey: readonly unknown[]; state: { status: string } }) => q.state.status === "success" && !NEVER_PERSIST.has(String(q.queryKey[0])) },
};

configureOnline({
  probe: () => api.get("/config", { auth: false }),
  // Back online: load again whatever could not load.
  onBack: () => void queryClient.refetchQueries({ type: "active", predicate: (q) => q.state.status === "error" }),
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
