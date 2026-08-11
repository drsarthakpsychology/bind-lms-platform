"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { Eye, Send } from "lucide-react";

interface WallPost {
  id: string;
  narrative: string;
  caseTitle: string;
  createdAt: string;
}

/**
 * The anonymised peer-critique wall (IDEAS: Formulation Wall). Students post
 * their stage-4 narratives; the cohort reads them and can send an anonymous
 * encouraging question via the shared compose. author_id never reaches the
 * client (the view nulls it structurally).
 */
export function PeerWall() {
  const [posts, setPosts] = React.useState<WallPost[]>([]);
  const [loaded, setLoaded] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [caseTitle, setCaseTitle] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function load() {
    const res = await fetch("/api/practice/formulation/wall").catch(() => null);
    if (!res || !res.ok) return;
    const j = (await res.json().catch(() => null)) as { posts: WallPost[] } | null;
    if (j) setPosts(j.posts ?? []);
  }

  React.useEffect(() => {
    let alive = true;
    (async () => {
      const res = await fetch("/api/practice/formulation/wall").catch(() => null);
      if (!res || !res.ok) return;
      const j = (await res.json().catch(() => null)) as { posts: WallPost[] } | null;
      if (alive && j) {
        setPosts(j.posts ?? []);
        setLoaded(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function post(e: React.FormEvent) {
    e.preventDefault();
    if (busy || draft.trim().length < 40) return;
    setBusy(true);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/formulation/wall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ narrative: draft.trim(), caseTitle: caseTitle.trim() || "Sim session" }),
      });
      if (!res.ok) return;
      haptic("success");
      setDraft("");
      setCaseTitle("");
      void load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* compose */}
      <form onSubmit={post} className="space-y-2 rounded-md border-2 border-border bg-card p-4">
        <p className="flex items-center gap-1.5 text-caption font-semibold text-muted-foreground">
          <Eye className="size-3.5" aria-hidden /> Share your formulation anonymously — the cohort learns from each other&apos;s structure.
        </p>
        <input
          value={caseTitle}
          onChange={(e) => setCaseTitle(e.target.value)}
          placeholder="Case title (optional)"
          className="w-full rounded-md border-2 border-border bg-background px-3 py-1.5 text-small focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          placeholder="Paste your 5P formulation from Stage 4… (anonymised, no names)"
          className="w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={busy || draft.trim().length < 40}
          className="ml-auto flex items-center gap-1 rounded-md border-2 border-border bg-primary px-3 py-1.5 text-caption font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
        >
          <Send className="size-3" aria-hidden /> Post to the wall
        </button>
      </form>

      {/* wall */}
      {loaded && posts.length === 0 ? (
        <p className="rounded-md border-2 border-dashed border-border bg-card p-6 text-center text-small text-muted-foreground">
          No formulations on the wall yet — be the first to share one.
        </p>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.id} className="rounded-md border-2 border-border bg-card p-4">
              <div className="flex items-center justify-between text-caption text-muted-foreground">
                <span className="font-medium text-foreground">{p.caseTitle}</span>
                <span>Anonymous · {new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-small">{p.narrative}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}