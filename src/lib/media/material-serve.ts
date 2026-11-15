import "server-only";
import type { Profile } from "@/lib/auth/session";
import { streamFile, contentTypeForKind, type StreamedFile } from "@/lib/media/deliver";
import { getMaterialStreamVerdict, setMaterialStreamVerdict, type MaterialStreamVerdict } from "@/lib/media/material-stream-cache";

/**
 * Authorise and stream one course material for a signed-in caller. Shared by
 * the website's GET /api/media/materials/:id and the mobile app's
 * GET /api/app/v1/materials/:id/file. Callers do their own sign-in, origin and
 * rate-limit checks first.
 */
export type MaterialServed = { ok: true; file: StreamedFile } | { ok: false; status: number; error: string };

export async function serveMaterial(profile: NonNullable<Profile>, materialId: string, range: string | null): Promise<MaterialServed> {
  // Hot path: one combined authz + resolution read per (viewer, material),
  // cached for 5 minutes: the video proxy's verdict-cache pattern.
  let verdict = getMaterialStreamVerdict(profile.id, materialId);
  if (!verdict) {
    verdict = await resolveMaterial(profile, materialId);
    setMaterialStreamVerdict(profile.id, materialId, verdict);
  }

  if (!verdict.ok) {
    return { ok: false, status: verdict.status ?? 403, error: verdict.reason };
  }

  const contentType = contentTypeForKind(verdict.file.kind, verdict.file.format);
  const file = await streamFile(verdict.file.provider, verdict.file.bucket, verdict.file.storage_path, range, contentType);
  if (!file) {
    return { ok: false, status: 404, error: "This material couldn't be loaded." };
  }
  return { ok: true, file };
}

/** The material row the checks read (also what the app's material screen shows). */
export type MaterialRow = {
  id: string;
  title: string | null;
  kind: string;
  format: string | null;
  size_bytes: number | null;
  url: string | null;
  storage_path: string | null;
  provider: string | null;
  bucket: string | null;
  course_id: string;
  lesson_id: string | null;
  week: number | null;
};

/**
 * May this person open this material? One read for the row (with its course
 * embed), plus an enrollment check for non-admins and the cohort rule.
 * Answers the row, so callers need no second read.
 */
export async function checkMaterial(
  profile: NonNullable<Profile>,
  materialId: string,
): Promise<{ ok: true; material: MaterialRow } | { ok: false; reason: string; status?: number }> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: material } = await supabase
    .from("materials")
    .select("id, title, kind, format, size_bytes, url, storage_path, provider, bucket, course_id, lesson_id, week, courses!inner(is_published)")
    .eq("id", materialId)
    .single();

  if (!material) return { ok: false, reason: "Material not found.", status: 404 };

  if (profile.role !== "admin") {
    const course = Array.isArray(material.courses) ? material.courses[0] : material.courses;
    if (!course?.is_published) return { ok: false, reason: "This course isn't published." };

    const { data: enrollment } = await supabase
      .from("course_enrollments")
      .select("course_id")
      .eq("user_id", profile.id)
      .eq("course_id", material.course_id)
      .maybeSingle();
    if (!enrollment) return { ok: false, reason: "You aren't enrolled in this course." };

    // Cohorts: a material on a lecture shared with other cohorts only is not
    // for this person (people in no cohort keep the enrolment rule above).
    if (material.lesson_id) {
      const { loadStudentAccess } = await import("@/lib/cohorts/access");
      const { canWatch } = await import("@/lib/cohorts/rules");
      if (!canWatch(await loadStudentAccess(profile.id), material.lesson_id as string, true)) {
        return { ok: false, reason: "This material isn't part of your lectures." };
      }
    }
  }
  const { courses: _course, ...row } = material as typeof material & { courses: unknown };
  void _course;
  return { ok: true, material: row as unknown as MaterialRow };
}

/** The verdict the byte stream is cached on. */
export async function resolveMaterial(
  profile: NonNullable<Profile>,
  materialId: string,
): Promise<MaterialStreamVerdict> {
  const checked = await checkMaterial(profile, materialId);
  if (!checked.ok) return { ok: false, reason: checked.reason, ...(checked.status === 404 ? {} : checked.status ? { status: checked.status } : {}) };
  const material = checked.material;

  if (material.kind === "link" || !material.storage_path) {
    return { ok: false, reason: "This material has no file.", status: 404 };
  }

  return {
    ok: true,
    file: {
      kind: material.kind,
      format: material.format,
      storage_path: material.storage_path,
      provider: material.provider === "r2" ? "r2" : "supabase",
      bucket: material.bucket ?? "materials",
    },
  };
}
