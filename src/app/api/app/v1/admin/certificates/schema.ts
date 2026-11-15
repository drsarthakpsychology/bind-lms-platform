import { z } from "zod";
import { CERT_KINDS } from "@/lib/certificates/kinds";
import { MAX_RECIPIENTS } from "@/lib/certificates/issue-input";

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const text = (n: number) => z.string().max(n).optional();

/** The studio form (the website's StudioIssueInput); the server's checkIssue still runs before anything is written. */
export const studioSchema = z.object({
  kind: z.enum(CERT_KINDS),
  title: z.string().max(200),
  heading: text(200),
  lead: text(200),
  connector: text(200),
  citation: text(2000),
  courseId: z.string().uuid().nullable().optional(),
  courseLabel: text(200),
  moduleLabel: text(200),
  issuedOn: day,
  expiresOn: day.nullable().optional().or(z.literal("")),
  signatories: z.array(z.object({ name: z.string().max(120), role: z.string().max(120), signatureFrom: z.string().max(120).nullable().optional() })).max(4),
  recipients: z.array(z.object({ userId: z.string().uuid(), name: z.string().max(160) })).max(MAX_RECIPIENTS),
  cohortId: z.string().uuid().nullable().optional(),
  email: z.boolean(),
  replaces: z.string().max(40).nullable().optional(),
});
