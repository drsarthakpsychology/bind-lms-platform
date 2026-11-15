import { File, UploadTask, UploadType } from "expo-file-system";

import type { PrepareUploadResult, SubmitResult } from "@/api/contract";
import { ApiFailure } from "@/api/errors";
import { api } from "@/auth";

/**
 * Handing in an assignment as files or as a recording, the contract's way
 * (docs/app/API_CONTRACT.md, section 2.6): ask for an upload place per file
 * (POST .../uploads), PUT the raw bytes there with the headers given, then
 * hand in every path in one call (POST .../files, or .../audio for a
 * recording). Only paths the server made for this student are accepted.
 */

/** File-type groups the admin can allow, as the phone's file picker understands them. */
const MIME: Record<string, string[]> = {
  pdf: ["application/pdf"],
  docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  doc: ["application/msword"],
  word: ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  pptx: ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  xlsx: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  image: ["image/*"],
  audio: ["audio/*"],
  video: ["video/*"],
  txt: ["text/plain"],
};

export function mimeTypesFor(accepted: string[]): string[] {
  if (!accepted.length) return ["*/*"];
  const out = accepted.flatMap((a) => MIME[a.toLowerCase()] ?? []);
  return out.length ? [...new Set(out)] : ["*/*"];
}

const EXT: Record<string, string[]> = { pdf: ["pdf"], docx: ["docx"], doc: ["doc"], word: ["doc", "docx"], pptx: ["pptx"], xlsx: ["xlsx"], image: ["png", "jpg", "jpeg", "heic", "webp"], audio: ["m4a", "mp3", "aac", "wav", "ogg"], video: ["mp4", "mov"], txt: ["txt"] };

export type Picked = { uri: string; name: string; size: number | null };

/** Checks a picked file against the assignment's rules; a sentence to show, or null when fine. */
export function checkFile(f: Picked, rules: { maxFileMb: number; acceptedFormats: string[] }): string | null {
  if (f.size !== null && f.size > rules.maxFileMb * 1024 * 1024) return `${f.name} is bigger than ${rules.maxFileMb} MB.`;
  if (rules.acceptedFormats.length) {
    const ext = (f.name.split(".").pop() ?? "").toLowerCase();
    const ok = rules.acceptedFormats.some((a) => (EXT[a.toLowerCase()] ?? [a.toLowerCase()]).includes(ext));
    if (!ok) return `${f.name} is not a file type this assignment takes (${rules.acceptedFormats.join(", ")}).`;
  }
  return null;
}

/** Sends one file's bytes to the place the server gave. */
async function put(uri: string, prep: PrepareUploadResult): Promise<void> {
  if (prep.uploadUrl.startsWith("mock://")) return; // the app's mock server: nothing to send
  const task = new UploadTask(new File(uri), prep.uploadUrl, { httpMethod: "PUT", uploadType: UploadType.BINARY_CONTENT, headers: prep.headers });
  const res = await task.uploadAsync();
  if (res.status < 200 || res.status >= 300) throw new ApiFailure("server_error", "A file could not be sent. Try again.", res.status);
}

export async function handInFiles(assignmentId: string, files: Picked[], note: string, onProgress?: (done: number, total: number) => void): Promise<SubmitResult> {
  const id = encodeURIComponent(assignmentId);
  const sent: { path: string; name: string }[] = [];
  for (const [i, f] of files.entries()) {
    onProgress?.(i, files.length);
    const prep = await api.post<PrepareUploadResult>(`/assignments/${id}/uploads`, { fileName: f.name });
    await put(f.uri, prep);
    sent.push({ path: prep.path, name: f.name });
  }
  onProgress?.(files.length, files.length);
  return api.post<SubmitResult>(`/assignments/${id}/files`, { note: note.trim() || undefined, files: sent });
}

export async function handInRecording(assignmentId: string, uri: string): Promise<SubmitResult> {
  const id = encodeURIComponent(assignmentId);
  const name = `recording-${new Date().toISOString().slice(0, 10)}.${uri.split(".").pop() || "m4a"}`;
  const prep = await api.post<PrepareUploadResult>(`/assignments/${id}/uploads`, { fileName: name });
  await put(uri, prep);
  return api.post<SubmitResult>(`/assignments/${id}/audio`, { path: prep.path });
}
