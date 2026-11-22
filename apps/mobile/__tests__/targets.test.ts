import { groupFor, homeHref, hrefFor, nativeFor, pathFromLink } from "@/nav/targets";
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

describe("server targets for Prep, medicines and the clinic open the exact screen", () => {
  const practice = (web: string) => hrefFor({ screen: "practice", tool: web.split("/")[2] ?? null, web });
  it("Prep: carry on, smart practice, lists, mocks and long answers", () => {
    expect(practice("/prep")).toBe("/prep");
    expect(practice("/prep/psychopathology/anxiety?set=2")).toBe("/prep/set?subject=psychopathology&topic=anxiety&set=2");
    expect(practice("/prep/psychopathology")).toBe("/prep/psychopathology");
    expect(practice("/prep/smart")).toBe("/prep/set?list=smart");
    expect(practice("/prep/smart/coach?domain=x")).toBe("/prep/set?list=smart");
    expect(practice("/prep/wrong")).toBe("/prep/set?list=wrong");
    expect(practice("/prep/saved")).toBe("/prep/set?list=saved");
    expect(practice("/prep/mock")).toBe("/prep/mock");
    expect(practice("/prep/mock/paper-1")).toBe("/prep/mock/paper-1");
    expect(practice("/prep/mock/result/r1")).toBe("/prep/mock/result/r1");
    expect(practice("/prep/long")).toBe("/prep/long");
    expect(practice("/prep/statistics/long/anova/q3")).toBe("/prep/long?subject=statistics&topic=anova&id=q3");
  });
  it("medicines and the case library", () => {
    expect(practice("/tools/psychopharm/compare")).toBe("/medicine/compare");
    expect(practice("/tools/psychopharm/lithium")).toBe("/medicine/lithium");
    expect(practice("/tools/psychopharm/learn")).toBe("/medicines");
    expect(practice("/practice/medicines/m1")).toBe("/medicine/m1");
    expect(practice("/practice/library")).toBe("/case/library");
    expect(practice("/practice/terms")).toBe("/case/say-it");
  });
  it("journey, boards and the website's clinic pages", () => {
    expect(hrefFor({ screen: "progress", web: "/journey" })).toBe("/journey");
    expect(hrefFor({ screen: "progress", web: "/progress" })).toBe("/progress");
    expect(hrefFor({ screen: "unknown", web: "/leaderboard" })).toBe("/game/leaderboard");
    expect(hrefFor({ screen: "unknown", web: "/leaderboard/shop" })).toBe("/shop");
    expect(hrefFor({ screen: "unknown", web: "/leave" })).toBe("/clinic/leave");
    expect(hrefFor({ screen: "unknown", web: "/opd" })).toBe("/clinic/opd");
    expect(hrefFor({ screen: "unknown", web: "/attendance/scan" })).toBe("/clinic/scan");
    expect(hrefFor({ screen: "unknown", web: "/schedule" })).toBe("/clinic/schedule");
    expect(hrefFor({ screen: "game", game: "leaderboard", web: "/games/leaderboard" })).toBe("/game/leaderboard");
    expect(hrefFor({ screen: "game", game: "blitz", web: "/games/blitz" })).toBe("/game/blitz");
  });
  it("links from outside reach the same screens", () => {
    expect(pathFromLink("https://vibhapsychology.com/prep/smart")).toBe("/prep/set?list=smart");
    expect(pathFromLink("https://vibhapsychology.com/leave")).toBe("/clinic/leave");
    expect(nativeFor("/odd")).toBeNull();
  });
});

describe("every website page the app opens from a link lands on a real screen", () => {
  it.each([
    ["https://vibhapsychology.com/setup?token=abc", "/setup?token=abc"],
    ["https://vibhapsychology.com/clinic", "/clinic/schedule"],
    ["https://vibhapsychology.com/clinic/whatever", "/clinic/schedule"],
    ["https://vibhapsychology.com/leave", "/clinic/leave"],
    ["https://vibhapsychology.com/opd", "/clinic/opd"],
    ["https://vibhapsychology.com/schedule", "/clinic/schedule"],
    ["https://vibhapsychology.com/attendance", "/clinic/attendance"],
    ["https://vibhapsychology.com/dashboard/anything", "/"],
    ["https://vibhapsychology.com/tools/unknown", "/practise"],
    ["https://vibhapsychology.com/tools/psychopharm", "/medicines"],
    ["https://vibhapsychology.com/leaderboard", "/game/leaderboard"],
    ["https://vibhapsychology.com/wall", "/wall"],
    ["https://vibhapsychology.com/assignments", "/assignments"],
    ["https://vibhapsychology.com/journey", "/journey"],
  ])("%s", (link, screen) => {
    expect(pathFromLink(link)).toBe(screen);
  });
});
