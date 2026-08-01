import "server-only";

import { createAdminClient } from "@/lib/supabase/server";
import type { MediaProvider, SignedPlaybackResult, UploadResult } from "./provider";

/**
 * Supabase Storage media provider — the current implementation, wrapped
 * behind the same interface as R2 so the player never cares which one is live.
 */
export class SupabaseMediaProvider implements MediaProvider {
  async getPlaybackUrl(key: string, expiresSeconds = 3600): Promise<SignedPlaybackResult> {
    try {
      const admin = createAdminClient();
      const { data, error } = await admin.storage
        .from("videos")
        .createSignedUrl(key, expiresSeconds);
      if (error || !data) return { ok: false, error: error?.message ?? "Could not sign URL." };
      return { ok: true, url: data.signedUrl };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Could not sign Supabase URL.",
      };
    }
  }

  async prepareUpload(key: string): Promise<UploadResult> {
    try {
      const admin = createAdminClient();
      const { data, error } = await admin.storage.from("videos").createSignedUploadUrl(key);
      if (error || !data) return { ok: false, error: error?.message ?? "Could not prepare upload." };
      return { ok: true, key: data.path };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Could not prepare upload." };
    }
  }

  async health(): Promise<boolean> {
    try {
      const admin = createAdminClient();
      const { data } = await admin.storage.from("videos").list("", { limit: 1 });
      return Array.isArray(data);
    } catch {
      return false;
    }
  }
}
