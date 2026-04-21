/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getStudentSchedules() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user)
    throw new Error("Sesi tidak valid atau telah berakhir.");

  try {
    // 1. Cari tahu siswa ini ada di kelas mana
    const { data: profile } = await supabase
      .from("profiles")
      .select("class_id")
      .eq("id", user.id)
      .single();

    const classId = profile?.class_id;

    // 2. Kunci zona waktu hari ini di WIB biar jadwal kemarin nggak muncul
    const todayWIB = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Jakarta",
    });
    const startOfDay = `${todayWIB}T00:00:00+07:00`;

    // 3. Tarik jadwal (Filter: Hanya kelas dia ATAU jadwal global yang class_id nya null)
    let query = supabase
      .from("schedules")
      .select(
        `
        id, 
        title, 
        event_date, 
        content, 
        is_announcement, 
        is_active,
        class:classes(name),
        author:profiles!author_id(full_name)
      `,
      )
      .eq("is_deleted", false)
      .gte("event_date", startOfDay)
      .order("event_date", { ascending: true });

    if (classId) {
      query = query.or(`class_id.eq.${classId},class_id.is.null`);
    } else {
      query = query.is("class_id", null);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return data;
  } catch (error: any) {
    throw new Error("Gagal memuat jadwal: " + error.message);
  }
}
