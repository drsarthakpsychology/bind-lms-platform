/**
 * The single source of truth for every file format the app handles.
 *
 * Round-13 rule: a format is only `accepted` at upload if a working path
 * exists for it end-to-end. For course materials that means a renderer for its
 * kind (enforced by registry.test.ts). For assignment submissions it means a
 * student can actually submit that type. Never add a format here without its
 * working path — a list with holes is what caused the pptx dead-end.
 *
 * Everything that lists formats reads from this module: the material uploader's
 * accept list, the assignment editor's accepted-type selector, the server-side
 * validation, and the viewer's kind switch.
 */

/** Material kinds with a working renderer in the viewer. */
export type MediaKind = "document" | "audio" | "image" | "link";

export type MaterialFormatSpec = {
  ext: string;
  mimeTypes: string[];
  kind: MediaKind;
  maxBytes: number;
  /** A format is only accepted if a renderer exists for its kind. */
  accepted: boolean;
  /** Shown to the admin at upload time when accepted is false. */
  rejectionReason?: string;
};

export const MATERIAL_FORMATS: Record<string, MaterialFormatSpec> = {
  pdf: {
    ext: "pdf",
    mimeTypes: ["application/pdf"],
    kind: "document",
    maxBytes: 100 * 1024 * 1024,
    accepted: true,
  },
  mp3: {
    ext: "mp3",
    mimeTypes: ["audio/mpeg"],
    kind: "audio",
    maxBytes: 100 * 1024 * 1024,
    accepted: true,
  },
  m4a: {
    ext: "m4a",
    mimeTypes: ["audio/mp4", "audio/x-m4a", "audio/mp4a-latm"],
    kind: "audio",
    maxBytes: 100 * 1024 * 1024,
    accepted: true,
  },
  wav: {
    ext: "wav",
    mimeTypes: ["audio/wav", "audio/wave", "audio/x-wav"],
    kind: "audio",
    maxBytes: 100 * 1024 * 1024,
    accepted: true,
  },
  png: {
    ext: "png",
    mimeTypes: ["image/png"],
    kind: "image",
    maxBytes: 100 * 1024 * 1024,
    accepted: true,
  },
  jpg: {
    ext: "jpg",
    mimeTypes: ["image/jpeg"],
    kind: "image",
    maxBytes: 100 * 1024 * 1024,
    accepted: true,
  },
  jpeg: {
    ext: "jpeg",
    mimeTypes: ["image/jpeg"],
    kind: "image",
    maxBytes: 100 * 1024 * 1024,
    accepted: true,
  },
  webp: {
    ext: "webp",
    mimeTypes: ["image/webp"],
    kind: "image",
    maxBytes: 100 * 1024 * 1024,
    accepted: true,
  },
  // In-browser PPTX renderer (pptx-preview) added in round 14 — decks now
  // preview through the same download-blocked proxy as everything else.
  // Note: the old `.ppt` binary format has no browser renderer; only .pptx.
  ppt: {
    ext: "ppt",
    mimeTypes: ["application/vnd.ms-powerpoint"],
    kind: "document",
    maxBytes: 100 * 1024 * 1024,
    accepted: false,
    rejectionReason:
      "Legacy .ppt files can't be previewed in the browser. Save the deck as .pptx (or PDF) and upload that instead.",
  },
  pptx: {
    ext: "pptx",
    mimeTypes: [
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/zip",
    ],
    kind: "document",
    maxBytes: 100 * 1024 * 1024,
    accepted: true,
  },
};

/**
 * Material kinds that have a working renderer in the viewer. Keyed by kind:
 * the viewer renders a whole kind. `document` renders PDFs (pdf.js canvas);
 * PPT/PPTX are rejected because the specific format has no renderer even
 * though its broad kind (`document`) does — that nuance lives in
 * MATERIAL_FORMATS[ext].accepted, not here.
 */
export const materialRenderers: Record<MediaKind, boolean> = {
  document: true, // pdf.js canvas renderer (PDF only)
  audio: true,
  image: true,
  link: true,
};

/** Whether a specific extension has a working renderer. ppt/pptx: no. */
export function hasFormatRenderer(ext: string): boolean {
  const spec = MATERIAL_FORMATS[ext];
  if (!spec) return false;
  if (!spec.accepted) return false;
  return materialRenderers[spec.kind] === true;
}

/** Assignment submission types with a working student path. */
export type SubmissionType = "text" | "audio" | "pdf" | "docx";

export const SUBMISSION_TYPES: Record<
  SubmissionType,
  { label: string; accepted: boolean }
> = {
  text: { label: "Text", accepted: true },
  audio: { label: "Audio recording", accepted: true },
  pdf: { label: "PDF", accepted: true },
  docx: { label: "DOCX", accepted: true },
};

/** Formats a student can attach to a file submission (accepted submission types). */
export const SUBMISSION_ATTACH_EXTENSIONS: Record<string, string[]> = {
  pdf: ["application/pdf"],
  docx: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
  ],
};

/** Selectable options for the assignment editor + lesson form — accepted types only. */
export const SUBMISSION_TYPE_OPTIONS: Array<{ value: SubmissionType; label: string }> = (
  Object.entries(SUBMISSION_TYPES) as Array<[SubmissionType, { label: string; accepted: boolean }]>
)
  .filter(([, spec]) => spec.accepted)
  .map(([value, spec]) => ({ value, label: spec.label }));

/** Canonical comma-joined submission_type string (e.g. "text,audio,pdf,docx"). */
export const SUBMISSION_TYPE_CSV = SUBMISSION_TYPE_OPTIONS.map((o) => o.value).join(",");

/** Canonical accepted_formats default. */
export const DEFAULT_ACCEPTED_FORMATS = SUBMISSION_TYPE_OPTIONS.map((o) => o.value);

export const MAX_MATERIAL_SIZE_BYTES = 100 * 1024 * 1024;
export const MAX_MATERIAL_SIZE_MB = 100;

export function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot >= 0 ? fileName.slice(dot + 1).toLowerCase() : "";
}
