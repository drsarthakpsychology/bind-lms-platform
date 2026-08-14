"use client";

import dynamic from "next/dynamic";

/**
 * Lazy wrapper around VideoPlayer. The player imports hls.js (~500KB min /
 * ~150KB gzip); deferring the whole component keeps hls.js out of the
 * lesson-page critical bundle and loads it only when the "Watch" tab actually
 * mounts the player. ssr:false lives here (a Client Component) because the
 * Next.js Server Component that renders this does not support ssr:false and
 * does not code-split dynamically-imported Client Components.
 */
const Player = dynamic(
  () => import("./video-player").then((m) => m.VideoPlayer),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-border bg-card"
      >
        <span className="size-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    ),
  },
);

export function LazyVideoPlayer({
  lessonId,
  watermarkLabel,
}: {
  lessonId: string;
  watermarkLabel: string;
}) {
  return <Player lessonId={lessonId} watermarkLabel={watermarkLabel} />;
}
