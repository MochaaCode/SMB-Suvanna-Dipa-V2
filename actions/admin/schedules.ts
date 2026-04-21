/* eslint-disable @typescript-eslint/no-explicit-any */
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
    .order("event_date", { ascending: true });

  if (error) throw new Error(error.message);
  return data as unknown as ScheduleWithRelations[];
}

export async function upsertSchedule(formData: any, scheduleId?: number) {
  const { supabase, user } = await ensureAdmin();

  const payload = {
    ...formData,
    author_id: user.id,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (scheduleId) {
    const { error: updateErr } = await supabase
      .from("schedules")
      .update(payload)
      .eq("id", scheduleId);
    error = updateErr;
  } else {
    const { error: insertErr } = await supabase
      .from("schedules")
      .insert(payload);
    error = insertErr;
  }

  if (error) throw new Error(error.message);
  revalidatePath("/admin/schedules");
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

// ----------------------------------------
// FUNGSI BARU: PULIHKAN & HAPUS PERMANEN
// ----------------------------------------
export async function restoreSchedule(id: number) {
  const { supabase } = await ensureAdmin();
  const { error } = await supabase
    .from("schedules")
    .update({ is_deleted: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/schedules");
  return { success: true };
}

export async function hardDeleteSchedule(id: number) {
  const { supabase } = await ensureAdmin();
  const { error } = await supabase.from("schedules").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/schedules");
  return { success: true };
}

export async function toggleAttendanceActive(id: number, status: boolean) {
  const { supabase } = await ensureAdmin();

  if (status === true) {
    await supabase
      .from("schedules")
      .update({ is_active: false })
      .neq("id", id)
      .eq("is_active", true);
  }

  const { error } = await supabase
    .from("schedules")
    .update({ is_active: status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/schedules");
  revalidatePath("/admin/attendance");
  return { success: true };
}
