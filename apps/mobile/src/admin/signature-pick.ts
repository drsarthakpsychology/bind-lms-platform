import * as ImagePicker from "expo-image-picker";

/**
 * Pick a signature image from the phone's photos for certificates. The system
 * photo picker needs no storage permission on Android; the camera is never
 * used (blocked in app.config.ts). The server takes a PNG or JPEG data URL of
 * up to 2 MB (POST /admin/certificates/signatures).
 */
export const SIGNATURE_MAX_BYTES = 2 * 1024 * 1024;

export type PickedSignature = { dataUrl: string; uri: string } | { error: string } | null;

/** Bytes in a base64 string, without decoding it. */
export function base64Bytes(b64: string): number {
  const pad = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.floor((b64.length * 3) / 4) - pad;
}

/** The picker's answer as the data URL the server takes, or why it cannot go. */
export function toSignature(asset: { base64?: string | null; mimeType?: string | null; uri: string } | undefined): PickedSignature {
  if (!asset?.base64) return { error: "That image could not be read. Try another one." };
  if (base64Bytes(asset.base64) > SIGNATURE_MAX_BYTES) return { error: "That image is over 2 MB. Crop it closer to the signature." };
  // The picker re-encodes to JPEG unless the file was a PNG (which keeps a clear background).
  const type = asset.mimeType === "image/png" ? "png" : "jpeg";
  return { dataUrl: `data:image/${type};base64,${asset.base64}`, uri: asset.uri };
}

/** Opens the photo picker with a crop step. Null when the person backs out. */
export async function pickSignature(): Promise<PickedSignature> {
  try {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 0.7, base64: true, exif: false });
    if (r.canceled) return null;
    return toSignature(r.assets?.[0]);
  } catch {
    return { error: "The photos could not be opened on this phone." };
  }
}
