"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import type {
  AttendanceLogWithProfile,
  AttendanceStatus,
  Profile,
} from "@/types";

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

  if (profile?.role !== "admin") throw new Error("Akses ditolak: Terlarang!");

  return { supabase, user };
}

export async function getTodayAttendanceLogs(
  scheduleId: number,
): Promise<AttendanceLogWithProfile[]> {
  const { supabase } = await ensureAdmin();
  const { data, error } = await supabase
    .from("attendance_logs")
    .select(`*, profiles:profile_id ( full_name, role )`)
    .eq("schedule_id", scheduleId)
    .order("scan_time", { ascending: false });

  if (error) return [];
  return data as unknown as AttendanceLogWithProfile[];
}

export async function getAttendanceStats(scheduleId: number) {
  const { supabase } = await ensureAdmin();
  const { data, error } = await supabase
    .from("attendance_logs")
    .select("status")
    .eq("schedule_id", scheduleId);

  if (error || !data) return { hadir: 0, terlambat: 0, totalScan: 0 };

  return {
    hadir: data.filter((d) => d.status === "hadir").length,
    terlambat: data.filter((d) => d.status === "terlambat").length,
    totalScan: data.length,
  };
}

export async function getEligibleStudents(
  classId: number | null,
): Promise<Profile[]> {
  const { supabase } = await ensureAdmin();
  let query = supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("role", "siswa")
    .eq("is_deleted", false)
    .order("full_name", { ascending: true });

  if (classId) {
    query = query.eq("class_id", classId);
  }

  const { data, error } = await query;
  if (error) return [];
  return data as Profile[];
}

export async function recordManualAttendance(payload: {
  scheduleId: number;
  profileId: string;
  status: AttendanceStatus;
  notes: string;
}) {
  const { supabase, user } = await ensureAdmin();

  const { data: existingLog } = await supabase
    .from("attendance_logs")
    .select("id")
    .eq("schedule_id", payload.scheduleId)
    .eq("profile_id", payload.profileId)
    .single();

  if (existingLog) {
    const { error } = await supabase
      .from("attendance_logs")
      .update({
        status: payload.status,
        method: "manual",
        notes: payload.notes,
        recorded_by: user.id,
      })
      .eq("id", existingLog.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("attendance_logs").insert({
      schedule_id: payload.scheduleId,
      profile_id: payload.profileId,
      status: payload.status,
      method: "manual",
      notes: payload.notes,
      recorded_by: user.id,
    });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/attendance");
  return { success: true };
}

export async function finalizeAttendance(
  scheduleId: number,
  classId: number | null,
) {
  const { supabase } = await ensureAdmin();

  let query = supabase
    .from("profiles")
    .select("id")
    .eq("role", "siswa")
    .eq("is_deleted", false);

  if (classId) query = query.eq("class_id", classId);

  const { data: allStudents, error: studentErr } = await query;
  if (studentErr || !allStudents) throw new Error("Gagal menarik data siswa.");

  const { data: presentLogs, error: logErr } = await supabase
    .from("attendance_logs")
    .select("profile_id")
    .eq("schedule_id", scheduleId);

  if (logErr) throw new Error("Gagal menarik log kehadiran.");

  const presentStudentIds = new Set(
    presentLogs?.map((log) => log.profile_id) || [],
  );

  const alpaStudents = allStudents
    .filter((student) => !presentStudentIds.has(student.id))
    .map((student) => ({
      profile_id: student.id,
      schedule_id: scheduleId,
      status: "alpa" as AttendanceStatus,
      method: "manual" as const,
      notes: "Sesi ditutup otomatis oleh admin (Siswa tidak hadir)",
    }));

  if (alpaStudents.length > 0) {
    const { error: insertErr } = await supabase
      .from("attendance_logs")
      .insert(alpaStudents);
    if (insertErr) throw insertErr;
  }

  await supabase
    .from("schedules")
    .update({ is_active: false })
    .eq("id", scheduleId);

  revalidatePath("/admin/attendance");
  revalidatePath("/admin/schedules");
  return { success: true, count: alpaStudents.length, message: "Sesi Selesai" };
}
