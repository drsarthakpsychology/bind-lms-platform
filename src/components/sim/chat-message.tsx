import * as React from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion";

/**
 * A single chat bubble in the patient conversation. Patient = left, quiet
 * (hairline outline + card fill); student = right, orange fill. No "You"/name
 * label above each message — the sides carry the speaker, and dropping the
 * label keeps the conversation reading like a conversation, not a form.
 *
 * The patient's typing indicator (three bouncing dots) is the same quiet
 * bubble with an sr-only label for screen readers.
 */
export const ChatMessage = React.memo(function ChatMessage({
  role,
  content,
  typing,
}: {
  role: "student" | "patient";
  content?: string;
  typing?: boolean;
}) {
  const reduce = useReducedMotion();

  if (typing) {
    // Reduced-motion users get a static line instead of the bouncing dots.
    if (reduce) {
      return (
        <div className="flex justify-start">
          <div className="rounded-2xl rounded-bl-md border border-border bg-card px-3.5 py-2.5 text-[15px] leading-relaxed text-muted-foreground">
            Patient is answering…
          </div>
        </div>
      );
    }
    return (
      <div className="flex justify-start">
        <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-card px-3.5 py-2.5">
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} aria-hidden />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "120ms" }} aria-hidden />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "240ms" }} aria-hidden />
          <span className="sr-only">Patient is answering</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex", role === "student" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed",
          role === "student"
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border border-border bg-card text-foreground",
        )}
      >
        {content}
      </div>
    </div>
  );
});
