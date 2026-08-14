import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { cleanMaterialTitle } from "@/lib/media/title";
import { MaterialViewer } from "./viewer";

/**
 * Dedicated material viewer — `/courses/:courseId/materials/:materialId`.
 *
 * Full-height, minimal chrome. The content type (PDF/audio/image/slides/link)
 * picks the client viewer. Header carries the material title, a back link, and
 * prev/next navigation through the same course's materials.
 */
export default async function MaterialViewerPage({
  params,
}: {
  params: Promise<{ courseId: string; materialId: string }>;
}) {
  const { courseId, materialId } = await params;
  const session = await getSession();
  if (session.status !== "ok") return null;
  const { profile } = session;

  const supabase = await createClient();

  // Forensic watermark label — the viewer's own identity, so any screenshot of
  // the material is traceable to the account that took it.
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const watermarkLabel = `${profile.email ?? "unknown"} · ${profile.id.slice(0, 8)} · ${ip}`;

  const [{ data: material }, { data: allCourseMaterials }] = await Promise.all([
    supabase
      .from("materials")
      .select("id, course_id, lesson_id, title, kind, format, size_bytes, url, lessons(title)")
      .eq("id", materialId)
      .single(),
    supabase
      .from("materials")
      .select("id, title, kind, lesson_id")
      .eq("course_id", courseId)
      .order("sort_order", { ascending: true }),
  ]);

  if (!material) notFound();

  // Guard: the material must belong to this course.
  if (material.course_id !== courseId) notFound();

  const ordered = allCourseMaterials ?? [];
  const idx = ordered.findIndex((m) => m.id === materialId);
  const prev = idx > 0 ? ordered[idx - 1] : null;
  const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;

  const lesson = Array.isArray(material.lessons) ? material.lessons[0] : material.lessons;
  // Back target: the lesson that owns this material, else the course page.
  const backHref = material.lesson_id
    ? `/courses/${courseId}/lessons/${material.lesson_id}?tab=materials`
    : `/courses/${courseId}`;
  const backLabel = material.lesson_id
    ? (lesson?.title ?? "Lesson")
    : "Course materials";

  return (
    <div className="flex h-full min-h-[calc(100vh-3.5rem)] flex-col">
      {/* Minimal header */}
      <header className="flex items-center justify-between gap-2 border-b-2 border-border bg-card px-3 py-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href={backHref}
            aria-label={`Back to ${backLabel}`}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border-2 border-border bg-background px-2 text-sm font-medium text-foreground transition-[transform,box-shadow] hover:bg-accent active:translate-y-px sm:px-2.5"
          >
            <ChevronLeft className="size-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">{backLabel}</span>
          </Link>
          <span className="min-w-0 flex-1 truncate text-small font-semibold text-foreground">
            {cleanMaterialTitle(material.title)}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {prev && (
            <Link
              href={`/courses/${courseId}/materials/${prev.id}`}
              className="inline-flex h-9 items-center gap-1 rounded-md border-2 border-border bg-background px-2.5 text-sm font-medium text-foreground transition-[transform,box-shadow] hover:bg-accent active:translate-y-px"
              aria-label={`Previous: ${prev.title}`}
              title={prev.title}
            >
              <ArrowLeft className="size-4" aria-hidden />
            </Link>
          )}
          {next && (
            <Link
              href={`/courses/${courseId}/materials/${next.id}`}
              className="inline-flex h-9 items-center gap-1 rounded-md border-2 border-border bg-background px-2.5 text-sm font-medium text-foreground transition-[transform,box-shadow] hover:bg-accent active:translate-y-px"
              aria-label={`Next: ${next.title}`}
              title={next.title}
            >
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          )}
        </div>
      </header>

      {/* Full-height content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <MaterialViewer
          materialId={material.id}
          courseId={courseId}
          kind={material.kind}
          url={material.url}
          title={cleanMaterialTitle(material.title)}
          watermarkLabel={watermarkLabel}
        />
      </div>
    </div>
  );
}
