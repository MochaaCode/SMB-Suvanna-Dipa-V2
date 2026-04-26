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
        "id, title, content, materials, date:event_date, is_active, is_deleted, is_announcement, created_at, updated_at, class_id, start_time, end_time, author_id, schedule_id, class:classes(name)",
      )
      .in("class_id", classIds)
      .eq("is_deleted", false)
      .eq("is_announcement", false)
      .order("event_date", { ascending: false });

    if (schedErr) throw new Error(schedErr.message);

    return (schedules || []) as unknown as ExtendedSchedule[];
  } catch (error: any) {
    throw new Error("Gagal memuat daftar materi: " + error.message);
  }
}

export async function updateMaterialContent(
  scheduleId: number,
  materials: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi berakhir.");

  const { data: schedule } = await supabase
    .from("schedules")
    .select("class_id")
    .eq("id", scheduleId)
    .single();

  if (!schedule) return { success: false, error: "Jadwal tidak ditemukan." };

  const { data: myClass } = await supabase
    .from("classes")
    .select("id")
    .eq("id", schedule.class_id)
    .or(`teacher_id.eq.${user.id},assistant_ids.cs.{${user.id}}`)
    .single();

  if (!myClass) return { success: false, error: "Akses ditolak." };

  const { error } = await supabase
    .from("schedules")
    .update({
      materials: materials,
      updated_at: new Date().toISOString(),
    })
    .eq("id", scheduleId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/pembina/materials");
  revalidatePath("/siswa/schedule");
  return { success: true };
}
