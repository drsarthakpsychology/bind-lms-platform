"use client";

import Link from "next/link";
import {
  ExternalLink,
  FileAudio,
  FileImage,
  FileText,
  FileType2,
  Link2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

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
function MaterialCard({
  material,
  courseId,
  isAdmin,
}: {
  material: MaterialItem;
  courseId: string;
  isAdmin?: boolean;
}) {
  const Icon = KIND_ICONS[material.kind];
  const viewHref = `/courses/${courseId}/materials/${material.id}`;
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
          <Link
            href={viewHref}
            className="block truncate text-small font-medium text-foreground transition-colors hover:text-primary"
          >
            {material.title}
          </Link>
          <p className="text-caption text-muted-foreground">
            {material.format?.toUpperCase() ?? material.kind}
            {material.sizeBytes ? ` · ${formatSize(material.sizeBytes)}` : ""}
          </p>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link href={viewHref}>View</Link>
        </Button>
      </div>

      {/* Slides can't be previewed — honest note. */}
      {isSlides && (
        <p className="text-caption text-muted-foreground">
          {isAdmin
            ? "PPTX files can't be previewed in the browser — exporting the deck to PDF lets students view it inline."
            : "PPTX files can't be previewed in the browser."}
        </p>
      )}
    </div>
  );
}

export function MaterialsList({
  materials,
  courseId,
  isAdmin,
}: {
  materials: MaterialItem[];
  courseId: string;
  isAdmin?: boolean;
}) {
  return (
    <div className="space-y-3">
      {materials.map((m) => (
        <MaterialCard key={m.id} material={m} courseId={courseId} isAdmin={isAdmin} />
      ))}
    </div>
  );
}
