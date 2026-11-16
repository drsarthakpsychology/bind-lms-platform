import { fireEvent, screen } from "@testing-library/react-native";
import { Linking } from "react-native";
import * as React from "react";

import * as fx from "@/api/mock/fixtures";
import { session } from "@/auth";
import { hrefFor } from "@/nav/targets";
import { MaterialBody, absoluteUrl, materialWebUrl, viewFor } from "@/screens/lecture/material";
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

  it("Open on the website opens the material's own page, not the home page", async () => {
    expect(materialWebUrl("m 1", "c1", "https://vibhapsychology.com/")).toBe("https://vibhapsychology.com/courses/c1/materials/m%201");
    expect(materialWebUrl("m1", null, "https://vibhapsychology.com")).toBe("https://vibhapsychology.com/courses");
    const open = jest.spyOn(Linking, "openURL").mockResolvedValue(undefined);
    const doc = { id: "m9", title: "Case notes", kind: "doc", format: "docx", sizeBytes: null, lessonId: "l5", courseId: null, week: 2, url: null, filePath: "/api/app/v1/materials/m9/file" } as const;
    await render(<MaterialBody m={doc} courseId="course-1" />);
    await fireEvent.press(screen.getByText("Open on the website"));
    expect(open).toHaveBeenCalledWith(expect.stringMatching(/\/courses\/course-1\/materials\/m9$/));
    open.mockRestore();
  });

  it("a material link from a notification carries its course", () => {
    expect(hrefFor({ screen: "material", courseId: "c1", materialId: "m1", web: "/courses/c1/materials/m1" })).toBe("/material/m1?course=c1");
  });
});
