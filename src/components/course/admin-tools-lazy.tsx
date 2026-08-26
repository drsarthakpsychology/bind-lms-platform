"use client";

import dynamic from "next/dynamic";

/**
 * Lazy wrappers for the admin course-authoring editors. The student lesson
 * route statically imported AssignmentEditor + MaterialUploader, pulling the
 * admin authoring bundle into every student's JS. These dynamic (ssr:false)
 * wrappers keep that chunk out of the eager bundle — it only fetches when an
 * admin actually views the lesson's assignment/material tabs (Part 5).
 */
export const LazyAssignmentEditor = dynamic(
  () =>
    import("@/app/(dashboard)/admin/courses/[courseId]/assignment-editor").then(
      (m) => m.AssignmentEditor,
    ),
  { ssr: false },
);

export const LazyMaterialUploader = dynamic(
  () =>
    import("@/app/(dashboard)/admin/courses/[courseId]/material-uploader").then(
      (m) => m.MaterialUploader,
    ),
  { ssr: false },
);
