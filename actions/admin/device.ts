"use server";

import { createClient } from "@/lib/supabase/server";

export async function toggleDeviceMode(newMode: "scan" | "register") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.app_metadata?.role !== "admin") {
    throw new Error("Akses ditolak: Hanya admin yang bisa mengubah mode alat.");
  }

  const { error } = await supabase
    .from("device_states")
    .update({
      mode: newMode,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "main_scanner");

  if (error) throw new Error(error.message);

  return { success: true, mode: newMode };
}
