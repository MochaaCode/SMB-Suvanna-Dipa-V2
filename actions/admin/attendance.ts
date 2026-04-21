"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// IMPORT TIPE KETAT
import type { AttendanceLogWithProfile, AttendanceStatus } from "@/types";

// HELPER: Proteksi Admin
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

  return supabase;
}

/**
 * 1. MENGAMBIL LOG KEHADIRAN HARI INI
 */
export async function getTodayAttendanceLogs(
  scheduleId: number,
): Promise<AttendanceLogWithProfile[]> {
  const supabase = await ensureAdmin();
  const { data, error } = await supabase
    .from("attendance_logs")
    .select(`*, profiles:profile_id ( full_name, role )`)
    .eq("schedule_id", scheduleId)
    .order("scan_time", { ascending: false });

  if (error) return [];

  // Type Casting yang aman
  return data as unknown as AttendanceLogWithProfile[];
}

/**
 * 2. STATISTIK PRESENSI (Live Dashboard)
 */
export async function getAttendanceStats(scheduleId: number): Promise<{
  hadir: number;
  terlambat: number;
  totalScan: number;
}> {
  const supabase = await ensureAdmin();
  const { data: logs, error } = await supabase
    .from("attendance_logs")
    .select("status")
    .eq("schedule_id", scheduleId);

  if (error || !logs) return { hadir: 0, terlambat: 0, totalScan: 0 };

  return {
    hadir: logs.filter((l) => l.status === "hadir").length,
    terlambat: logs.filter((l) => l.status === "terlambat").length,
    totalScan: logs.length,
  };
}

/**
 * 3. UPDATE STATUS MANUAL (Admin Fix)
 */
export async function updateAttendanceManual(
  logId: number,
  status: AttendanceStatus, // FIX: Menggunakan literal type bukan sekadar string
) {
  const supabase = await ensureAdmin();
  const { error } = await supabase
    .from("attendance_logs")
    .update({
      status,
      method: "manual",
      notes: "Diubah manual oleh admin",
    })
    .eq("id", logId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/attendance");
  return { success: true };
}

/**
 * 4. FINALISASI ALPA OTOMATIS
 * Membandingkan daftar siswa dengan yang sudah tap kartu
 */
export async function finalizeAttendance(
  scheduleId: number,
  classId: number | null,
) {
  const supabase = await ensureAdmin();

  // A. Ambil semua profil dengan role 'siswa'
  let studentQuery = supabase
    .from("profiles")
    .select("id")
    .eq("role", "siswa")
    .eq("is_deleted", false);

  if (classId) studentQuery = studentQuery.eq("class_id", classId);

  const { data: allStudents, error: studentErr } = await studentQuery;
  if (studentErr) throw new Error("Gagal menarik daftar siswa.");

  if (!allStudents || allStudents.length === 0) {
    await supabase
      .from("schedules")
      .update({ is_active: false })
      .eq("id", scheduleId);

    revalidatePath("/admin/attendance");
    return { success: true, count: 0, message: "Tidak ada siswa ditemukan" };
  }

  // B. Cek siapa yang sudah masuk log (Hadir/Terlambat/Izin)
  const { data: presentLogs, error: logErr } = await supabase
    .from("attendance_logs")
    .select("profile_id")
    .eq("schedule_id", scheduleId);

  if (logErr) throw new Error("Gagal menarik log kehadiran.");

  const presentStudentIds = new Set(
    presentLogs?.map((log) => log.profile_id) || [],
  );

  // C. Tandai yang tidak ada sebagai ALPA
  const alpaStudents = allStudents
    .filter((student) => !presentStudentIds.has(student.id))
    .map((student) => ({
      profile_id: student.id,
      schedule_id: scheduleId,
      status: "alpa" as AttendanceStatus,
      method: "manual" as const,
      notes: "Sesi ditutup otomatis oleh admin (Siswa tidak tap kartu)",
    }));

  if (alpaStudents.length > 0) {
    const { error: insertErr } = await supabase
      .from("attendance_logs")
      .insert(alpaStudents);
    if (insertErr) throw insertErr;
  }

  // D. Tutup gerbang presensi
  const { error: closeErr } = await supabase
    .from("schedules")
    .update({ is_active: false })
    .eq("id", scheduleId);
  if (closeErr) throw closeErr;

  revalidatePath("/admin/attendance");
  revalidatePath("/admin/schedules");
  return { success: true, count: alpaStudents.length };
}
