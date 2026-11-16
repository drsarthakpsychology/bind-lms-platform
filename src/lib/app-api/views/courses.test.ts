import { describe, expect, it } from "vitest";

import { materialView } from "./courses";

const row = { id: "m1", title: "Notes", kind: "pdf", format: "pdf", size_bytes: 1200, url: null, storage_path: "materials/m1.pdf", lesson_id: "l1", week: 2 };

describe("materialView", () => {
  it("names the course, so /material/<id> links open the right page on the website", () => {
    expect(materialView({ ...row, course_id: "c1" })).toMatchObject({ id: "m1", courseId: "c1", lessonId: "l1", week: 2, filePath: "/api/app/v1/materials/m1/file" });
  });
  it("says null when the row has no course", () => {
    expect(materialView(row).courseId).toBeNull();
  });
});
