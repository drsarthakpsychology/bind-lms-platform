"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Check,
  GripVertical,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { validateMaterialFile } from "@/lib/materials";
import { haptic } from "@/lib/haptics";
import {
  prepareMaterialUpload,
  confirmMaterialUpload,
  confirmMaterialReplace,
  deleteMaterial,
  renameMaterial,
  replaceMaterialFile,
  createLinkMaterial,
} from "./materials-actions";

import { Button } from "@/components/ui/button";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";
import { MobileInput } from "@/components/mobile/mobile-input";

/**
 * Upload a file to the signed materials-upload URL. This goes through the
 * supabase-js anon client's uploadToSignedUrl, which is the ONLY form the
 * endpoint accepts (POST-sign handshake then PUT with a native FormData body).
 * Hand-rolled XHR/fetch variants 400/403 and the file never lands — which is
 * what caused "Object not found" in the viewer.
 *
 * Progress is reported as an indeterminate "uploading" state (the SDK doesn't
 * expose byte-level progress); the cancel button aborts by discarding the row
 * after a best-effort storage delete.
 */
async function uploadFileWithProgress(
  client: ReturnType<typeof createClient>,
  path: string,
  token: string,
  file: File,
): Promise<{ error?: string }> {
  const { error } = await client.storage
    .from("materials")
    .uploadToSignedUrl(path, token, file, { cacheControl: "3600", upsert: false });
  if (error) {
    return {
      error:
        error.message === "The resource already exists"
          ? "A file with this name already exists."
          : error.message || "The server rejected the upload. Try again.",
    };
  }
  return {};
}

export type UploadRow = {
  id: string;
  title: string;
  kind: "document" | "slides" | "audio" | "image" | "link";
  format?: string | null;
  sizeBytes?: number | null;
  url?: string | null;
};

type PendingUpload = {
  clientId: string;
  fileName: string;
  file: File;
  materialId: string | null;
  path: string;
  token: string;
  progress: number;
  status: "preparing" | "uploading" | "done" | "error";
  error?: string;
};

/**
 * Admin materials uploader. Drag files anywhere onto the drop zone (full-area),
 * or click to browse (multi-select). Each file uploads with live progress and a
 * cancel button. Rows render with editable title, size, drag handle (reorder),
 * and a ⋯ menu with Rename / Replace file / Delete.
 */
export function MaterialUploader({
  courseId,
  lessonId,
  materials,
}: {
  courseId: string;
  lessonId: string | null;
  materials: UploadRow[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  // Stable across renders (lazy init) — the browser supabase client is a plain
  // object, safe to reuse.
  const [supabase] = useState(() => createClient());
  const [dragOver, setDragOver] = useState(false);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState("");
  const [replaceTarget, setReplaceTarget] = useState<UploadRow | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [menuTarget, setMenuTarget] = useState<UploadRow | null>(null);
  const [menuMode, setMenuMode] = useState<"menu" | "delete">("menu");
  const [deletePending, setDeletePending] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  /**
   * The full upload pipeline for one file: prepare (creates the DB row + signed
   * URL) → upload bytes → confirm. On failure it rolls back the DB row so no
   * orphaned "success" row survives. Reports back via onUpdate.
   */
  const runSingleUpload = useCallback(
    async (
      item: PendingUpload,
      onUpdate: (status: PendingUpload["status"], error?: string, progress?: number) => void,
    ) => {
      if (item.error) return;
      onUpdate("preparing");

      const signed = await prepareMaterialUpload(courseId, lessonId, item.file.name, item.file.size);
      if (!signed.ok) {
        onUpdate("error", signed.error);
        return;
      }
      item.materialId = signed.materialId;
      item.path = signed.path;
      item.token = signed.token;
      onUpdate("uploading");

      // Upload through supabase-js (the only protocol the endpoint accepts).
      const uploadResult = await uploadFileWithProgress(supabase, signed.path, signed.token, item.file);

      if (uploadResult.error) {
        // Roll back the materials row we created in prepareMaterialUpload —
        // otherwise a failed upload leaves an orphaned "success" row pointing
        // at a file that was never written.
        if (item.materialId) {
          await deleteMaterial(courseId, item.materialId, signed.path);
          item.materialId = null;
        }
        onUpdate("error", uploadResult.error);
        return;
      }

      const confirm = await confirmMaterialUpload(courseId, item.materialId!, item.path);
      if (confirm.error) {
        onUpdate("error", confirm.error);
        return;
      }
      haptic("success");
      onUpdate("done", undefined, 100);
    },
    [courseId, lessonId, supabase],
  );

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      const next: PendingUpload[] = list.map((file) => {
        const validation = validateMaterialFile(file.name, file.size);
        return {
          clientId: crypto.randomUUID(),
          fileName: file.name,
          file,
          materialId: null,
          path: "",
          token: "",
          progress: 0,
          status: "preparing",
          error: validation.ok ? undefined : validation.error,
        };
      });

      setPending((prev) => [...prev, ...next]);

      for (const item of next) {
        await runSingleUpload(item, (status, error, progress) => {
          setPending((prev) =>
            prev.map((p) =>
              p.clientId === item.clientId
                ? { ...p, status, error, progress: progress ?? p.progress }
                : p,
            ),
          );
        });
      }

      router.refresh();
    },
    [runSingleUpload, router],
  );

  function cancelUpload(clientId: string) {
    const item = pending.find((p) => p.clientId === clientId);
    setPending((prev) => prev.filter((p) => p.clientId !== clientId));
    if (!item) return;
    // Best-effort abort: delete the prepared materials row AND any bytes that
    // may have already landed, so a cancel doesn't leave a phantom material
    // that later confirms and appears on refresh. The in-flight SDK upload may
    // still finish after this, but the row is gone, so no material surfaces.
    if (item.materialId) {
      void deleteMaterial(courseId, item.materialId, item.path || null).then(() => {
        router.refresh();
      });
    }
  }

  function dismissFailed(clientId: string) {
    setPending((prev) => prev.filter((p) => p.clientId !== clientId));
  }

  function retryUpload(p: PendingUpload) {
    // Re-run the upload for just this file, keeping its clientId so the same
    // row updates in place (no duplicate).
    setPending((prev) =>
      prev.map((x) =>
        x.clientId === p.clientId
          ? { ...x, status: "preparing" as const, error: undefined, progress: 0 }
          : x,
      ),
    );
    void runSingleUpload(p, (status, error, progress) => {
      setPending((prev) =>
        prev.map((x) =>
          x.clientId === p.clientId
            ? { ...x, status, error, progress: progress ?? x.progress }
            : x,
        ),
      );
    });
  }

  // ---- Dropzone handlers ----
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) void addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  // ---- Rename (click title, type, blur to save) ----
  function startRename(id: string, current: string) {
    setEditingTitleId(id);
    setTitleDraft(current);
  }
  async function commitRename(id: string) {
    if (editingTitleId !== id) return;
    setEditingTitleId(null);
    if (titleDraft.trim() && titleDraft.trim() !== "") {
      const result = await renameMaterial(courseId, id, titleDraft);
      if (result.error) setBanner(result.error);
      else router.refresh();
    }
  }

  // ---- Replace file ----
  async function handleReplace(e: React.ChangeEvent<HTMLInputElement>, target: UploadRow) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const signed = await replaceMaterialFile(courseId, target.id, file.name, file.size);
    if (!signed.ok) {
      setBanner(signed.error);
      return;
    }
    const uploadResult = await uploadFileWithProgress(supabase, signed.path, signed.token, file);
    if (uploadResult.error) {
      // The row now points at the new (empty) path. Roll it back to the old
      // object so the material isn't left permanently broken.
      const { restoreMaterialPath } = await import("./materials-actions");
      await restoreMaterialPath(target.id, target.url ?? null);
      setBanner(uploadResult.error);
      return;
    }
    // Only now — after the new bytes are in — remove the old object.
    const confirm = await confirmMaterialReplace(target.id, signed.oldPath ?? null);
    if (confirm.error) setBanner(confirm.error);
    setReplaceTarget(null);
    router.refresh();
  }

  // ---- Delete ----
  async function handleDelete(target: UploadRow) {
    setDeletePending(true);
    const result = await deleteMaterial(courseId, target.id, target.url ?? null);
    setDeletePending(false);
    setMenuTarget(null);
    setMenuMode("menu");
    if (result.error) setBanner(result.error);
    else router.refresh();
  }

  // ---- Link ----
  async function submitLink() {
    const result = await createLinkMaterial(courseId, lessonId, linkTitle, linkUrl);
    if (result.error) setLinkError(result.error);
    else {
      setLinkOpen(false);
      setLinkTitle("");
      setLinkUrl("");
      setLinkError(null);
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      {banner && (
        <p role="alert" className="text-caption text-status-alert-fg">
          {banner}
        </p>
      )}


      {/* Full-area drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload materials — drag files here or browse"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-muted/40 px-6 py-10 text-center transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 " +
          (dragOver ? "border-primary bg-accent" : "")
        }
      >
        <UploadCloud className="size-8 text-muted-foreground" aria-hidden />
        <p className="text-small font-medium text-foreground">
          Drag files here or <span className="text-link">browse</span>
        </p>
        <p className="text-caption text-muted-foreground">
          PDF, audio (MP3/M4A/WAV), and images. Up to 100 MB each.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.mp3,.m4a,.wav,.png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Add a link */}
      <div className="flex justify-end">
        <Button type="button" variant="secondary" size="sm" onClick={() => setLinkOpen(true)}>
          <Plus className="size-3.5" aria-hidden />
          Add a link
        </Button>
        <MobileBottomSheet
          open={linkOpen}
          onOpenChange={setLinkOpen}
          title="Add a link"
          description="A URL students open in a new tab, labelled with its title."
          footer={
            <div className="flex flex-col gap-2">
              <Button type="button" onClick={submitLink} className="w-full">
                Add link
              </Button>
              <Button type="button" variant="outline" onClick={() => setLinkOpen(false)} className="w-full">
                Cancel
              </Button>
            </div>
          }
        >
          <div className="space-y-3">
            <label className="block space-y-1.5">
              <span className="text-small font-medium">Title</span>
              <MobileInput
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                placeholder="Supplementary reading"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-small font-medium">URL</span>
              <MobileInput
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                inputMode="url"
                placeholder="https://…"
              />
            </label>
            {linkError && <p role="alert" className="text-caption text-status-alert-fg">{linkError}</p>}
          </div>
        </MobileBottomSheet>
      </div>

      {/* Pending uploads (live progress + cancel) */}
      {pending.length > 0 && (
        <ul className="space-y-2">
          {pending.map((p) => (
            <li key={p.clientId} className="rounded-md border-2 border-border bg-card p-3">
              <div className="flex items-center gap-3">
                {p.status === "done" ? (
                  <Check className="size-4 shrink-0 text-link" aria-hidden />
                ) : p.status === "error" ? (
                  <X className="size-4 shrink-0 text-status-alert-fg" aria-hidden />
                ) : (
                  <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
                )}
                <span className="min-w-0 flex-1 truncate text-small text-foreground">
                  {p.fileName}
                </span>

                {/* Failed row: dismiss + retry. */}
                {p.status === "error" && (
                  <span className="flex shrink-0 items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => retryUpload(p)}
                    >
                      <RotateCcw className="size-3" aria-hidden />
                      Retry
                    </Button>
                    <button
                      type="button"
                      onClick={() => dismissFailed(p.clientId)}
                      aria-label={`Dismiss ${p.fileName}`}
                      className="text-caption text-muted-foreground hover:text-foreground"
                    >
                      Dismiss
                    </button>
                  </span>
                )}

                {/* In-flight row: cancel. */}
                {p.status !== "done" && p.status !== "error" && (
                  <button
                    type="button"
                    onClick={() => cancelUpload(p.clientId)}
                    aria-label={`Cancel ${p.fileName}`}
                    className="text-caption text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                )}
              </div>
              {p.error ? (
                <p role="alert" className="mt-1 text-caption text-status-alert-fg">
                  {p.error} You can retry or dismiss this file.
                </p>
              ) : p.status !== "done" ? (
                <div className="mt-2 h-1.5 overflow-hidden rounded-md bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${p.progress || (p.status === "preparing" ? 8 : 25)}%` }}
                  />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {/* Existing material rows */}
      {materials.length > 0 && (
        <ul className="space-y-2">
          {materials.map((m) => (
            <li
              key={m.id}
              draggable
              onDragStart={() => setDraggedId(m.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (!draggedId || draggedId === m.id) return;
                const ids = materials.map((x) => x.id);
                const from = ids.indexOf(draggedId);
                const to = ids.indexOf(m.id);
                const next = [...ids];
                next.splice(to, 0, next.splice(from, 1)[0]);
                void import("./materials-actions").then(async ({ reorderMaterials }) => {
                  const result = await reorderMaterials(courseId, next);
                  if (result.error) setBanner(result.error);
                  else router.refresh();
                });
                setDraggedId(null);
              }}
              className="flex items-center gap-3 rounded-md border-2 border-border bg-card p-3"
            >
              <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground" aria-hidden />

              {editingTitleId === m.id ? (
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={() => commitRename(m.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename(m.id);
                    if (e.key === "Escape") setEditingTitleId(null);
                  }}
                  className="h-8 min-w-0 flex-1 rounded-md border-2 border-input bg-background px-2 text-sm outline-none focus-visible:border-ring"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => startRename(m.id, m.title)}
                  title="Click to rename"
                  className="min-w-0 flex-1 truncate text-left text-small font-medium text-foreground hover:text-link"
                >
                  {m.title}
                </button>
              )}

              <span className="shrink-0 text-caption text-muted-foreground">
                {m.format?.toUpperCase() ?? m.kind}
                {m.sizeBytes ? ` · ${(m.sizeBytes / 1024).toFixed(0)} KB` : ""}
              </span>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions for ${m.title}`}
                onClick={() => {
                  setMenuMode("menu");
                  setMenuTarget(m);
                }}
              >
                <MoreHorizontal className="size-4" aria-hidden />
              </Button>

              {/* Replace file picker */}
              {replaceTarget?.id === m.id && (
                <input
                  key={replaceTarget.id}
                  type="file"
                  accept=".pdf,.mp3,.m4a,.wav,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={(e) => handleReplace(e, m)}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Material action sheet (rename / replace / delete) */}
      <MobileBottomSheet
        open={menuTarget !== null}
        onOpenChange={(next) => !next && setMenuTarget(null)}
        title={menuMode === "delete" ? "Delete this material?" : menuTarget?.title}
        description={
          menuMode === "delete"
            ? "This removes the file from the lesson. This can't be undone."
            : undefined
        }
        footer={
          menuMode === "delete" ? (
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => menuTarget && handleDelete(menuTarget)}
                disabled={deletePending}
                className="w-full"
              >
                {deletePending && <Loader2 className="size-4 animate-spin" aria-hidden />}
                {deletePending ? "Deleting…" : "Delete material"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setMenuMode("menu")}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          ) : undefined
        }
      >
        {menuMode === "menu" && menuTarget ? (
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => {
                startRename(menuTarget.id, menuTarget.title);
                setMenuTarget(null);
              }}
              className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-small font-medium transition-colors hover:bg-accent"
            >
              <Pencil className="size-4 text-muted-foreground" aria-hidden />
              Rename
            </button>
            <button
              type="button"
              onClick={() => {
                setReplaceTarget(menuTarget);
                setMenuTarget(null);
              }}
              className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-small font-medium transition-colors hover:bg-accent"
            >
              <UploadCloud className="size-4 text-muted-foreground" aria-hidden />
              Replace file
            </button>
            <button
              type="button"
              onClick={() => setMenuMode("delete")}
              className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-small font-medium text-status-alert-fg transition-colors hover:bg-accent"
            >
              <Trash2 className="size-4" aria-hidden />
              Delete
            </button>
          </div>
        ) : null}
      </MobileBottomSheet>
    </div>
  );
}
