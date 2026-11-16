import { act, fireEvent, screen } from "@testing-library/react-native";
import * as React from "react";
import { Linking } from "react-native";

import { ApiFailure } from "@/api/errors";
import { markOffline, markOnline, netStore } from "@/api/online";
import { Button, ComingSoon, Loaded, OfflineLine } from "@/ds";
import { render } from "./utils";

afterEach(() => {
  markOnline();
});

describe("offline line", () => {
  it("shows while offline and greys out actions that need the server", async () => {
    const press = jest.fn();
    await render(
      <>
        <OfflineLine />
        <Button label="Post" needsServer onPress={press} />
      </>,
    );
    expect(screen.queryByTestId("offline-line")).toBeNull();
    await act(async () => markOffline());
    expect(netStore.get().offline).toBe(true);
    expect(screen.getByText("Offline, showing saved")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Post" }));
    expect(press).not.toHaveBeenCalled();
    await act(async () => markOnline());
    expect(screen.queryByTestId("offline-line")).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Post" }));
    expect(press).toHaveBeenCalledTimes(1);
  });
});

describe("coming soon", () => {
  it("opens the same page on the website", async () => {
    const open = jest.spyOn(Linking, "openURL").mockResolvedValue(undefined);
    await render(<ComingSoon web="/study/notes" />);
    await fireEvent.press(screen.getByText("Open on the website"));
    expect(open).toHaveBeenCalledWith(expect.stringMatching(/\/study\/notes$/));
    expect(screen.getByText("Back")).toBeTruthy();
  });

  it("Loaded turns a missing route into the coming soon state", async () => {
    const q = { data: undefined, isError: true, error: new ApiFailure("not_found", "x", 404), refetch: jest.fn(), failureCount: 1 } as never;
    await render(<Loaded q={q} soon="/journey">{() => null}</Loaded>);
    expect(screen.getByTestId("soon-web")).toBeTruthy();
  });

  it("says Still trying once a try has failed", async () => {
    const q = { data: undefined, isError: false, error: null, refetch: jest.fn(), failureCount: 1 } as never;
    await render(<Loaded q={q}>{() => null}</Loaded>);
    // The skeleton (and the line under it) shows after Loaded's 120ms wait.
    expect(await screen.findByText("Still trying...")).toBeTruthy();
  });
});
