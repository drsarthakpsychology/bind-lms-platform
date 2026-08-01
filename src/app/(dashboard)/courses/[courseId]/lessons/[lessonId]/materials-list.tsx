"use client";

/* eslint-disable @next/next/no-img-element -- material images are signed,
   per-request URLs that can't be routed through next/image's optimizer. */

import { useEffect, useState } from "react";
import {
  Download,
  ExternalLink,
  FileAudio,
  FileImage,
  FileText,
  FileType2,
  Link2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AudioPlayer } from "./audio-player";
import { cn } from "@/lib/utils";

export type MaterialItem = {
  id: string;
  title: string;
  kind: "document" | "slides" | "audio" | "image" | "link";
  format?: string | null;
  sizeBytes?: number | null;
  url?: string | null;
};

const KIND_ICONS = {
  document: FileText,
  slides: FileType2,
  audio: FileAudio,
  image: FileImage,
  link: Link2,
} as const;

function formatSize(bytes: number | null | undefined): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Reads a material file through the signed-URL route and renders the right
 * inline viewer (PDF, audio, image) or a download/link card.
 */
function MaterialCard({ material, isAdmin }: { material: MaterialItem; isAdmin?: boolean }) {
  const Icon = KIND_ICONS[material.kind];
  // File kinds start in the loading state (their fetch kicks off on mount);
  // links never load a URL.
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(material.kind !== "link");

  // Auto-load PDFs, audio, and images so they render inline without a click.
  // The fetch lives inside the effect body (the lint rule forbids calling a
  // setState-ing function from an effect); it only runs for file kinds.
  useEffect(() => {
    if (material.kind === "link") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/media/materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ materialId: material.id }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          if (!cancelled) setError(body?.error ?? "Could not load this file.");
          return;
        }
        const { url } = await res.json();
        if (!cancelled) setSignedUrl(url);
      } catch {
        if (!cancelled) setError("Could not load this file.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [material.id, material.kind]);

  const isInlineViewable =
    material.kind === "document" ||
    material.kind === "audio" ||
    material.kind === "image";
  const isSlides = material.kind === "slides";

  if (material.kind === "link") {
    return (
      <div className="flex items-center gap-3 rounded-md border-2 border-border bg-card p-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-border bg-accent text-foreground">
          <Link2 className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-small font-medium text-foreground">{material.title}</p>
          <p className="truncate text-caption text-muted-foreground">{material.url}</p>
        </div>
        <Button asChild variant="secondary" size="sm">
          <a href={material.url ?? "#"} target="_blank" rel="noopener noreferrer">
            Open
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-md border-2 border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-border bg-accent text-foreground">
          <Icon className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-small font-medium text-foreground">{material.title}</p>
          <p className="text-caption text-muted-foreground">
            {material.format?.toUpperCase() ?? material.kind}
            {material.sizeBytes ? ` · ${formatSize(material.sizeBytes)}` : ""}
          </p>
        </div>
        {signedUrl && (
          <Button asChild variant="outline" size="sm">
            <a href={signedUrl} download>
              <Download className="size-3.5" aria-hidden />
              Download
            </a>
          </Button>
        )}
      </div>

      {error && (
        <p role="alert" className="text-caption text-status-alert-fg">
          {error}
        </p>
      )}

      {loading && isInlineViewable && (
        <div className="flex h-24 items-center justify-center rounded-md border-2 border-dashed border-border bg-muted/40 text-caption text-muted-foreground">
          Loading…
        </div>
      )}

      {/* Slides can't be previewed inline — an honest card + download. */}
      {isSlides && (
        <p className="text-caption text-muted-foreground">
          {isAdmin
            ? "PPTX files can't be previewed in the browser — exporting the deck to PDF lets students view it inline."
            : "PPTX files can't be previewed in the browser. Students can download this file."}
        </p>
      )}

      {/* Inline viewers */}
      {!loading && signedUrl && material.kind === "document" && (
        <div className={cn("overflow-hidden rounded-md border-2 border-border bg-background")}>
          <iframe
            src={`${signedUrl}#toolbar=0&view=FitH`}
            title={material.title}
            className="h-72 w-full"
          />
        </div>
      )}
      {!loading && signedUrl && material.kind === "audio" && (
        <AudioPlayer src={signedUrl} title={material.title} />
      )}
      {!loading && signedUrl && material.kind === "image" && (
        <img
          src={signedUrl}
          alt={material.title}
          className="max-h-80 rounded-md border-2 border-border object-contain"
        />
      )}
    </div>
  );
}

export function MaterialsList({
  materials,
  isAdmin,
}: {
  materials: MaterialItem[];
  isAdmin?: boolean;
}) {
  return (
    <div className="space-y-3">
      {materials.map((m) => (
        <MaterialCard key={m.id} material={m} isAdmin={isAdmin} />
      ))}
    </div>
  );
}
