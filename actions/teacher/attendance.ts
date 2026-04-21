/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";
import {
  attendanceSchema,
  type AttendanceInput,
} from "@/lib/validations/attendance";
import { revalidatePath } from "next/cache";

export async function recordAttendance(data: AttendanceInput) {
  const supabase = await createClient();
  const validated = attendanceSchema.safeParse(data);

  if (!validated.success)
    return { success: false, error: validated.error.flatten().fieldErrors };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Auth failed" };

  const role = user.app_metadata?.role;
  if (role === "siswa")
    return {
      success: false,
      error: "Siswa tidak bisa mencatat absen sendiri!",
    };

  const { error } = await supabase.from("attendance_logs").insert({
    profile_id: validated.data.profile_id,
    schedule_id: validated.data.schedule_id,
    status: validated.data.status,
    recorded_by: user.id,
    method: "rfid",
  });

  if (error) return { success: false, error: "Gagal mencatat kehadiran" };

  revalidatePath("/pembina/classes", "layout");
  return { success: true, message: "Absensi berhasil dicatat" };
}

export async function recordManualAttendance(
  profileId: string,
  status: string,
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) return { success: false, error: "Sesi tidak valid." };

  const role = user.app_metadata?.role;
  if (role === "siswa")
    return { success: false, error: "Siswa tidak bisa mencatat absen!" };

  try {
    const { error } = await supabase.from("attendance_logs").insert({
      profile_id: profileId,
      status: status,
      method: "manual",
      recorded_by: user.id,
    });

    if (error) throw new Error(error.message);

    revalidatePath("/pembina/classes", "layout");
    return { success: true, message: "Absensi manual berhasil dicatat!" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAttendanceHistory(limit = 50) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("v_attendance_details")
    .select("*")
    .order("attendance_time", { ascending: false })
    .limit(limit);

  return error
    ? { success: false, error: error.message }
    : { success: true, data };
}
