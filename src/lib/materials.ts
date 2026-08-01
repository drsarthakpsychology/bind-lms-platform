/**
 * Materials validation rules — shared by client (for instant feedback) and
 * server (the authoritative gate). Keeping them in one module means the two
 * can't drift apart.
 */

/** Hard cap per file. The brief starts at 100 MB and makes it configurable. */
export const MAX_MATERIAL_SIZE_BYTES = 100 * 1024 * 1024;
export const MAX_MATERIAL_SIZE_MB = 100;

/** Extension → kind mapping for the format allowlist. */
export const MATERIAL_EXTENSIONS: Record<string, "document" | "slides" | "audio" | "image"> = {
  pdf: "document",
  ppt: "slides",
  pptx: "slides",
  mp3: "audio",
  m4a: "audio",
  wav: "audio",
  png: "image",
  jpg: "image",
  jpeg: "image",
  webp: "image",
};

/** Recognised MIME types per extension (used by the server allowlist). */
export const MATERIAL_MIME_TYPES: Record<string, string[]> = {
  pdf: ["application/pdf"],
  ppt: ["application/vnd.ms-powerpoint"],
  pptx: [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
  ],
  mp3: ["audio/mpeg"],
  m4a: ["audio/mp4", "audio/x-m4a", "audio/mp4a-latm"],
  wav: ["audio/wav", "audio/wave", "audio/x-wav"],
  png: ["image/png"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  webp: ["image/webp"],
};

export function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot >= 0 ? fileName.slice(dot + 1).toLowerCase() : "";
}

export type MaterialValidation = {
  ok: boolean;
  error?: string;
  kind?: "document" | "slides" | "audio" | "image";
  format?: string;
};

/**
 * Validate a file's name + size against the allowlist and cap. Used by both
 * the client (before upload, for instant feedback) and the server (authoritative).
 */
export function validateMaterialFile(
  fileName: string,
  sizeBytes: number,
  maxBytes = MAX_MATERIAL_SIZE_BYTES,
): MaterialValidation {
  const ext = getExtension(fileName);
  const kind = MATERIAL_EXTENSIONS[ext];

  if (!kind) {
    return {
      ok: false,
      error: `"${fileName}" isn't a supported file type. Upload a PDF, slide deck, audio recording, or image.`,
    };
  }

  if (sizeBytes > maxBytes) {
    const mb = maxBytes / (1024 * 1024);
    return {
      ok: false,
      error: `${fileName} is ${(sizeBytes / (1024 * 1024)).toFixed(0)} MB. The limit is ${mb} MB.`,
    };
  }

  return { ok: true, kind, format: ext };
}
