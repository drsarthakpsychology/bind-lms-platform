import { useQueries, useQueryClient } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { Bookmark, NotebookPen } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { moduleDetailView } from "@/api/adapt-learn";
import type { Marks, MarksResult, SaveMarksResult } from "@/api/contract";
import { ApiFailure } from "@/api/errors";
import { learnKeys, useMarks } from "@/api/learn";
import { queueWrite } from "@/api/queued";
import { keys, useStudyHome } from "@/api/queries";
import { api } from "@/auth";
import { Button, EmptyState, Field, Loaded, Row, RowList, RowsSkeleton, Screen, Section, Sheet, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { space, useTheme } from "@/theme";

/**
 * Bookmarks and your own notes on sections (the website's SectionMarks).
 * Marks are kept by the server (GET/PUT /study/marks); before the notes
 * database step is run they stay on this phone only, and the server says so
 * with `synced: false`.
 */

/** Send one change and keep the answer as the copy on the phone. */
export async function saveMark(qc: ReturnType<typeof useQueryClient>, changes: Marks): Promise<boolean> {
  const prev = qc.getQueryData<MarksResult>(learnKeys.marks);
  // Show the change at once; the server's answer replaces it.
  if (prev) qc.setQueryData<MarksResult>(learnKeys.marks, { ...prev, marks: { v: 1, bookmarks: { ...prev.marks.bookmarks, ...changes.bookmarks }, notes: { ...prev.marks.notes, ...changes.notes } } });
  try {
    const r = await api.put<SaveMarksResult>("/study/marks", { changes });
    qc.setQueryData<MarksResult>(learnKeys.marks, { marks: r.marks, synced: r.synced });
    return true;
  } catch (e) {
    // No internet or our server hiccuped: the change is kept on the phone and sent when it can be, in order.
    if (e instanceof ApiFailure && (e.code === "network" || e.code === "server_error" || e.code === "rate_limited")) {
      void queueWrite({ method: "PUT", path: "/study/marks", body: { changes }, scope: "marks" })
        .then((r) => {
          const x = r as SaveMarksResult | undefined;
          if (x?.marks) qc.setQueryData<MarksResult>(learnKeys.marks, { marks: x.marks, synced: x.synced });
        })
        .catch(() => undefined);
    }
    return false;
  }
}

/** Write or change your note on one section, in a sheet. */
export function NoteSheet({ open, onClose, markKey, label }: { open: boolean; onClose: () => void; markKey: string; label: string }) {
  const qc = useQueryClient();
  const marks = useMarks();
  const saved = marks.data?.marks.notes[markKey]?.text ?? "";
  const [text, setText] = React.useState(saved);
  const [busy, setBusy] = React.useState(false);
  const [was, setWas] = React.useState({ open, saved });
  if (was.open !== open || was.saved !== saved) {
    setWas({ open, saved });
    if (open) setText(saved);
  }
  const save = async () => {
    setBusy(true);
    const ok = await saveMark(qc, { v: 1, bookmarks: {}, notes: { [markKey]: { text: text.trim(), at: Date.now() } } });
    setBusy(false);
    haptic.success();
    toast.show(ok ? (text.trim() ? "Note saved" : "Note removed") : "Saved on this phone");
    onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title="My note" testID="note-sheet">
      <View style={{ gap: space[4] }}>
        <T v="small" tone="muted" numberOfLines={2}>
          {label}
        </T>
        <Field label="Your note" area value={text} onChangeText={setText} placeholder="What to remember about this part" maxLength={4000} testID="note-text" />
        <Button label="Save note" busy={busy} onPress={() => void save()} testID="note-save" />
      </View>
    </Sheet>
  );
}

export function SavedScreen() {
  const c = useTheme();
  const marks = useMarks();
  const study = useStudyHome();
  const m = marks.data?.marks;
  const keysOn = React.useMemo(() => {
    if (!m) return [] as { key: string; at: number; marked: boolean; note: string }[];
    const all = new Set([...Object.keys(m.bookmarks).filter((k) => m.bookmarks[k]?.on), ...Object.keys(m.notes).filter((k) => m.notes[k]?.text)]);
    return [...all]
      .map((key) => ({ key, at: Math.max(m.bookmarks[key]?.at ?? 0, m.notes[key]?.at ?? 0), marked: !!m.bookmarks[key]?.on, note: m.notes[key]?.text ?? "" }))
      .sort((a, b) => b.at - a.at);
  }, [m]);
  const moduleIds = [...new Set(keysOn.map((k) => k.key.split("/")[0]!))];
  const details = useQueries({
    queries: moduleIds.map((id) => ({ queryKey: keys.module(id), queryFn: async () => moduleDetailView(await api.get<unknown>(`/study/modules/${encodeURIComponent(id)}`)) })),
  });
  const titleOf = (key: string): { title: string; meta: string } => {
    const [mid = "", sid = ""] = key.split("/");
    const mod = details.find((d) => d.data?.id === mid)?.data;
    const sec = mod?.sections.find((s) => s.id === sid);
    const name = mod?.title ?? study.data?.modules.find((x) => x.id === mid)?.title;
    return { title: sec ? `${sec.num} ${sec.title}` : sid || key, meta: mod ? `Module ${mod.num} · ${mod.title}` : (name ?? "") };
  };
  const [editing, setEditing] = React.useState<string | null>(null);
  const close = React.useCallback(() => setEditing(null), []);
  const bookmarks = keysOn.filter((k) => k.marked);
  const notes = keysOn.filter((k) => k.note);
  return (
    <Screen testID="saved" area="learn" title="Saved" lead="Your bookmarks and notes" onRefresh={() => void marks.refetch()} refreshing={marks.isRefetching}>
      <Stack.Screen options={{ title: "" }} />
      <Loaded q={marks} soon what="what you saved" skeleton={<RowsSkeleton rows={4} />}>
        {(d) =>
          !keysOn.length ? (
            <EmptyState title="Nothing saved yet" body="While reading, tap the bookmark to keep a section here, or the pen to write yourself a note." testID="saved-empty" />
          ) : (
            <>
              {!d.synced ? (
                <T v="small" tone="muted">
                  Kept on this phone for now.
                </T>
              ) : null}
              {bookmarks.length ? (
                <Section title="Bookmarks">
                  <RowList>
                    {bookmarks.map((k) => {
                      const t = titleOf(k.key);
                      return <Row key={k.key} testID={`saved-${k.key}`} title={t.title} meta={t.meta} icon={<Bookmark size={20} color={c.link} fill={c.link} />} onPress={() => router.push(`/study/${k.key.split("/").map(encodeURIComponent).join("/")}`)} />;
                    })}
                  </RowList>
                </Section>
              ) : null}
              {notes.length ? (
                <Section title="My notes">
                  <RowList>
                    {notes.map((k) => {
                      const t = titleOf(k.key);
                      return <Row key={k.key} title={t.title} meta={k.note} icon={<NotebookPen size={20} color={c.muted} />} onPress={() => setEditing(k.key)} />;
                    })}
                  </RowList>
                </Section>
              ) : null}
            </>
          )
        }
      </Loaded>
      <NoteSheet open={editing !== null} onClose={close} markKey={editing ?? ""} label={editing ? titleOf(editing).title : ""} />
    </Screen>
  );
}
