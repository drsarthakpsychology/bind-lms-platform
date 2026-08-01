"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  prepareMaterialUpload,
  confirmMaterialUpload,
  deleteMaterial,
  renameMaterial,
  replaceMaterialFile,
  createLinkMaterial,
} from "./materials-actions";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * Upload a file to the signed materials-upload URL via XHR, reporting live
 * progress. XHR (not fetch) so we get onprogress + abort. The live XHR is
 * registered into `xhrs` keyed by `clientId` so the cancel button can abort it.
 */
function uploadFileWithProgress(
  clientId: string,
  path: string,
  token: string,
  file: File,
  xhrs: Map<string, XMLHttpRequest>,
  onProgress: (pct: number) => void,
): Promise<{ error?: string }> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/upload/sign/${path}?token=${token}`;
  const xhr = new XMLHttpRequest();
  xhrs.set(clientId, xhr);
  return new Promise((resolve) => {
    xhr.open("POST", url);
    // Supabase's signed-upload endpoint expects the file at the EMPTY-named
    // FormData field, plus a cacheControl field — exactly what supabase-js
    // sends. A field named "file" returns 400, which is the bug this fixes.
    xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=----plms");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      xhrs.delete(clientId);
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({});
        return;
      }
      // Parse the Supabase error body for a useful message.
      let detail = "";
      try {
        const body = JSON.parse(xhr.responseText) as { message?: string; error?: string };
        detail = body?.message || body?.error || "";
      } catch {
        /* non-JSON body */
      }
      const msg =
        xhr.status === 413
          ? "This file is too large for the storage limit."
          : xhr.status === 400
            ? "The server rejected this file. Try a different name, then retry."
            : detail || `The server rejected the upload. Try again.`;
      resolve({ error: `${msg}` });
    };
    xhr.onerror = () => {
      xhrs.delete(clientId);
      resolve({ error: "The upload couldn't reach the server. Check your connection and retry." });
    };
    xhr.onabort = () => {
      xhrs.delete(clientId);
      resolve({ error: "Upload cancelled." });
    };
    // Build the multipart body manually to match supabase-js exactly.
    const boundary = "----plms";
    const pre = `--${boundary}\r\nContent-Disposition: form-data; name="cacheControl"\r\n\r\n3600\r\n--${boundary}\r\nContent-Disposition: form-data; name=""; filename="${file.name}"\r\nContent-Type: application/octet-stream\r\n\r\n`;
    const post = `\r\n--${boundary}--\r\n`;
    const enc = new TextEncoder();
    const head = enc.encode(pre);
    const tail = enc.encode(post);
    const blob = new Blob([head, file, tail], { type: "multipart/form-data" });
    xhr.send(blob);
  });
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
  // Live XHRs by clientId, so the cancel button can abort an in-flight upload.
  const xhrsRef = useRef<Map<string, XMLHttpRequest>>(new Map());
  const [dragOver, setDragOver] = useState(false);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState("");
  const [replaceTarget, setReplaceTarget] = useState<UploadRow | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UploadRow | null>(null);
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

      // Upload with live progress + cancel via XHR to the signed upload URL.
      const uploadResult = await uploadFileWithProgress(
        item.clientId,
        signed.path,
        signed.token,
        item.file,
        xhrsRef.current,
        (pct) => onUpdate("uploading", undefined, pct),
      );

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

      await confirmMaterialUpload(courseId);
      onUpdate("done", undefined, 100);
    },
    [courseId, lessonId],
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
    // Abort the in-flight XHR (its onabort removes itself + resolves).
    xhrsRef.current.get(clientId)?.abort();
    setPending((prev) => prev.filter((p) => p.clientId !== clientId));
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
    const uploadResult = await uploadFileWithProgress(
      `replace-${target.id}`,
      signed.path,
      signed.token,
      file,
      xhrsRef.current,
      () => {},
    );
    if (uploadResult.error) {
      setBanner(uploadResult.error);
      return;
    }
    setReplaceTarget(null);
    router.refresh();
  }

  // ---- Delete ----
  async function handleDelete(target: UploadRow) {
    setDeletePending(true);
    const result = await deleteMaterial(courseId, target.id, target.url ?? null);
    setDeletePending(false);
    setDeleteTarget(null);
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
          Drag files here or <span className="text-primary">browse</span>
        </p>
        <p className="text-caption text-muted-foreground">
          PDF, PPT, audio (MP3/M4A/WAV), and images. Up to 100 MB each.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.ppt,.pptx,.mp3,.m4a,.wav,.png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Add a link */}
      <div className="flex justify-end">
        <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="secondary" size="sm">
              <Plus className="size-3.5" aria-hidden />
              Add a link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a link</DialogTitle>
              <DialogDescription>
                A URL students open in a new tab, labelled with its title.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <label className="block space-y-1.5">
                <span className="text-small font-medium">Title</span>
                <input
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="h-9 w-full rounded-md border-2 border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/60"
                  placeholder="Supplementary reading"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-small font-medium">URL</span>
                <input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="h-9 w-full rounded-md border-2 border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/60"
                  placeholder="https://…"
                />
              </label>
              {linkError && <p role="alert" className="text-caption text-status-alert-fg">{linkError}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setLinkOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={submitLink}>
                Add link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pending uploads (live progress + cancel) */}
      {pending.length > 0 && (
        <ul className="space-y-2">
          {pending.map((p) => (
            <li key={p.clientId} className="rounded-md border-2 border-border bg-card p-3">
              <div className="flex items-center gap-3">
                {p.status === "done" ? (
                  <Check className="size-4 shrink-0 text-primary" aria-hidden />
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
                  className="min-w-0 flex-1 truncate text-left text-small font-medium text-foreground hover:text-primary"
                >
                  {m.title}
                </button>
              )}

              <span className="shrink-0 text-caption text-muted-foreground">
                {m.format?.toUpperCase() ?? m.kind}
                {m.sizeBytes ? ` · ${(m.sizeBytes / 1024).toFixed(0)} KB` : ""}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label={`Actions for ${m.title}`}>
                    <MoreHorizontal className="size-4" aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => startRename(m.id, m.title)}>
                    <Pencil className="size-4" aria-hidden />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setReplaceTarget(m)}>
                    <UploadCloud className="size-4" aria-hidden />
                    Replace file
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Dialog open={deleteTarget?.id === m.id} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem variant="destructive" onSelect={(e) => { e.preventDefault(); setDeleteTarget(m); }}>
                        <Trash2 className="size-4" aria-hidden />
                        Delete
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </Dialog>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Replace file picker */}
              {replaceTarget?.id === m.id && (
                <input
                  key={replaceTarget.id}
                  type="file"
                  accept=".pdf,.ppt,.pptx,.mp3,.m4a,.wav,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={(e) => handleReplace(e, m)}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Delete confirmation */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this material?</DialogTitle>
            <DialogDescription>
              This removes the file from the lesson. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              disabled={deletePending}
            >
              {deletePending && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {deletePending ? "Deleting…" : "Delete material"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
