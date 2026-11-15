import { screen } from "@testing-library/react-native";
import * as React from "react";

import * as fx from "@/api/mock/fixtures";
import { session } from "@/auth";
import { MaterialBody, absoluteUrl, viewFor } from "@/screens/lecture/material";
import { render } from "./utils";

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});

describe("lecture materials in the app", () => {
  it("picks the right reader for each kind of file", () => {
    expect(viewFor({ kind: "pdf", format: "pdf", url: null, filePath: "/materials/m1/file" })).toBe("pdf");
    expect(viewFor({ kind: "doc", format: "PDF", url: null, filePath: "/x" })).toBe("pdf");
    expect(viewFor({ kind: "image", format: "png", url: null, filePath: "/x" })).toBe("image");
    expect(viewFor({ kind: "audio", format: "mp3", url: null, filePath: "/x" })).toBe("media");
    expect(viewFor({ kind: "link", format: null, url: "https://example.com", filePath: null })).toBe("link");
    expect(viewFor({ kind: "doc", format: "docx", url: null, filePath: "/x" })).toBe("other");
  });

  it("turns the server's file path into a full address", () => {
    expect(absoluteUrl("/api/app/v1/materials/7/file", "https://vibhapsychology.com/api/app/v1")).toBe("https://vibhapsychology.com/api/app/v1/materials/7/file");
    expect(absoluteUrl("/materials/7/file", "https://vibhapsychology.com/api/app/v1/")).toBe("https://vibhapsychology.com/api/app/v1/materials/7/file");
    expect(absoluteUrl("https://cdn.example.com/x.pdf")).toBe("https://cdn.example.com/x.pdf");
  });

  it("shows a PDF as pages inside the app", async () => {
    const m = fx.lectureDetail("l5")!.materials[0]!;
    await render(<MaterialBody m={m} />);
    expect(screen.getAllByText("PHQ-9 scoring sheet").length).toBeGreaterThan(0);
    expect(screen.getByTestId("material-pages")).toBeTruthy();
    expect(screen.getByText(/Nothing is saved on your phone/)).toBeTruthy();
  });

  it("sends the bearer token and the device id for files", async () => {
    const h = await session.authHeaders();
    expect(h.Authorization).toMatch(/^Bearer /);
    expect(h["X-App-Device-Id"]).toMatch(/^[A-Za-z0-9._-]{16,80}$/);
  });
});
