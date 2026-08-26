"use client";

import * as React from "react";
import { ChatMessage } from "./chat-message";

/** A single turn in the conversation (structurally identical to session-view's `Turn`). */
export interface ChatTurn {
  id: string;
  role: "student" | "patient";
  content: string;
}

/**
 * The conversation transcript — owns the viewport between header and composer.
 * Renders the quiet first-turn empty state, then the bubbles. The `scrollRef`
 * is passed in so the parent can pin to the latest turn as messages arrive.
 */
export const ChatList = React.memo(function ChatList({
  turns,
  patientName,
  typing,
  scrollRef,
}: {
  turns: ChatTurn[];
  patientName: string;
  typing?: boolean;
  scrollRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
      {turns.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-base font-semibold text-foreground">{patientName} is waiting.</p>
          <p className="mx-auto mt-1.5 max-w-[36ch] text-small text-muted-foreground">
            Introduce yourself and ask how they&apos;re doing. Silence is okay — they&apos;ll wait.
          </p>
        </div>
      ) : null}
      {turns.map((t) => (
        <ChatMessage key={t.id} role={t.role} content={t.content} />
      ))}
      {typing ? <ChatMessage role="patient" typing /> : null}
    </div>
  );
});
