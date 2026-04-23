import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "./logger";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function query<T = any>(
  table: string,
  filter: Record<string, any>,
): Promise<T | null> {
  let q = supabase.from(table).select("*");
  for (const [key, val] of Object.entries(filter)) {
    q = q.eq(key, val);
  }
  const { data, error } = await q.single();
  if (error) {
    logger.warn(`Query ${table} failed`, { error: error.message, filter });
    return null;
  }
  return data as T;
}

export async function upsert(table: string, record: Record<string, any>): Promise<boolean> {
  const { error } = await supabase.from(table).upsert(record);
  if (error) {
    logger.error(`Upsert ${table} failed`, { error: error.message });
    return false;
  }
  return true;
}

// escape HTML in symbol names
