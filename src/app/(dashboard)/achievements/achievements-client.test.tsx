import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";

vi.mock("./actions", () => ({ downloadMyCertificate: vi.fn() }));
import { AchievementsClient } from "./achievements-client";
import type { MyCredential, MyProgress } from "./actions";

const badge = (over: Partial<MyCredential>): MyCredential => ({
  credential_id: "VIBHA-B-1",
  type: "badge",
  status: "issued",
  title: "MSE basics",
  description: null,
  icon: null,
  tone: "lime",
  issued_at: "2026-11-13T19:00:00Z",
  revoked_at: null,
  revoke_reason: null,
  ...over,
});
const progress: MyProgress[] = [
  { id: "a", type: "badge", title: "MSE basics", description: null, icon: null, tone: "lime", earned: true, status: "earned", progress: "Done" },
  { id: "b", type: "badge", title: "Formulation", description: null, icon: null, tone: "lime", earned: false, status: "locked", progress: "2 of 5 sections" },
];

describe("My Achievements", () => {
  // The page used window.location while rendering, which throws on the server.
  it("renders on the server with an issued badge", () => {
    const html = renderToString(<AchievementsClient earned={[badge({})]} progress={progress} rollNumber={null} siteUrl="https://vibhapsychology.com" />);
    expect(html).toContain("https://vibhapsychology.com/verify/VIBHA-B-1");
    // India date: 19:00 UTC on 13 Nov is 14 Nov in India.
    expect(html).toContain("Issued 14 Nov 2026");
  });

  it("does not offer sharing for a badge that is not issued", () => {
    const html = renderToString(<AchievementsClient earned={[badge({ status: "revoked", revoked_at: "2026-11-10T10:00:00Z" })]} progress={[]} rollNumber={null} siteUrl="https://x.test" />);
    expect(html).toContain("Revoked 10 Nov 2026");
    expect(html).not.toContain("Share on LinkedIn");
  });

  it("lists only what is still to earn under Up next", () => {
    const html = renderToString(<AchievementsClient earned={[badge({})]} progress={progress} rollNumber={null} siteUrl="https://x.test" />);
    expect(html).toContain("2 of 5 sections");
    expect(html).not.toContain(">Done<");
  });
});
