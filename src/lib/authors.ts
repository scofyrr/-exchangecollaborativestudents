import { supabase } from "@/integrations/supabase/client";

export type AuthorMini = { id: string; dni: string; full_name: string; level: number; grade?: string };

export async function fetchAuthors(ids: string[]): Promise<Record<string, AuthorMini>> {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  if (!unique.length) return {};
  const { data } = await supabase
    .from("profiles")
    .select("id, dni, full_name, level, grade")
    .in("id", unique);
  const map: Record<string, AuthorMini> = {};
  (data ?? []).forEach((p: any) => { map[p.id] = p; });
  return map;
}
