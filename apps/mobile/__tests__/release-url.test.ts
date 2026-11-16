/**
 * On a phone, URL is React Native's own small version: it only reads http(s)
 * addresses and glues a base and a path together. These run with that
 * version in place of Node's, so they fail the way a release build did.
 */
import { pathFromLink } from "@/nav/targets";
import { absoluteUrl } from "@/screens/lecture/material";

const NodeURL = globalThis.URL;
beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  globalThis.URL = require("react-native/Libraries/Blob/URL").URL;
});
afterAll(() => {
  globalThis.URL = NodeURL;
});

describe("links that open the app, with the phone's URL", () => {
  it("vibha:// links open their screen, not Home", () => {
    expect(pathFromLink("vibha://lecture/l5")).toBe("/lecture/l5");
    expect(pathFromLink("vibha://setup?token=abc123")).toBe("/setup?token=abc123");
    expect(pathFromLink("vibha:///doubts/d1")).toBe("/doubt/d1");
    expect(pathFromLink("vibha://courses/c1/lessons/l2?tab=assignment")).toBe("/lecture/l2?tab=assignment");
  });
  it("website links and bare paths", () => {
    expect(pathFromLink("https://vibhapsychology.com/verify/VIBHA-1#top")).toBe("/verify/VIBHA-1");
    expect(pathFromLink("https://www.vibhapsychology.com/")).toBe("/");
    expect(pathFromLink("https://vibhapsychology.com")).toBe("/");
    expect(pathFromLink("lecture/l5")).toBe("/lecture/l5");
    expect(pathFromLink("mailto:x@y.z")).toBe("/");
  });
});

describe("material file addresses, with the phone's URL", () => {
  it("a path from the site root is not doubled", () => {
    expect(absoluteUrl("/api/app/v1/materials/m1/file", "https://vibhapsychology.com/api/app/v1")).toBe("https://vibhapsychology.com/api/app/v1/materials/m1/file");
    expect(absoluteUrl("/materials/m1/file", "https://vibhapsychology.com/api/app/v1/")).toBe("https://vibhapsychology.com/api/app/v1/materials/m1/file");
    expect(absoluteUrl("https://cdn.example.com/a.pdf")).toBe("https://cdn.example.com/a.pdf");
  });
});
