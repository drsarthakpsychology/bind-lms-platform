import * as React from "react";
import { View } from "react-native";

import { go } from "@/api/prefetch";
import { Button, Sheet, T } from "@/ds";
import { space, useTheme } from "@/theme";
import type { ClinicSession } from "./contract";
import { clockOf, dateLabel, KIND_NAME, rangeLabel, relDay, sessionTitle, timeLabel } from "./logic";
import { openLink } from "./parts";
import { StatePill } from "./ui";

/** A label and its value on one line of a detail sheet. */
export function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: "row", gap: space[3], paddingVertical: space[3], borderTopWidth: 1, borderColor: c.hairline, alignItems: "flex-start" }}>
      <T v="small" tone="muted" style={{ width: 92 }}>
        {label}
      </T>
      <View style={{ flex: 1, minWidth: 0 }}>{typeof children === "string" ? <T v="bodyStrong">{children}</T> : children}</View>
    </View>
  );
}

/**
 * One session, opened from the schedule: when, where, what kind, where I
 * stand, and the one thing to do about it now (scan, join online, or ask for
 * leave). Closing it returns to the day it was opened from.
 */
export function SessionSheet({ s, onClose, today }: { s: ClinicSession | null; onClose: () => void; today: string }) {
  // The sheet keeps showing the last session while it slides away.
  const [last, setLast] = React.useState<ClinicSession | null>(s);
  if (s && s !== last) setLast(s);
  const x = s ?? last;
  const leave = (path: "/clinic/scan" | "/clinic/leave") => {
    onClose();
    go(path);
  };
  const cancelled = x?.status === "cancelled";
  const canScan = !!x?.mine && !cancelled && (x.mine.state === "open" || x.mine.state === "in");
  const canAsk = !!x?.mine && !cancelled && x.date >= today && x.mine.state === "upcoming";
  const where = x ? x.place || (x.link || x.kind === "online_class" ? "Online" : "") : "";
  return (
    <Sheet open={!!s} onClose={onClose} title={x ? sessionTitle(x) : ""} testID="session-sheet">
      {x ? (
        <View style={{ gap: space[4] }}>
          <View>
            <Fact label="When">{`${relDay(x.date, today) === dateLabel(x.date) ? dateLabel(x.date, true) : `${relDay(x.date, today)}, ${dateLabel(x.date)}`}, ${rangeLabel(x.start, x.end)}`}</Fact>
            {where ? <Fact label="Where">{where}</Fact> : null}
            <Fact label="What">{`${KIND_NAME[x.kind]}${x.compulsory ? ", you must attend" : ", optional"}`}</Fact>
            {x.mine && !cancelled ? (
              <Fact label="You">
                <View style={{ gap: space[1] }}>
                  <StatePill s={x.mine.state} late={x.mine.late} />
                  {x.mine.inAt ? (
                    <T v="small" tone="muted" num>
                      In {clockOf(x.mine.inAt)}
                      {x.mine.outAt ? ` · Out ${clockOf(x.mine.outAt)}` : ""}
                    </T>
                  ) : null}
                  {x.mine.leaveAt ? (
                    <T v="small" tone="muted" num>
                      Leaving early at {timeLabel(x.mine.leaveAt)}
                    </T>
                  ) : null}
                </View>
              </Fact>
            ) : null}
            {cancelled || x.status === "moved" || x.note ? (
              <Fact label={cancelled ? "Cancelled" : x.status === "moved" ? "Moved" : "Note"}>
                <T tone={cancelled || x.status === "moved" ? "alert" : "ink"}>{x.note || (cancelled ? "This session is not happening." : "The time has changed.")}</T>
              </Fact>
            ) : null}
          </View>
          {canScan ? <Button label={x.mine?.state === "in" ? "Scan to mark OUT" : "Scan to mark IN"} onPress={() => leave("/clinic/scan")} testID="session-scan" /> : null}
          {x.link && !cancelled ? <Button kind={canScan ? "quiet" : "primary"} label="Join online" onPress={() => openLink(x.link!)} testID="session-join" /> : null}
          {canAsk ? <Button kind="quiet" label="Ask for leave" onPress={() => leave("/clinic/leave")} testID="session-leave" /> : null}
        </View>
      ) : null}
    </Sheet>
  );
}
