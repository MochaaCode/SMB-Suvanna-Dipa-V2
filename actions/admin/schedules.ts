"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Schedule } from "@/types";

export interface ScheduleWithRelations extends Schedule {
  class: { id: number; name: string } | null;
  author: { id: string; full_name: string | null } | null;
}

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi berakhir.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Akses ditolak!");

  return { supabase, user };
}

export async function getSchedules(): Promise<ScheduleWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schedules")
    .select(
      `*, class:classes ( id, name ), author:profiles!author_id ( id, full_name )`,
    )
    .eq("is_deleted", false)
    .order("event_date", { ascending: true });

  if (error) throw new Error(error.message);
  return data as unknown as ScheduleWithRelations[];
}

export async function upsertSchedule(payload: {
  id?: number;
  title: string;
  event_date: string;
  class_id: number | null;
  content?: string | null;
  is_announcement?: boolean;
}) {
  const { supabase, user } = await ensureAdmin();

  const scheduleData = {
    ...payload,
    author_id: user.id,
    is_deleted: false,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("schedules")
    .upsert(scheduleData, { onConflict: "id" });

  if (error) throw new Error("Gagal simpan jadwal: " + error.message);

  revalidatePath("/admin/schedules");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function deleteSchedule(id: number) {
  const { supabase } = await ensureAdmin();
  const { error } = await supabase
    .from("schedules")
    .update({ is_deleted: true, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/schedules");
  return { success: true };
}

export async function toggleAttendanceActive(id: number, status: boolean) {
  const { supabase } = await ensureAdmin();
  const { error } = await supabase
    .from("schedules")
    .update({ is_active: status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/schedules");
  revalidatePath("/admin/attendance");
  return { success: true };
}

/**
 * 5. FUNGSI PENDUKUNG IOT (DIPERBAIKI BUG ZONA WAKTU)
 */
export async function getTodaySchedule(): Promise<Schedule | null> {
  const supabase = await createClient();
  const todayWIB = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Jakarta",
  }); // Format: YYYY-MM-DD

  const startOfDay = `${todayWIB}T00:00:00+07:00`;
  const endOfDay = `${todayWIB}T23:59:59+07:00`;

  const { data, error } = await supabase
    .from("schedules")
    .select("*")
    .eq("is_active", true)
    .eq("is_deleted", false)
    .gte("event_date", startOfDay)
    .lte("event_date", endOfDay)
    .maybeSingle();

  if (error) {
    console.error("Error getTodaySchedule:", error.message);
    return null;
  }

  return data as Schedule | null;
}
