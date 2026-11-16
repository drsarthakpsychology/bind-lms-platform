import { File, Paths } from "expo-file-system";
import { Stack, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import * as React from "react";
import { Image, Linking, PixelRatio, Pressable, ScrollView, useWindowDimensions, View } from "react-native";

import { pdfPages, type RenderedPage } from "../../../modules/pdf-pages/src";
import { reasonOf } from "@/api/errors";
import type { Material } from "@/api/contract";
import { useMaterial } from "@/api/queries";
import { session } from "@/auth";
import { Button, EmptyState, Loaded, RowsSkeleton, Screen, Skeleton, T } from "@/ds";
import { config } from "@/lib/config";
import { haptic } from "@/lib/haptics";
import { OnceHint } from "@/lib/once";
import { layout, space, useTheme } from "@/theme";

/**
 * A lecture material, opened inside the app. PDFs are drawn page by page by
 * the phone's own renderer (modules/pdf-pages), images and audio or video
 * play here too, so the file never goes to another app and the app-wide
 * screenshot block covers it. The downloaded file and the page pictures live
 * in the app's private cache and are deleted when the reader closes (no
 * offline copies, as agreed).
 */

export type MaterialView = "pdf" | "image" | "media" | "link" | "other";

export function viewFor(m: Pick<Material, "kind" | "format" | "url" | "filePath">): MaterialView {
  if (m.kind === "link" || (!m.filePath && m.url)) return "link";
  const f = (m.format ?? "").toLowerCase();
  if (m.kind === "pdf" || f === "pdf") return "pdf";
  if (m.kind === "image" || ["png", "jpg", "jpeg", "webp", "gif"].includes(f)) return "image";
  if (m.kind === "audio" || m.kind === "video" || ["mp3", "m4a", "aac", "wav", "mp4", "mov", "m4v"].includes(f)) return "media";
  return "other";
}

/** The server gives file paths from the site root ("/api/app/v1/materials/1/file"); an older form was relative to the API. */
export function absoluteUrl(path: string, apiUrl = config.apiUrl): string {
  if (/^https?:\/\//.test(path)) return path;
  // From the site root: keep only the server part of the API address. (Not `new URL(path, base)`:
  // React Native's URL glues the two together, so on a phone it doubled /api/app/v1 and every file was missing.)
  if (path.startsWith("/api/")) return (/^https?:\/\/[^/]+/.exec(apiUrl)?.[0] ?? "") + path;
  return apiUrl.replace(/\/$/, "") + path;
}

function fileUrl(m: Material): string {
  return absoluteUrl(m.filePath ?? "");
}

/* --------------------------------------------------------------------- pdf */

type Doc = { phase: "loading" } | { phase: "ready"; path: string; pages: number } | { phase: "error"; message: string };

function PdfReader({ m }: { m: Material }) {
  const c = useTheme();
  const { width } = useWindowDimensions();
  const [doc, setDoc] = React.useState<Doc>({ phase: "loading" });
  const [rendered, setRendered] = React.useState<Record<number, RenderedPage>>({});
  const [zoom, setZoom] = React.useState(false);
  const made = React.useRef<string[]>([]);
  const mock = config.apiMode === "mock" || !pdfPages.available();

  React.useEffect(() => {
    if (mock) return;
    let live = true;
    const created = made.current;
    const target = new File(Paths.cache, `material-${m.id}.pdf`);
    void (async () => {
      try {
        if (target.exists) target.delete();
        const file = await File.downloadFileAsync(fileUrl(m), target, { headers: await session.authHeaders() });
        created.push(file.uri);
        const pages = await pdfPages.pageCount(file.uri);
        if (live) setDoc({ phase: "ready", path: file.uri, pages });
      } catch (e) {
        if (live) setDoc({ phase: "error", message: reasonOf(e) });
      }
    })();
    return () => {
      live = false;
      // Nothing stays on the phone after reading.
      for (const uri of created) {
        try {
          const f = new File(uri);
          if (f.exists) f.delete();
        } catch {
          /* already gone */
        }
      }
    };
  }, [m, mock]);

  const pageWidth = Math.round((zoom ? width * 2 : width - layout.gutter * 2) * PixelRatio.get());
  // Draw the pages one after another in the background; each shows as soon as it is ready.
  React.useEffect(() => {
    if (doc.phase !== "ready") return;
    let live = true;
    void (async () => {
      for (let i = 0; i < doc.pages && live; i++) {
        try {
          const p = await pdfPages.renderPage(doc.path, i, pageWidth);
          made.current.push(p.uri);
          if (live) setRendered((r) => ({ ...r, [i]: p }));
        } catch {
          /* leave the placeholder */
        }
      }
    })();
    return () => {
      live = false;
    };
  }, [doc, pageWidth]);

  if (mock) return <MockPages title={m.title} />;
  if (doc.phase === "error") return <EmptyState mood="puzzled" title="Could not open this file" body={doc.message} />;
  if (doc.phase === "loading") {
    return (
      <View style={{ gap: space[3] }} testID="material-loading">
        <Skeleton h={Math.round((width - layout.gutter * 2) * 1.3)} r={8} />
      </View>
    );
  }
  const w = zoom ? width * 2 : width - layout.gutter * 2;
  const pages = (
    <View style={{ gap: space[3] }}>
      {Array.from({ length: doc.pages }, (_, i) => {
        const p = rendered[i];
        const h = p ? (w * p.height) / p.width : w * 1.3;
        return (
          <Pressable
            key={i}
            accessibilityRole="image"
            accessibilityLabel={`Page ${i + 1} of ${doc.pages}. Tap to ${zoom ? "fit the screen" : "zoom in"}`}
            onPress={() => {
              haptic.select();
              setZoom((z) => !z);
            }}
            style={{ width: w, height: h, backgroundColor: "#ffffff", borderRadius: 6, borderWidth: 1, borderColor: c.hairline, overflow: "hidden" }}
          >
            {p ? <Image source={{ uri: p.uri }} style={{ width: "100%", height: "100%" }} resizeMode="contain" /> : <Skeleton w="100%" h={h} r={0} />}
          </Pressable>
        );
      })}
    </View>
  );
  return zoom ? (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {pages}
    </ScrollView>
  ) : (
    pages
  );
}

/** Mock mode and the browser build: two sample pages, so the screen can be built and checked. */
function MockPages({ title }: { title: string }) {
  const c = useTheme();
  return (
    <View style={{ gap: space[3] }} testID="material-pages">
      {[1, 2].map((p) => (
        <View key={p} accessibilityLabel={`Page ${p} of 2`} style={{ aspectRatio: 1 / 1.3, backgroundColor: "#ffffff", borderRadius: 6, borderWidth: 1, borderColor: c.hairline, padding: space[5], gap: space[3] }}>
          <T v="h3" style={{ color: "#111111" }}>
            {p === 1 ? title : "Scoring"}
          </T>
          {Array.from({ length: 9 }, (_, i) => (
            <View key={i} style={{ height: 8, width: `${[92, 80, 96, 70, 88, 60, 94, 76, 50][i]}%`, borderRadius: 4, backgroundColor: "rgba(17,17,17,0.12)" }} />
          ))}
          <T v="caption" style={{ color: "#4d4d4d", marginTop: "auto" }}>
            Page {p} of 2 · sample
          </T>
        </View>
      ))}
    </View>
  );
}

/* ------------------------------------------------------------ image, media */

function ImageView({ m }: { m: Material }) {
  const [headers, setHeaders] = React.useState<Record<string, string> | null>(null);
  React.useEffect(() => {
    void session.authHeaders().then(setHeaders);
  }, []);
  if (!headers) return <Skeleton h={300} r={8} />;
  return <Image accessibilityLabel={m.title} source={{ uri: fileUrl(m), headers }} style={{ width: "100%", aspectRatio: 1 }} resizeMode="contain" />;
}

function MediaPlayer({ m, headers }: { m: Material; headers: Record<string, string> }) {
  const player = useVideoPlayer({ uri: fileUrl(m), headers }, (p) => {
    p.staysActiveInBackground = false;
  });
  return <VideoView player={player} nativeControls contentFit="contain" allowsPictureInPicture={false} style={{ width: "100%", aspectRatio: m.kind === "audio" ? 3 : 16 / 9, backgroundColor: "#000000", borderRadius: 8 }} />;
}

function MediaView({ m }: { m: Material }) {
  const [headers, setHeaders] = React.useState<Record<string, string> | null>(null);
  React.useEffect(() => {
    void session.authHeaders().then(setHeaders);
  }, []);
  if (!headers || config.apiMode === "mock") return <Skeleton h={180} r={8} />;
  return <MediaPlayer m={m} headers={headers} />;
}

/* ------------------------------------------------------------------ screen */

export function MaterialBody({ m }: { m: Material }) {
  const view = viewFor(m);
  return (
    <>
      <View style={{ gap: space[1] }}>
        <T v="h2">{m.title}</T>
        <T v="small" tone="muted">
          {[m.format?.toUpperCase(), m.week ? `Week ${m.week}` : null].filter(Boolean).join(" · ")}
        </T>
      </View>
      {view === "pdf" ? <PdfReader m={m} /> : null}
      {view === "image" ? <ImageView m={m} /> : null}
      {view === "media" ? <MediaView m={m} /> : null}
      {view === "link" ? (
        <View style={{ gap: space[3] }}>
          <T tone="muted">This material is a page on another website.</T>
          <Button kind="quiet" label="Open the link" onPress={() => m.url && void Linking.openURL(m.url)} />
        </View>
      ) : null}
      {view === "other" ? <EmptyState title="Open this one on the website" body="The app shows PDFs, pictures, audio and video. This kind of file opens on the website for now." action={{ label: "Open on the website", onPress: () => void Linking.openURL(config.site) }} /> : null}
      {view === "pdf" ? (
        <OnceHint id="material-pdf" v="caption" tone="muted">
          Tap a page to zoom. Nothing is saved on your phone.
        </OnceHint>
      ) : null}
    </>
  );
}

export function MaterialScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const q = useMaterial(String(id));
  return (
    <Screen testID="material" gap={space[4]}>
      <Stack.Screen options={{ title: "" }} />
      <Loaded q={q} what="this material" skeleton={<RowsSkeleton rows={3} />}>
        {(m) => <MaterialBody m={m} />}
      </Loaded>
    </Screen>
  );
}
