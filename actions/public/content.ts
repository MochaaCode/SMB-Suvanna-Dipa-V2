"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * AMBIL KONTEN UNTUK LANDING PAGE
 * Hanya mengambil konten yang is_published = true
 */
export async function getPublishedContent() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("public_content")
    .select("section, content")
    .eq("is_published", true);

  if (error) {
    console.error("Gagal narik konten publik:", error.message);
    return [];
  }

  return data;
}
