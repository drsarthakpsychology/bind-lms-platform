import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { APP_LINK_PATHS, APP_PACKAGE, appleAssociation, assetLinks, fingerprints } from "./app-links";

const FP = "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5";

describe("app links", () => {
  it("reads fingerprints with or without colons, any case, and drops junk", () => {
    expect(fingerprints(FP.toLowerCase().replace(/:/g, ""))).toEqual([FP]);
    expect(fingerprints(` ${FP}, nonsense, ${FP} `)).toEqual([FP]);
    expect(fingerprints("AB:CD")).toEqual([]);
    expect(fingerprints(undefined)).toEqual([]);
  });

  it("assetlinks.json names the app and its fingerprints, and is empty until set", () => {
    expect(assetLinks("")).toEqual([]);
    const [entry] = assetLinks(FP) as { relation: string[]; target: { package_name: string; sha256_cert_fingerprints: string[] } }[];
    expect(entry!.relation).toEqual(["delegate_permission/common.handle_all_urls"]);
    expect(entry!.target.package_name).toBe(APP_PACKAGE);
    expect(entry!.target.sha256_cert_fingerprints).toEqual([FP]);
  });

  it("the iPhone file needs a 10-letter team id and covers every app page", () => {
    expect(appleAssociation("")).toBeNull();
    expect(appleAssociation("SHORT")).toBeNull();
    const a = appleAssociation("abcde12345")!;
    expect(a.applinks.details[0]!.appIDs).toEqual([`ABCDE12345.${APP_PACKAGE}`]);
    expect(a.applinks.details[0]!.components).toContainEqual({ "/": "/setup" });
    expect(a.applinks.details[0]!.components).toContainEqual({ "/": "/clinic/*" });
  });

  it("the phone app opens the same pages (app.config.ts intent filters), never the password reset link", () => {
    const cfg = readFileSync(path.join(process.cwd(), "apps/mobile/app.config.ts"), "utf8");
    for (const p of APP_LINK_PATHS) expect(cfg).toContain(`pathPrefix: "${p}"`);
    expect(cfg).not.toContain('pathPrefix: "/set-password"');
    expect(APP_LINK_PATHS).not.toContain("/set-password");
  });
});
