"use client";

import * as React from "react";
import { Room, RoomEvent } from "livekit-client";

/**
 * The realtime voice session over LiveKit. One hook:
 *   - POSTs /api/livekit/token (validated server-side, short-lived)
 *   - joins the room (WebRTC), publishes the microphone
 *   - plays the agent's audio, keeps the microphone live for barge-in
 *   - renders the shared transcript from the room's transcription attributes
 *   - auto-reconnects, and cleans up the room + audio on unmount
 *
 * The agent worker is the same patient brain as text mode — this is purely the
 * transport. There is exactly one conversation.
 */

export type LkPhase = "connecting" | "listening" | "error" | "disconnected";

export function useLiveKitSession({ sessionId }: { sessionId: string }) {
  const roomRef = React.useRef<Room | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [phase, setPhase] = React.useState<LkPhase>("connecting");
  const [transcript, setTranscript] = React.useState("");
  const sessionIdRef = React.useRef(sessionId);
  React.useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  React.useEffect(() => {
    let cancelled = false;

    async function connect() {
      try {
        const res = await fetch("/api/livekit/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionIdRef.current }),
        });
        if (!res.ok) throw new Error("token request failed");
        const { token, wsUrl } = (await res.json()) as { token: string; wsUrl: string };

        const room = new Room();
        roomRef.current = room;

        room.on(RoomEvent.TrackSubscribed, (track) => {
          if (track.kind !== "audio") return;
          const el = new Audio();
          el.srcObject = new MediaStream([track.mediaStreamTrack]);
          void el.play().catch(() => {});
          audioRef.current = el;
          el.onended = () => {
            el.srcObject = null;
          };
        });
        room.on(RoomEvent.TrackUnsubscribed, (track) => {
          if (audioRef.current?.srcObject === (track.mediaStreamTrack as unknown as MediaStream)) {
            audioRef.current.pause();
          }
        });
        room.on(RoomEvent.Reconnected, () => !cancelled && setPhase("listening"));
        room.on(RoomEvent.Disconnected, () => !cancelled && setPhase("disconnected"));
        room.on(RoomEvent.ParticipantAttributesChanged, (p) => {
          const attrs = p.attributes as unknown as Record<string, string | undefined>;
          const t = attrs["lk.transcription"];
          if (!t || cancelled) return;
          const parsed = parseTranscript(t);
          if (parsed) setTranscript(parsed);
        });

        if (cancelled) return;
        await room.connect(wsUrl, token, { autoSubscribe: true });
        if (cancelled) return;
        setPhase("listening");
        // Publish the microphone — the agent's VAD/turn-detection handles
        // barge-in; the mic stays live for the whole session.
        await room.localParticipant.setMicrophoneEnabled(true).catch(() => {});
      } catch {
        if (!cancelled) setPhase("error");
      }
    }

    void connect();

    return () => {
      cancelled = true;
      audioRef.current?.pause();
      audioRef.current?.remove();
      void roomRef.current?.disconnect().catch(() => {});
      roomRef.current = null;
    };
  }, []);

  return { phase, transcript };
}

/**
 * LiveKit publishes transcriptions as a participant attribute. It can arrive
 * as a JSON object or a bare string — accept both.
 */
function parseTranscript(raw: string): string | null {
  try {
    const j = JSON.parse(raw) as { text?: string } | string;
    if (typeof j === "string") return j;
    if (j && typeof j.text === "string") return j.text;
  } catch {
    return raw || null;
  }
  return null;
}
