import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { StyleSheet, Text } from "react-native";

import { followUpDate, followUpLine } from "@/admin/format";
import { adminMock } from "@/admin/mock";
import { AdminDoubtScreen } from "@/admin/screens/doubts";
import { AdminPeopleScreen, AdminPersonScreen } from "@/admin/screens/people";
import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { FlowGap, Reveal } from "@/motion";
import { render } from "./utils";

const params = useLocalSearchParams as jest.Mock;

async function signInAs(email: string) {
  if (session.store.get().phase !== "visitor" && session.store.get().phase !== "loading") await session.signOut();
  await session.signIn(email, "pw");
  await session.choosePin("2580");
}

beforeAll(async () => {
  await session.boot();
});
beforeEach(() => {
  mock.reset();
  params.mockReturnValue({});
  (router.push as jest.Mock).mockClear();
  (router.back as jest.Mock).mockClear();
});

/** The gap of the nearest view above this text that sets one. */
function gapAbove(text: string): unknown {
  let n = screen.getByText(text).parent;
  while (n) {
    const g = StyleSheet.flatten(n.props.style)?.gap;
    if (g !== undefined) return g;
    n = n.parent;
  }
  return undefined;
}

describe("loaded content keeps the column's gap", () => {
  it("Reveal spaces its parts like the screen around it (they touched before)", async () => {
    await render(
      <FlowGap.Provider value={24}>
        <Reveal>
          <Text>One</Text>
          <Text>Two</Text>
        </Reveal>
      </FlowGap.Provider>,
    );
    expect(gapAbove("One")).toBe(24);
  });

  it("Reveal outside a column adds no gap", async () => {
    await render(
      <Reveal>
        <Text>Alone</Text>
      </Reveal>,
    );
    expect(gapAbove("Alone")).toBeUndefined();
  });
});

describe("people follow-ups", () => {
  it("count calendar days on the phone, not rounded hours", () => {
    // 10pm today, follow-up at 9am tomorrow: 11 hours away, but it is tomorrow.
    const now = new Date(2026, 10, 16, 22, 0).getTime();
    expect(followUpLine(new Date(2026, 10, 17, 9, 0).toISOString(), now)).toBe("Follow up in 1 d");
    expect(followUpLine(new Date(2026, 10, 16, 9, 0).toISOString(), now)).toBe("Follow up today");
    expect(followUpLine(new Date(2026, 10, 15, 23, 0).toISOString(), now)).toBe("Follow up was due 1 d ago");
  });

  it("pick tomorrow by the phone's calendar (just after midnight it gave today)", () => {
    expect(followUpDate(1, new Date(2026, 10, 17, 1, 0).getTime())).toBe("2026-11-18");
    expect(followUpDate(7, new Date(2026, 11, 28, 12, 0).getTime())).toBe("2027-01-04");
  });

  it("moving the stage keeps the follow-up date (it was cleared every time)", async () => {
    await signInAs("admin@example.com");
    const before = adminMock.state().people.find((p) => p.key === "farhan@example.com")?.followUpAt;
    expect(before).toBeTruthy();
    params.mockReturnValue({ key: "farhan@example.com" });
    await render(<AdminPersonScreen />);
    await screen.findByText("Farhan Ali");
    await fireEvent.press(screen.getByTestId("person-stage"));
    await fireEvent.press(screen.getByTestId("stage-fee_shared"));
    await fireEvent.press(screen.getByTestId("stage-save"));
    await waitFor(() => expect(adminMock.state().people.find((p) => p.key === "farhan@example.com")?.stage).toBe("fee_shared"));
    expect(adminMock.state().people.find((p) => p.key === "farhan@example.com")?.followUpAt).toBe(before);
  });
});

describe("admin actions that are hard to take back", () => {
  it("hiding a doubt asks first", async () => {
    await signInAs("admin@example.com");
    params.mockReturnValue({ id: "ad1" });
    await render(<AdminDoubtScreen />);
    await screen.findByText("Is flat affect the same as blunted affect?");
    await fireEvent.press(screen.getByTestId("doubt-hide"));
    expect(adminMock.state().doubts.find((d) => d.id === "ad1")?.status).not.toBe("hidden");
    await fireEvent.press(await screen.findByTestId("confirm-go"));
    await waitFor(() => expect(adminMock.state().doubts.find((d) => d.id === "ad1")?.status).toBe("hidden"));
  });

  it("People: ticking someone shows the email and WhatsApp bar", async () => {
    await signInAs("admin@example.com");
    await render(<AdminPeopleScreen />);
    await screen.findByText("Tanvi Gupta");
    expect(screen.queryByTestId("people-bar")).toBeNull();
    await fireEvent.press(screen.getByTestId("people-all"));
    expect(await screen.findByTestId("people-bar")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("people-email"));
    expect(await screen.findByTestId("contact-subject")).toBeTruthy();
  });
});
