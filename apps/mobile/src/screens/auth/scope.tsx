import { router } from "expo-router";
import { CirclePlay, MessageCircle } from "lucide-react-native";
import * as React from "react";

import { Button } from "@/ds";
import { BRAND } from "@/lib/brand";
import { openLink } from "@/lib/open";
import { Gate, GateNote } from "@/screens/auth/gates";
import { useTheme } from "@/theme";

/**
 * Parts of the app a lectures-only account cannot open (the server refuses
 * them with "scope"). The first part of the address.
 */
export const FULL_ONLY = new Set(["study", "practise", "game", "case", "prep", "map", "wall", "clinic"]);

/** True when a lectures-only account is on a screen that is not part of it. */
export function outsideLectures(group: string, top: string | undefined): boolean {
  return group === "(lecture)" && top !== undefined && FULL_ONLY.has(top);
}

/**
 * A lectures-only account opened a link to something outside its lectures
 * (a module, a case, the clinic). Says so plainly and gives two ways on:
 * back to the lectures, or ask about the full programme. Never a dead end.
 */
export function LecturesOnlyGate() {
  const c = useTheme();
  const ask = `${BRAND.whatsapp}?text=${encodeURIComponent("Hi, my VIBHA account is for lectures only. I would like to know about the full programme.")}`;
  return (
    <Gate
      testID="lectures-only"
      title="Lectures only"
      lead="This part is not in your account"
      footer={
        <>
          <Button label="Back to my lectures" onPress={() => router.replace("/lo/lectures")} testID="lectures-only-back" />
          <Button kind="quiet" label="Ask about the full programme" icon={<MessageCircle size={20} color={c.ink} strokeWidth={2} />} onPress={() => void openLink(ask)} testID="lectures-only-ask" />
        </>
      }
    >
      <GateNote icon={CirclePlay} more="Modules, cases, practice and the clinic come with the full programme. Message us and we will tell you how to join.">
        Your account opens the recorded lectures, their notes and your doubts. The page you tried to open is outside that.
      </GateNote>
    </Gate>
  );
}
