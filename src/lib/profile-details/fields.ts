import { normalizeIndianMobile } from "@/lib/phone";

/** The first-login details form: fields, choices and checks (shared by the form and the server). */
export const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
  "Lakshadweep", "Puducherry", "Outside India",
] as const;

export const QUALIFICATIONS = [
  "Class 12",
  "Studying for a bachelor's degree",
  "Bachelor's degree",
  "Studying for a master's degree",
  "Master's degree",
  "MPhil or PhD",
  "Other",
] as const;

export const OCCUPATIONS = ["Student", "Working", "Studying and working", "Taking a break", "Other"] as const;

export type Details = {
  full_name: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  qualification: string;
  institution: string;
  occupation: string;
};

export const EMPTY_DETAILS: Details = { full_name: "", phone: "", city: "", state: "", country: "India", qualification: "", institution: "", occupation: "" };

export const LABELS: Record<keyof Details, string> = {
  full_name: "Full name",
  phone: "Mobile (WhatsApp)",
  city: "City",
  state: "State",
  country: "Country",
  qualification: "Highest qualification",
  institution: "College or workplace",
  occupation: "Right now you are",
};

/** Clean and check every field. Returns the cleaned details, or errors per field. */
export function checkDetails(raw: Partial<Details>): { ok: true; value: Details } | { ok: false; errors: Partial<Record<keyof Details, string>> } {
  const t = (s: unknown) => String(s ?? "").replace(/\s+/g, " ").trim();
  const v: Details = {
    full_name: t(raw.full_name),
    phone: t(raw.phone),
    city: t(raw.city),
    state: t(raw.state),
    country: t(raw.country) || "India",
    qualification: t(raw.qualification),
    institution: t(raw.institution),
    occupation: t(raw.occupation),
  };
  const errors: Partial<Record<keyof Details, string>> = {};
  if (v.full_name.length < 3 || !/\s/.test(v.full_name)) errors.full_name = "Write your first and last name.";
  if (v.full_name.length > 80) errors.full_name = "That name is too long.";
  if (v.state === "Outside India") {
    if (!/^\+?[0-9 -]{8,16}$/.test(v.phone)) errors.phone = "Enter your number with the country code.";
    if (!v.country || /^india$/i.test(v.country)) errors.country = "Which country do you live in?";
  } else {
    const n = normalizeIndianMobile(v.phone);
    if (!n) errors.phone = "Enter a 10-digit Indian mobile number.";
    else v.phone = n;
    v.country = "India";
  }
  if (v.city.length < 2) errors.city = "Which city do you live in?";
  if (!(STATES as readonly string[]).includes(v.state)) errors.state = "Pick your state.";
  if (!(QUALIFICATIONS as readonly string[]).includes(v.qualification)) errors.qualification = "Pick one.";
  if (v.institution.length < 2) errors.institution = "Write your college or workplace.";
  if (!(OCCUPATIONS as readonly string[]).includes(v.occupation)) errors.occupation = "Pick one.";
  for (const k of ["city", "institution"] as const) if (v[k].length > 120) errors[k] = "That's too long.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value: v };
}
