import { z } from "zod";

/** The no-account certificate form (the website's AnyoneCertInput); the website's checkAnyone still runs. */
export const anyoneSchema = z.object({
  name: z.string().max(200),
  email: z.string().max(320),
  phone: z.string().max(40).nullable().optional(),
  title: z.string().max(300),
  paragraph: z.string().max(2000),
  heading: z.string().max(200).optional(),
  lead: z.string().max(200).optional(),
  issuedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  signatureFrom: z.string().max(120).nullable().optional(),
  emailIt: z.boolean().optional(),
});
export type AnyoneBody = z.infer<typeof anyoneSchema>;

export const anyoneInput = (b: AnyoneBody) => ({
  name: b.name,
  email: b.email,
  phone: b.phone ?? "",
  title: b.title,
  paragraph: b.paragraph,
  heading: b.heading,
  lead: b.lead,
  issuedOn: b.issuedOn,
  signatureFrom: b.signatureFrom ?? null,
});
