import { describe, expect, it } from "vitest";
import { answerColumns, identityKeys, makeKey, normalizeFields, pickIdentity, slugKey, validateAnswers, validateFieldDefs, type FormField } from "./fields";

const LEGACY = [
  { key: "full_name", type: "text", label: "Full Name", required: true },
  { key: "email_address", type: "email", label: "Email Address", required: true },
  { key: "mobile_number", type: "phone", label: "Mobile Number", required: true },
  { key: "year_of_study", type: "text", label: "Year of Study", required: true },
  { key: "course_department", type: "text", label: "Course / Department", required: true },
];

describe("normalizeFields", () => {
  it("reads the stored legacy form as is", () => {
    const f = normalizeFields(LEGACY);
    expect(f.map((x) => x.key)).toEqual(LEGACY.map((x) => x.key));
    expect(f[2]).toEqual({ key: "mobile_number", type: "phone", label: "Mobile Number", required: true });
  });
  it("skips junk, maps old type names and never throws", () => {
    expect(normalizeFields(null)).toEqual([]);
    const f = normalizeFields([null, { label: "no key" }, { key: "a", type: "textarea" }, { key: "a", type: "text" }, { key: "b", type: "weird", options: ["x"] }, { key: "c", type: "radio", options: ["x", 3, " y "] }]);
    expect(f).toEqual([
      { key: "a", type: "long_text", label: "A", required: false },
      { key: "b", type: "text", label: "B", required: false },
      { key: "c", type: "single_choice", label: "C", required: false, options: ["x", "y"] },
    ]);
  });
});

describe("keys", () => {
  it("slugs labels and avoids every taken key", () => {
    expect(slugKey("Course / Department")).toBe("course_department");
    expect(slugKey("2nd year?")).toBe("f_2nd_year");
    expect(slugKey("!!!")).toBe("field");
    expect(makeKey("Full Name", ["full_name", "full_name_2"])).toBe("full_name_3");
  });
});

describe("validateFieldDefs", () => {
  it("accepts a good form", () => {
    const r = validateFieldDefs([...LEGACY, { key: "pick", type: "dropdown", label: "Pick", required: false, options: ["A", " B "] }]);
    expect(r.ok && r.fields.at(-1)?.options).toEqual(["A", "B"]);
  });
  it("rejects empty, duplicate keys, bad types and short choice lists", () => {
    expect(validateFieldDefs([]).ok).toBe(false);
    expect(validateFieldDefs([LEGACY[0], LEGACY[0]])).toEqual({ ok: false, error: "Question 2 repeats another question." });
    expect(validateFieldDefs([{ key: "x", type: "file", label: "X" }]).ok).toBe(false);
    expect(validateFieldDefs([{ key: "x", type: "text", label: "  " }])).toEqual({ ok: false, error: "Question 1 needs a question." });
    expect(validateFieldDefs([{ key: "x", type: "single_choice", label: "X", options: ["only"] }]).ok).toBe(false);
    expect(validateFieldDefs([{ key: "x", type: "single_choice", label: "X", options: ["a", "A"] }]).ok).toBe(false);
    expect(validateFieldDefs([{ key: "Bad Key", type: "text", label: "X" }]).ok).toBe(false);
  });
});

const ALL: FormField[] = [
  { key: "name", type: "text", label: "Your name", required: true },
  { key: "email", type: "email", label: "Email", required: true },
  { key: "phone", type: "phone", label: "Phone", required: false },
  { key: "age", type: "number", label: "Age", required: false },
  { key: "dob", type: "date", label: "Date", required: false },
  { key: "about", type: "long_text", label: "About", required: false },
  { key: "year", type: "single_choice", label: "Year", required: true, options: ["1", "2"] },
  { key: "topics", type: "multiple_choice", label: "Topics", required: false, options: ["A", "B", "C"] },
  { key: "city", type: "dropdown", label: "City", required: false, options: ["Ahmedabad", "Surat"] },
  { key: "ok", type: "checkbox", label: "I agree", required: true },
];

describe("validateAnswers", () => {
  it("cleans good answers", () => {
    const r = validateAnswers(ALL, { name: "  Asha ", email: "ASHA@Example.com", phone: "+91 98765 43210", age: "21", dob: "2005-02-28", year: "2", topics: ["C", "A", "A"], city: "Surat", ok: "yes", extra: "ignored" });
    expect(r).toEqual({ ok: true, answers: { name: "Asha", email: "asha@example.com", phone: "+91 98765 43210", age: "21", dob: "2005-02-28", year: "2", topics: ["A", "C"], city: "Surat", ok: "Yes" } });
  });
  it("reports each problem", () => {
    const r = validateAnswers(ALL, { email: "nope", phone: "12", age: "ten", dob: "2025-02-30", topics: ["Z"], city: "Paris" });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors).toEqual({
      name: "Please fill this in.",
      email: "Enter a valid email.",
      phone: "Enter a valid phone number.",
      age: "Enter a number.",
      dob: "Enter a date.",
      year: "Please fill this in.",
      topics: "Pick from the list.",
      city: "Pick from the list.",
      ok: "Please tick this box.",
    });
  });
  it("caps length and records an unticked optional box as No", () => {
    const r = validateAnswers([{ key: "t", type: "text", label: "T", required: false }, { key: "c", type: "checkbox", label: "C", required: false }], { t: "x".repeat(501) });
    expect(r).toEqual({ ok: false, errors: { t: "That is too long." } });
    expect(validateAnswers([{ key: "c", type: "checkbox", label: "C", required: false }], {})).toEqual({ ok: true, answers: { c: "No" } });
  });
});

describe("pickIdentity", () => {
  it("finds name, email and phone on the legacy form", () => {
    const f = normalizeFields(LEGACY);
    expect(pickIdentity(f, { full_name: "Asha", email_address: "a@b.co", mobile_number: "9876543210", course_department: "Psych" })).toEqual({ name: "Asha", email: "a@b.co", phone: "9876543210" });
  });
  it("names the questions behind the identity columns", () => {
    expect(identityKeys(normalizeFields(LEGACY))).toEqual(["full_name", "email_address", "mobile_number"]);
  });
  it("does not take a course or parent name as the person", () => {
    const f: FormField[] = [
      { key: "course_name", type: "text", label: "Course name", required: false },
      { key: "parent", type: "text", label: "Parent name", required: false },
    ];
    expect(pickIdentity(f, { course_name: "BA", parent: "X" }).name).toBeNull();
  });
});

describe("answerColumns", () => {
  it("keeps old answers whose question was removed", () => {
    const cols = answerColumns([{ key: "full_name", type: "text", label: "Name", required: true }], [{ full_name: "A", year_of_study: "2" }, null, { year_of_study: "3" }]);
    expect(cols).toEqual([
      { key: "full_name", label: "Name", removed: false },
      { key: "year_of_study", label: "Year of study", removed: true },
    ]);
  });
});
