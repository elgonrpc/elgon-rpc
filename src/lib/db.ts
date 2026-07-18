import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "./logger";

const URL = process.env.SUPABASE_URL || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";

export const supabase: SupabaseClient = createClient(URL, SERVICE_KEY);

export function isConfigured(): boolean {
  return Boolean(URL && SERVICE_KEY);
}

export async function upsert(table: string, record: Record<string, unknown>): Promise<boolean> {
  const { error } = await supabase.from(table).upsert(record);
  if (error) {
    logger.error(`upsert ${table} failed`, { error: error.message });
    return false;
  }
  return true;
}
