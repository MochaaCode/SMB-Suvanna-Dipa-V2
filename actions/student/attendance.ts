/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getMyAttendanceHistory() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user)
    throw new Error("Sesi tidak valid atau telah berakhir.");

  try {
    const { data, error } = await supabase
      .from("attendance_logs")
      .select(
        `
        id,
        status,
        scan_time,
        method,
        notes,
        schedules ( title, event_date )
      `,
      )
      .eq("profile_id", user.id)
      .order("scan_time", { ascending: false });

    if (error) throw new Error(error.message);

    return data;
  } catch (error: any) {
    throw new Error("Gagal memuat riwayat absensi: " + error.message);
  }
}
