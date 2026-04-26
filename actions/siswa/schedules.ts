"use server";

import { createClient } from "@/lib/supabase/server";

export interface StudentScheduleItem {
  id: number;
  title: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
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

    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
    );
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const oneMonthAhead = new Date(now);
    oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1);

    const startRange = sevenDaysAgo.toISOString();
    const endRange = oneMonthAhead.toISOString();

    const { data, error } = await supabase
      .from("schedules")
      .select(
        `
        id,
        title,
        event_date,
        start_time,
        end_time,
        content,
        materials,
        is_announcement,
        is_active,
        class:classes(name),
        author:profiles!schedules_author_id_fkey(full_name)
      `,
      )
      .eq("is_deleted", false)
      .gte("event_date", startRange)
      .lte("event_date", endRange)
      .or(
        classId
          ? `class_id.eq.${classId},class_id.is.null`
          : "class_id.is.null",
      )
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
