import { groupFor, homeHref, hrefFor, pathFromLink } from "@/nav/targets";
import { admin, lectureOnly, student } from "@/api/mock/fixtures";

describe("links into the app", () => {
  it("opens the setup link from the welcome email", () => {
    expect(pathFromLink("https://vibhapsychology.com/setup?token=abc123")).toBe("/setup?token=abc123");
    expect(pathFromLink("vibha://setup?token=abc123")).toBe("/setup?token=abc123");
  });
  it("maps website paths to app screens", () => {
    expect(pathFromLink("https://vibhapsychology.com/courses/course-1/lessons/l5")).toBe("/lecture/l5");
    expect(pathFromLink("https://vibhapsychology.com/courses/course-1")).toBe("/course/course-1");
    expect(pathFromLink("https://vibhapsychology.com/dashboard")).toBe("/");
    expect(pathFromLink("https://vibhapsychology.com/doubts/d1")).toBe("/doubt/d1");
    expect(pathFromLink("https://vibhapsychology.com/verify/VIBHA-1")).toBe("/verify/VIBHA-1");
    expect(pathFromLink("https://vibhapsychology.com/practice/medicines/lithium")).toBe("/medicine/lithium");
    expect(pathFromLink("vibha://lecture/l5")).toBe("/lecture/l5");
    expect(pathFromLink("/study/m02/s2")).toBe("/study/m02/s2");
  });
  it("turns server targets into screens, and says when there is none", () => {
    expect(hrefFor({ screen: "lecture", courseId: "c", lessonId: "l5", web: "/" })).toBe("/lecture/l5");
    expect(hrefFor({ screen: "studyCheckpoint", moduleId: "m02", n: 1, web: "/" })).toBe("/study/m02/checkpoint/1");
    expect(hrefFor({ screen: "practice", tool: "prep", web: "/" })).toBe("/prep");
    expect(hrefFor({ screen: "game", game: "quickfire", web: "/" })).toBe("/game/quickfire");
    expect(hrefFor({ screen: "unknown", web: "/odd" })).toBeNull();
  });
  it("puts each account in its own tabs", () => {
    expect(groupFor(student)).toBe("(student)");
    expect(groupFor(lectureOnly)).toBe("(lecture)");
    expect(groupFor(admin)).toBe("(admin)");
    expect(homeHref(lectureOnly)).toBe("/lo/home");
    expect(homeHref(admin)).toBe("/admin/home");
  });
});
