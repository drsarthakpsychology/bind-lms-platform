import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import type { Db } from "./data";

/** The service-role client for clinic reads and writes (callers check the role first). */
export const clinicDb = (): Db => createAdminClient() as unknown as Db;
