import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient, useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";

import { api, onSignedOut, session } from "@/auth";
import type * as C from "./contract";
import * as A from "./adapt";
import { ApiFailure } from "./errors";

/**
 * Server data. TanStack Query keeps a copy of every answer, shows it at once
 * the next time the screen opens, and refreshes it quietly. The copy is kept
 * on the phone between launches (24 hours) and wiped on sign-out. Video
 * addresses and test questions are never kept.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: (count, error) => {
        if (error instanceof ApiFailure && error.code !== "network" && error.code !== "server_error" && error.code !== "rate_limited") return false;
        return count < 2;
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
  // Bumped: copies saved before the admin answers were adapted must not come back.
  buster: "c2",
  dehydrateOptions: { shouldDehydrateQuery: (q: { queryKey: readonly unknown[]; state: { status: string } }) => q.state.status === "success" && !NEVER_PERSIST.has(String(q.queryKey[0])) },
};

onSignedOut(() => {
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
export const useConfig = () => useQuery({ queryKey: keys.config, queryFn: () => api.get<C.AppConfig>("/config", { auth: false }), staleTime: 10 * 60_000 });
export const useHome = () => useQuery({ queryKey: keys.home, queryFn: () => api.get<HomeData>("/home") });
export const useCourses = () => useQuery({ queryKey: keys.courses, queryFn: () => api.get<C.CourseList>("/courses") });
export const useCourse = (id: string) => useQuery({ queryKey: keys.course(id), queryFn: () => api.get<C.CourseDetail>(`/courses/${encodeURIComponent(id)}`), enabled: id.length > 0 });
export const useLecture = (id: string) => useQuery({ queryKey: keys.lecture(id), queryFn: () => api.get<C.LectureDetail>(`/lectures/${encodeURIComponent(id)}`) });
export const useNotifications = () => useQuery({ queryKey: keys.notifications, queryFn: () => api.get<C.NotificationList>("/notifications", { query: { limit: 50 } }) });
export const useNotification = (id: string) => useQuery({ queryKey: keys.notification(id), queryFn: () => api.get<C.NotificationDetail>(`/notifications/${encodeURIComponent(id)}`) });
export const useSettings = () => useQuery({ queryKey: keys.settings, queryFn: () => api.get<C.Settings>("/settings") });
export const useDoubts = (mine: boolean) => useQuery({ queryKey: keys.doubts(mine), queryFn: () => api.get<C.DoubtList>("/doubts", { query: { mine: mine ? 1 : undefined, limit: 50 } }) });
export const useDoubt = (id: string) => useQuery({ queryKey: keys.doubt(id), queryFn: () => api.get<C.DoubtThread>(`/doubts/${encodeURIComponent(id)}`) });
export const useStudyHome = () => useQuery({ queryKey: keys.study, queryFn: () => api.get<C.StudyHome>("/study/modules") });
export const useModule = (id: string) => useQuery({ queryKey: keys.module(id), queryFn: () => api.get<C.ModuleDetail>(`/study/modules/${encodeURIComponent(id)}`) });
export const useSection = (m: string, s: string) => useQuery({ queryKey: keys.section(m, s), queryFn: () => api.get<C.SectionContent>(`/study/modules/${encodeURIComponent(m)}/sections/${encodeURIComponent(s)}`), staleTime: 10 * 60_000 });
export const useLearnState = () => useQuery({ queryKey: keys.learn, queryFn: () => api.get<C.LearnStateResult>("/study/state") });
export const useCheckpoint = (m: string, n: number) => useQuery({ queryKey: keys.checkpoint(m, n), queryFn: () => api.get<C.CheckpointContent>(`/study/modules/${encodeURIComponent(m)}/checkpoints/${n}`), staleTime: 0, gcTime: 0 });
export const useFigure = (id: string) => useQuery({ queryKey: keys.figure(id), queryFn: () => api.get<C.Figure>(`/study/figures/${encodeURIComponent(id)}`), staleTime: 24 * 60 * 60_000 });
export const useProgress = () => useQuery({ queryKey: keys.progress, queryFn: () => api.get<C.Progress>("/progress") });
export const useAchievements = () => useQuery({ queryKey: keys.achievements, queryFn: () => api.get<C.Achievements>("/achievements") });
/** The medicine library as the contract has it (GET /library/medicines): search uses it. */
export const useLibraryMedicines = (enabled = true) => useQuery({ queryKey: ["library", "medicines"] as const, queryFn: () => api.get<C.MedicineList>("/library/medicines"), staleTime: 60 * 60_000, enabled });
export const useMaterial = (id: string) => useQuery({ queryKey: keys.material(id), queryFn: () => api.get<C.Material>(`/materials/${encodeURIComponent(id)}`) });
export const useVerify = (id: string) => useQuery({ queryKey: keys.verify(id), queryFn: () => api.get<C.CertificateVerification>(`/public/certificates/${encodeURIComponent(id)}`, { auth: false }), enabled: id.length > 0 });

/* Practise, Exam Prep and the Library read the server's own routes from src/practise (src/practise/contract.ts). */
export const useAdminHome = () => useQuery({ queryKey: keys.admin("home"), queryFn: async () => A.adminHomeView(await api.get<unknown>("/admin/home")) });
// The server reads `search`; the mock reads `q`. Both are sent.
export const useAdminStudents = (q: string) => useQuery({ queryKey: keys.admin("students", q), queryFn: async () => A.adminStudentsView(await api.get<unknown>("/admin/students", { query: { search: q, q } })), placeholderData: (prev) => prev });
export const useAdminStudent = (id: string) => useQuery({ queryKey: keys.admin("student", id), queryFn: async () => A.adminStudentView(await api.get<unknown>(`/admin/students/${encodeURIComponent(id)}`)) });
export const useAdminActivity = () => useQuery({ queryKey: keys.admin("activity"), queryFn: async () => A.adminActivityView(await api.get<unknown>("/admin/activity")) });
export const useAdminMessages = () => useQuery({ queryKey: keys.admin("messages"), queryFn: async () => A.adminMessagesView(await api.get<unknown>("/admin/messages")) });

export { useMutation, useQueryClient };
export type { UseQueryResult };
