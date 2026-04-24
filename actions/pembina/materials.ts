/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Schedule } from "@/types";

export interface ExtendedSchedule extends Schedule {
  class: { name: string } | null;
}

export async function getPembinaMaterials(): Promise<ExtendedSchedule[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi tidak valid.");

  try {
    const { data: myClasses } = await supabase
      .from("classes")
      .select("id")
      .or(`teacher_id.eq.${user.id},assistant_ids.cs.{${user.id}}`)
      .eq("is_deleted", false);

    const classIds = myClasses?.map((c) => c.id) || [];

    if (classIds.length === 0) return [];

    const { data: schedules, error: schedErr } = await supabase
      .from("schedules")
      .select(
        "id, title, description:content, date:event_date, is_active, is_deleted, created_at, updated_at, class_id, class:classes(name)",
      )
      .in("class_id", classIds)
      .eq("is_deleted", false)
      .order("event_date", { ascending: false });

    if (schedErr) throw new Error(schedErr.message);

    const formattedSchedules = (schedules || []).map((s: any) => ({
      ...s,
      start_time: s.date
        ? new Date(s.date).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "00:00",
      end_time: "00:00",
      type: "Materi Kelas",
      speaker_id: null,
    }));

    return formattedSchedules as unknown as ExtendedSchedule[];
  } catch (error: any) {
    throw new Error("Gagal memuat daftar materi: " + error.message);
  }
}

export async function updateMaterialContent(
  scheduleId: number,
  description: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi berakhir.");

  const { error } = await supabase
    .from("schedules")
    .update({
      content: description,
      updated_at: new Date().toISOString(),
    })
    .eq("id", scheduleId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/pembina/materials");
  revalidatePath("/siswa/schedule");
  return { success: true };
}
