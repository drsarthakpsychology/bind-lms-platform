/**
 * Submission files live in the private `submissions` bucket under
 * `<assignmentId>/<userId>/<timestamp>-<safeName>` (see prepareSubmissionUpload).
 * The server only ever accepts, records or signs a path under the caller's own
 * prefix, so a student cannot attach (and then get a signed URL for) another
 * student's file.
 */
export function submissionPrefix(assignmentId: string, userId: string): string {
  return `${assignmentId}/${userId}/`;
}

export function isOwnSubmissionPath(path: unknown, assignmentId: string, userId: string): path is string {
  if (typeof path !== "string" || !assignmentId || !userId) return false;
  if (path.length > 512 || path.includes("..") || path.includes("\\") || path.includes("//")) return false;
  for (let i = 0; i < path.length; i++) if (path.charCodeAt(i) < 32) return false;
  const prefix = submissionPrefix(assignmentId, userId);
  return path.startsWith(prefix) && path.length > prefix.length && !path.slice(prefix.length).includes("/");
}
