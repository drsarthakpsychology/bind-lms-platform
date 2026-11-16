/** Round 3 of the app bug hunt: real-shaped server data and release-only behaviour. */
import { todoHref } from "@/admin/safe";
import { refEntryView } from "@/api/adapt-learn";
import { decodeSafe, queryOf } from "@/lib/query";

describe("addresses from the server never throw", () => {
  it("queryOf keeps '=' inside a value, takes a name without a value, and survives a stray %", () => {
    expect(queryOf("?a=1&b=x=y&c&d=50%&e=two+words&a=2")).toEqual({ a: "1", b: "x=y", c: "", d: "50%", e: "two words" });
    expect(queryOf(null)).toEqual({});
    expect(decodeSafe("%E0%A4")).toBe("%E0%A4");
    expect(decodeSafe("a%20b+c")).toBe("a b+c");
  });
  it("an admin Home to-do with a broken address still opens (React Native's URLSearchParams threw)", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const RN = require("react-native/Libraries/Blob/URLSearchParams").URLSearchParams;
    expect(() => new RN("view=50%").get("view")).toThrow();
    expect(todoHref("/admin/people?view=50%")).toEqual({ app: "/admin/people?view=50%25" });
    expect(todoHref("/admin/activity?view=behind")).toEqual({ app: "/admin/activity?view=behind" });
    expect(todoHref("/admin/emails?folder=inbox")).toEqual({ app: "/admin/messages" });
    expect(todoHref("/admin/new-thing")).toEqual({ web: "/admin/new-thing" });
  });
  it("a medicine entry whose link has a stray % still opens (decodeURIComponent threw inside the adapter)", () => {
    const e = refEntryView({ entry: { kind: "medicine", slug: "lithium", label: "Lithium", data: { fullHref: "/practice/medicines/li%thium?x=1" } } });
    expect(e && e.kind === "medicine" ? e.medId : null).toBe("li%thium");
  });
});
