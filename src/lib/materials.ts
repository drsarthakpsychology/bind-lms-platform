/**
 * Materials validation — thin wrapper over the media registry.
 *
 * The registry (src/lib/media/registry.ts) is the single source of truth for
 * which formats are accepted and what they map to. This file keeps the
 * `validateMaterialFile` API the uploaders call, now backed by the registry so
 * the allowlist and the renderer set can't drift.
 */

import {
  MATERIAL_FORMATS,
  MAX_MATERIAL_SIZE_BYTES,
  MAX_MATERIAL_SIZE_MB,
  getExtension,
  type MediaKind,
} from "@/lib/media/registry";

export { MATERIAL_FORMATS, MAX_MATERIAL_SIZE_BYTES, MAX_MATERIAL_SIZE_MB };

export type MaterialValidation = {
  ok: boolean;
  error?: string;
  kind?: MediaKind;
  format?: string;
};

/**
 * Validate a file's name + size against the registry allowlist and cap. Used by
 * both the client (before upload, for instant feedback) and the server
 * (authoritative).
 */
export function validateMaterialFile(
  fileName: string,
  sizeBytes: number,
  maxBytes = MAX_MATERIAL_SIZE_BYTES,
): MaterialValidation {
  const ext = getExtension(fileName);
  const spec = MATERIAL_FORMATS[ext];

  if (!spec || !spec.accepted) {
    return {
      ok: false,
      error:
        spec?.rejectionReason ??
        `"${fileName}" isn't a supported file type. Upload a PDF, audio recording, or image.`,
    };
  }

  if (sizeBytes > maxBytes) {
    const mb = maxBytes / (1024 * 1024);
    return {
      ok: false,
      error: `${fileName} is ${(sizeBytes / (1024 * 1024)).toFixed(0)} MB. The limit is ${mb} MB.`,
    };
  }

  return { ok: true, kind: spec.kind, format: ext };
}
