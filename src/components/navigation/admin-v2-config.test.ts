import { describe, expect, it } from "vitest";
import { ADMIN_SECTIONS } from "./nav-config";
import { ADMIN_MORE_GROUPS, ADMIN_MORE_MATCH, ADMIN_V2_TABS, adminV2SidebarItems } from "./v2-config";
import { activeNavHref } from "./sections";

describe("admin navigation, new design", () => {
  it("phone tabs: Home, Students, Activity, Messages, More", () => {
    expect(ADMIN_V2_TABS.map((t) => t.label)).toEqual(["Home", "Students", "Activity", "Messages", "More"]);
    expect(ADMIN_V2_TABS.at(-1)?.href).toBe("/admin/more");
  });

  it("More holds every admin place that is not on a tab", () => {
    const labels = ADMIN_MORE_GROUPS.flatMap((g) => g.rows.map((r) => r.label));
    expect(labels).toEqual(["Inbox", "Cohorts", "People", "Review", "Content", "Forms", "Certificates", "Achievements", "System", "Settings"]);
  });

  it("pages reached from More light the More tab; tab pages light their own tab", () => {
    const tabs = ADMIN_V2_TABS.map((t) => ({ ...t }));
    expect(activeNavHref(tabs, "/admin/courses/abc", null)).toBe("/admin/more");
    expect(activeNavHref(tabs, "/admin/credentials/issued", null)).toBe("/admin/more");
    expect(activeNavHref(tabs, "/admin/students/123", null)).toBe("/admin/students");
    expect(activeNavHref(tabs, "/admin/pulse", null)).toBe("/admin/activity");
    expect(activeNavHref(tabs, "/admin", null)).toBe("/admin");
    expect(ADMIN_MORE_MATCH).not.toContain("/admin/students");
  });

  it("desktop sidebar: Home, then four quiet groups, every section once", () => {
    const items = adminV2SidebarItems(ADMIN_SECTIONS);
    expect(items[0]).toMatchObject({ href: "/admin", exact: true });
    expect([...new Set(items.slice(1).map((i) => i.section))]).toEqual(["People", "Messages", "Teach", "Settings"]);
    expect(items.map((i) => i.href).sort()).toEqual(ADMIN_SECTIONS.map((s) => s.href).sort());
  });
});
