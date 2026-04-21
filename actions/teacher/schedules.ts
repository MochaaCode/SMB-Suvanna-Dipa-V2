/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPembinaSchedules() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) throw new Error("Sesi tidak valid.");

  try {
    const { data: classesData } = await supabase
      .from("classes")
      .select("id, teacher_id, assistant_ids")
      .eq("is_deleted", false);

    const myClassIds =
      classesData
        ?.filter(
          (c) => c.teacher_id === user.id || c.assistant_ids?.includes(user.id),
        )
        .map((c) => c.id) || [];

    const todayWIB = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Jakarta",
    });
    const { data: schedules, error: schedErr } = await supabase
      .from("schedules")
      .select(
        "id, title, content, event_date, is_announcement, class_id, class:classes(name)",
      )
      .eq("is_deleted", false)
      .gte("event_date", `${todayWIB}T00:00:00+07:00`)
      .order("event_date", { ascending: true });

    if (schedErr) throw new Error(schedErr.message);

    const filteredSchedules = schedules?.filter(
      (s) =>
        s.is_announcement || (s.class_id && myClassIds.includes(s.class_id)),
    );

    return filteredSchedules || [];
  } catch (error: any) {
    throw new Error("Gagal memuat jadwal: " + error.message);
  }
}

export async function updateScheduleMaterial(
  scheduleId: number,
  content: string,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("schedules")
    .update({ content: content })
    .eq("id", scheduleId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/pembina/schedules");
  return { success: true, message: "Materi berhasil disimpan!" };
}
