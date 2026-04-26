/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface ExtendedSchedule {
  id: number;
  title: string;
  content: string | null;
  materials: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  is_active: boolean;
  is_deleted: boolean;
  is_announcement: boolean;
  class_id: number | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
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
        "id, title, content, materials, event_date, start_time, end_time, is_active, is_deleted, is_announcement, class_id, author_id, created_at, updated_at, class:classes!schedules_class_id_fkey(name)",
      )
      .in("class_id", classIds)
      .eq("is_deleted", false)
      .eq("is_announcement", false)
      .order("event_date", { ascending: false });

    if (schedErr) throw new Error(schedErr.message);

    const mapped = (schedules || []).map((s: any) => ({
      ...s,
      content:
        s.content === null
          ? null
          : typeof s.content === "string"
            ? s.content
            : JSON.stringify(s.content),
    }));

    return mapped as ExtendedSchedule[];
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

  const adminClient = createAdminClient();

  const { data: updated, error } = await adminClient
    .from("schedules")
    .update({
      materials,
      updated_at: new Date().toISOString(),
    })
    .eq("id", scheduleId)
    .select("id");

  if (error) return { success: false, error: error.message };

  if (!updated || updated.length === 0) {
    return { success: false, error: "Gagal memperbarui materi. Coba lagi." };
  }

  revalidatePath("/pembina/materials");
  revalidatePath("/siswa/schedule");
  return { success: true };
}
