"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";

interface WallPost {
  id: string;
  content: string;
  isAnonymous: boolean;
  isFaculty: boolean;
  isPinned: boolean;
  createdAt: string;
}

export function WallView({ initialPosts }: { initialPosts: WallPost[] }) {
  const [posts, setPosts] = React.useState<WallPost[]>(initialPosts);
  const [content, setContent] = React.useState("");
  const [anonymous, setAnonymous] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function post(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !content.trim()) return;
    setBusy(true);
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/wall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), isAnonymous: anonymous }),
      });
      if (!res.ok) {
        setError("Could not post. Please try again.");
        return;
      }
      const j = (await res.json()) as { id: string };
      setPosts((prev) => [
        { id: j.id, content: content.trim(), isAnonymous: anonymous, isFaculty: false, isPinned: false, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      setContent("");
      haptic("success");
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* composer */}
      <form onSubmit={post} className="space-y-3 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Share something with the cohort — a question, a win, a hard moment."
          className="w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-small text-muted-foreground">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="size-4"
            />
            Post anonymously
          </label>
          <button
            type="submit"
            disabled={busy || !content.trim()}
            className="ml-auto rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
          >
            {busy ? "Posting…" : "Post"}
          </button>
        </div>
        {error ? <p className="text-small text-red-600" role="alert">{error}</p> : null}
      </form>

      {/* posts */}
      <div>
        {posts.length === 0 ? (
          <p className="text-small text-muted-foreground">
            Nothing here yet. Be the first to break the ice.
          </p>
        ) : (
          <ul className="space-y-3">
            {posts.map((p) => (
              <li key={p.id} className={`rounded-md border-2 border-border bg-card p-4 ${p.isPinned ? "border-primary" : ""}`}>
                <div className="flex items-center gap-2 text-caption text-muted-foreground">
                  {p.isPinned ? <span className="font-semibold text-primary">📌 Pinned</span> : null}
                  {p.isFaculty ? <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold">Faculty</span> : null}
                  {p.isAnonymous ? <span>Anonymous</span> : <span>Cohort member</span>}
                  <span>· {new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-small">{p.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
