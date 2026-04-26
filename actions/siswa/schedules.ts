"use server";

import { createClient } from "@/lib/supabase/server";

export interface StudentScheduleItem {
  id: number;
  title: string;
  event_date: string;
  content: string | null;
  materials: string | null;
  is_announcement: boolean;
  is_active: boolean;
  class: { name: string } | null;
  author: { full_name: string | null } | null;
}

export async function getStudentSchedules(): Promise<StudentScheduleItem[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user)
    throw new Error("Sesi tidak valid atau telah berakhir.");

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("class_id")
      .eq("id", user.id)
      .single();

    const classId = profile?.class_id;

    const todayWIB = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Jakarta",
    });
    const startOfDay = `${todayWIB}T00:00:00+07:00`;

    const { data, error } = await supabase
      .from("schedules")
      .select(
        `
        id, 
        title, 
        event_date, 
        content,
        materials,
        is_announcement, 
        is_active,
        class:classes(name),
        author:profiles!author_id(full_name)
      `,
      )
      .eq("is_deleted", false)
      .gte("event_date", startOfDay)
      .or(`class_id.eq.${classId},class_id.is.null`)
      .order("event_date", { ascending: true });

    if (error) throw error;

    return (data as unknown as StudentScheduleItem[]) || [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Gagal mengambil jadwal: " + error.message);
    }
    throw new Error("Gagal mengambil jadwal: Kesalahan tidak dikenal.");
  }
}
