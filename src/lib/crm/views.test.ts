import { describe, expect, it } from "vitest";
import type { Person } from "./people";
import { DAY, filterPipeline, followUpDue, inView, lastContactBucket, sourcesOf, viewCounts, waLink, waMessage } from "./views";

const NOW = new Date("2026-11-15T06:30:00Z").getTime();
const ago = (days: number) => new Date(NOW - days * DAY).toISOString();

function person(over: Partial<Person>): Person {
  return {
    key: "k",
    email: "a@x.co",
    name: "Aanya Rao",
    phone: null,
    isStudent: false,
    isEnquiry: false,
    stage: "new",
    followUpAt: null,
    enquiredAt: null,
    source: null,
    studentId: null,
    signedIn: false,
    locked: false,
    setupDone: false,
    inviteSentAt: null,
    emailsSent: 0,
    opened: false,
    replied: false,
    lastContactAt: null,
    contacted: false,
    lastSeen: null,
    paidAt: null,
    paidAmount: null,
    cohorts: [],
    college: null,
    message: null,
    ...over,
  };
}

const enquiryNew = person({ email: "new@x.co", isEnquiry: true, enquiredAt: ago(2), source: "instagram" });
const enquiryOld = person({ email: "old@x.co", isEnquiry: true, enquiredAt: ago(40), stage: "contacted", lastContactAt: ago(20), source: "website" });
const feeShared = person({ email: "fee@x.co", isEnquiry: true, enquiredAt: ago(10), stage: "fee_shared", lastContactAt: ago(1) });
const invited = person({ email: "inv@x.co", isStudent: true, stage: "joined", inviteSentAt: ago(5), cohorts: [{ id: "c2", name: "Cohort 2" }] });
const joinedPaid = person({ email: "paid@x.co", isStudent: true, stage: "joined", setupDone: true, inviteSentAt: ago(30), paidAt: ago(29), cohorts: [{ id: "c2", name: "Cohort 2" }] });
const joinedUnpaid = person({ email: "unpaid@x.co", isStudent: true, stage: "joined", setupDone: true, signedIn: true, inviteSentAt: ago(30), lastContactAt: ago(3), cohorts: [{ id: "c1", name: "Cohort 1" }] });
const notInterested = person({ email: "no@x.co", isEnquiry: true, enquiredAt: ago(60), stage: "not_interested" });
const all = [enquiryNew, enquiryOld, feeShared, invited, joinedPaid, joinedUnpaid, notInterested];
const emails = (list: Person[]) => list.map((p) => p.email).sort();

describe("pipeline quick views", () => {
  it("not paid yet: fee shared, invited or joined, and not marked paid", () => {
    expect(emails(all.filter((p) => inView(p, "not_paid", NOW)))).toEqual(["fee@x.co", "inv@x.co", "unpaid@x.co"]);
  });
  it("invited but not joined: an invite or account, login never set up", () => {
    expect(emails(all.filter((p) => inView(p, "invited", NOW)))).toEqual(["inv@x.co"]);
  });
  it("enquired but not converted leaves out students and people who said no", () => {
    expect(emails(all.filter((p) => inView(p, "not_converted", NOW)))).toEqual(["fee@x.co", "new@x.co", "old@x.co"]);
  });
  it("went quiet: no contact in N days; never contacted counts from when they arrived", () => {
    expect(emails(all.filter((p) => inView(p, "quiet", NOW, 14)))).toEqual(["old@x.co"]);
    // 30 days: the 20-day-old contact is not quiet yet.
    expect(emails(all.filter((p) => inView(p, "quiet", NOW, 30)))).toEqual([]);
    // 3 days: the invite from 5 days ago that nobody followed up joins them; paid and joined people never do.
    expect(emails(all.filter((p) => inView(p, "quiet", NOW, 3)))).toEqual(["inv@x.co", "old@x.co", "unpaid@x.co"]);
  });
  it("joined", () => {
    expect(emails(all.filter((p) => inView(p, "joined", NOW)))).toEqual(["inv@x.co", "paid@x.co", "unpaid@x.co"]);
  });
});

describe("pipeline filters", () => {
  it("filters by cohort and stage together with a view", () => {
    expect(emails(filterPipeline(all, { view: "not_paid", cohortId: "c1" }, NOW))).toEqual(["unpaid@x.co"]);
    expect(emails(filterPipeline(all, { stage: "fee_shared" }, NOW))).toEqual(["fee@x.co"]);
  });
  it("filters by source, search and date range (India days)", () => {
    expect(emails(filterPipeline(all, { source: "instagram" }, NOW))).toEqual(["new@x.co"]);
    expect(emails(filterPipeline(all, { q: "OLD@" }, NOW))).toEqual(["old@x.co"]);
    expect(emails(filterPipeline(all, { from: "2026-11-01", to: "2026-11-15" }, NOW))).toEqual(["fee@x.co", "inv@x.co", "new@x.co"]);
  });
  it("filters by last contact", () => {
    expect(lastContactBucket(joinedUnpaid, NOW)).toBe("week");
    expect(lastContactBucket(enquiryOld, NOW)).toBe("month");
    expect(emails(filterPipeline(all, { lastContact: "never" }, NOW))).toEqual(["inv@x.co", "new@x.co", "no@x.co", "paid@x.co"]);
  });
  it("counts each view under the other filters", () => {
    const c = viewCounts(all, { cohortId: "c2" }, NOW);
    expect(c.all).toBe(2);
    expect(c.not_paid).toBe(1);
    expect(c.joined).toBe(2);
  });
  it("lists sources, with words for people without one", () => {
    expect(sourcesOf(all)).toEqual(["Added as a student", "instagram", "website"]);
  });
});

describe("WhatsApp links", () => {
  it("adds India's code to a 10-digit number and fills the first name", () => {
    expect(waLink("098765 43210")).toBe("https://wa.me/919876543210");
    expect(waLink("+44 7700 900123")).toBe("https://wa.me/447700900123");
    expect(waLink("123")).toBeNull();
    expect(waMessage("Hi {first_name}, fee details for {name}", { name: "aanya rao", email: "a@x.co" })).toBe("Hi Aanya, fee details for aanya rao");
  });
});

describe("follow-up due filter (Admin Today links to it)", () => {
  const overdue = person({ email: "due@x.co", isEnquiry: true, followUpAt: ago(1) });
  const tomorrow = person({ email: "soon@x.co", isEnquiry: true, followUpAt: new Date(NOW + 0.5 * DAY).toISOString() });
  const later = person({ email: "later@x.co", isEnquiry: true, followUpAt: new Date(NOW + 5 * DAY).toISOString() });
  const list = [overdue, tomorrow, later, enquiryNew];
  it("keeps only follow-ups planned before this time tomorrow", () => {
    expect(emails(filterPipeline(list, { due: true }, NOW))).toEqual(["due@x.co", "soon@x.co"]);
    expect(followUpDue(later, NOW)).toBe(false);
    expect(filterPipeline(list, {}, NOW)).toHaveLength(4);
  });
  it("the quick view counts follow the filter", () => {
    expect(viewCounts(list, { due: true }, NOW).all).toBe(2);
  });
});

describe("Not enrolled yet / Enrolled filter", () => {
  it("not enrolled: no cohort and not paid; enrolled is the rest", () => {
    expect(emails(filterPipeline(all, { enrol: "not_enrolled" }, NOW))).toEqual(["fee@x.co", "new@x.co", "no@x.co", "old@x.co"]);
    expect(emails(filterPipeline(all, { enrol: "enrolled" }, NOW))).toEqual(["inv@x.co", "paid@x.co", "unpaid@x.co"]);
  });
});
