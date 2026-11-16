import { useQuery } from "@tanstack/react-query";

import { api } from "@/auth";
import * as L from "./adapt-learn";
import type * as C from "./contract";

/**
 * The learning map (the website's /study/map) and the class wall (/wall).
 * Answers are read through src/api/adapt-learn.ts.
 */
export const mapWallKeys = {
  map: ["study-map"] as const,
  round: (topic: string | null, n: number) => ["map-round", topic ?? "", n] as const,
  wall: ["wall"] as const,
};

export const useStudyMap = () => useQuery({ queryKey: mapWallKeys.map, queryFn: async () => L.studyMapView(await api.get<unknown>("/study/map")) });
/** `n` makes "Another round" a fresh round. Rounds are never refetched in the background (that would swap the questions mid-round). */
export const useMapRound = (topic: string | null, n: number) =>
  useQuery({ queryKey: mapWallKeys.round(topic, n), queryFn: async () => L.mapPracticeView(await api.get<unknown>("/study/map/practice", { query: { topic: topic ?? undefined } })), staleTime: Infinity, gcTime: 0, refetchOnWindowFocus: false, refetchOnReconnect: false });
export const answerMap = (body: C.MapAnswerBody) => api.post<C.MapAnswerResult>("/study/map/practice/answers", body);

export const useWall = () => useQuery({ queryKey: mapWallKeys.wall, queryFn: async () => L.wallFeedView(await api.get<unknown>("/wall")) });
export const wallApi = {
  post: (body: C.WallWriteBody) => api.post<C.WallWriteResult>("/wall/posts", body),
  reply: (postId: string, body: C.WallWriteBody) => api.post<C.WallWriteResult>(`/wall/posts/${encodeURIComponent(postId)}/replies`, body),
  react: (body: C.WallReactBody) => api.post<C.WallReactResult>("/wall/reactions", body),
  report: (body: C.WallReportBody) => api.post<{ reported: true }>("/wall/reports", body),
};
