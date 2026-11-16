import { fireEvent, screen } from "@testing-library/react-native";
import * as React from "react";

import { DateField } from "@/admin/date-field";
import { datesIn, monthGrid, shortDay } from "@/admin/format";
import { render } from "./utils";

const NOW = Date.parse("2026-11-16T08:00:00Z");

describe("admin dates", () => {
  it("read as 16 Nov, with the year only when it is another year", () => {
    expect(shortDay("2026-11-16", NOW)).toBe("16 Nov");
    expect(shortDay("2027-06-30", NOW)).toBe("30 Jun 2027");
    expect(datesIn("2026-11-06 · St. Xavier's", NOW)).toBe("6 Nov · St. Xavier's");
    expect(datesIn("Enquired 2026-11-16T05:00:00Z", NOW)).toBe("Enquired 16 Nov");
    expect(datesIn("Roll 2026-A", NOW)).toBe("Roll 2026-A");
  });

  it("lay a month out from Sunday", () => {
    const nov = monthGrid(2026, 10); // 1 Nov 2026 is a Sunday
    expect(nov[0]).toBe(1);
    expect(nov.length % 7).toBe(0);
    const feb = monthGrid(2027, 1); // 1 Feb 2027 is a Monday
    expect(feb[0]).toBeNull();
    expect(feb[1]).toBe(1);
    expect(feb.filter(Boolean)).toHaveLength(28);
  });

  it("are picked from a calendar, never typed", async () => {
    const onChange = jest.fn();
    await render(<DateField label="Issue date" value="2026-11-16" onChange={onChange} testID="d" />);
    expect(screen.getByText("16 Nov 2026")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("d"));
    await fireEvent.press(screen.getByTestId("date-2026-11-20"));
    expect(onChange).toHaveBeenCalledWith("2026-11-20");
  });
});
