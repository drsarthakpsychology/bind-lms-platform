import { meView } from "@/api/adapt";
import * as F from "@/api/mock/fixtures";
import { nextReads, routeReads, tabReads } from "@/api/prefetch";

const fx = { student: meView(F.student), lecturesOnly: meView(F.lectureOnly), admin: meView(F.admin) };

const keysOf = (r: { queryKey: readonly unknown[] }[]) => r.map((x) => JSON.stringify(x.queryKey));

describe("prefetch", () => {
  it("maps addresses to the reads their screens ask for first", () => {
    expect(keysOf(routeReads("/study/m02"))).toEqual(['["module","m02"]']);
    expect(keysOf(routeReads("/study/m02/s1?from=home"))).toEqual(['["section","m02","s1"]', '["module","m02"]', '["marks"]']);
    expect(keysOf(routeReads("/lecture/l5?tab=materials"))).toEqual(['["lecture","l5"]']);
    expect(keysOf(routeReads("/prep/cognitive"))).toEqual(['["practise","read","/prep/subjects/cognitive"]']);
    expect(routeReads("/prep/set?subject=x")).toEqual([]);
    // An Exam Prep set loads on the tap, so its first question is there when the screen draws.
    expect(keysOf(routeReads("/prep/set?subject=statistics&topic=t-test&set=2"))).toEqual(['["prepSet","/prep/subjects/statistics/topics/t-test?set=2"]']);
    expect(keysOf(routeReads("/prep/set?list=smart"))).toEqual(['["prepSet","/prep/smart"]']);
    expect(keysOf(routeReads("/prep/set?list=wrong"))).toEqual(['["prepSet","/prep/lists/wrong"]']);
    expect(keysOf(routeReads("/prep/mock"))).toEqual(['["practise","read","/prep/mock"]']);
    expect(routeReads("/game/blitz")).toEqual([]);
    expect(routeReads("/study/%E0%A4%A")).toHaveLength(1);
  });

  it("loads only the tabs the account has", () => {
    const student = keysOf(tabReads(fx.student));
    expect(student).toContain('["home"]');
    expect(student).toContain('["practise","read","/practise"]');
    expect(keysOf(tabReads(fx.lecturesOnly))).toEqual(['["home"]', '["courses"]', '["doubts","all"]']);
    expect(keysOf(tabReads(fx.admin)).every((k) => k.startsWith('["admin"'))).toBe(true);
    expect(tabReads(null)).toEqual([]);
  });

  it("finds the next step in an answer", () => {
    expect(nextReads(["home"], { step: { target: { screen: "studySection", moduleId: "m02", sectionId: "s3", web: "" } } })).toEqual(["/study/m02/s3"]);
    expect(nextReads(["module", "m02"], { next: { target: { screen: "studyModule", moduleId: "m03", web: "" } } })).toEqual(["/study/m03"]);
    expect(nextReads(["courses"], { courses: [{ id: "course-1" }] })).toEqual(["/course/course-1"]);
    expect(nextReads(["home"], { step: { target: { screen: "doubts", web: "" } } })).toEqual([]);
    expect(nextReads(["progress"], {})).toEqual([]);
    expect(nextReads(["home"], null)).toEqual([]);
  });
});
